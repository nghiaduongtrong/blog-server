const PostRepository = require('../../repository/PostRepository');
const PostCategoryRepository = require('../../repository/PostCategoryRepository');
const PostTagRepository = require('../../repository/PostTagRepository');
const CreatePostConfigDto = require('../../dto/manager/post/CreatePostConfigDto');
const Post = require('../../models/Post');
const SlugUtil = require('../../utils/slug/SlugUtil');
const ManagerEventCenter = require('../../events/manager/ManagerEventCenter');
const CreatePostResponseDto = require('../../dto/manager/post/CreatePostResponseDto');
const ManagerPostMessage = require('../../messages/manager/post/ManagerPostMessage');
const MessageType = require('../../consts/MessageType');
const GetPostsQueryParamsConfigDto = require('../../dto/manager/post/GetPostsQueryParamsConfigDto');
const CategoryRepository = require('../../repository/CategoryRepository');
const GetPostsResponseDto = require('../../dto/manager/post/GetPostsResponseDto');
const PostStatus = require('../../consts/PostStatus');
const PropertyUtils = require('../../utils/PropertyUtils');
const UserRepository = require('../../repository/UserRepository');
const ManagerResponseConst = require('../../consts/response/ManagerResponseConst');
const OrderConst = require('../../consts/OrderConst');
const PostsParamsConst = require('../../consts/manager/PostsParamsConst');
const PostViewRepository = require('../../repository/PostViewRepository');
const GetPostDetailConfigDto = require('../../dto/manager/post/GetPostDetailConfigDto');
const GetPostDetailResponseDto = require('../../dto/manager/post/GetPostDetailResponseDto');
const TagRepository = require('../../repository/TagRepository');
const CreateCategoryConfigDto = require('../../dto/manager/category/CreateCategoryConfigDto');
const Category = require('../../models/Category');
const CreateCategoryResponseDto = require('../../dto/manager/category/CreateCategoryResponseDto');
const ManagerMessageCommon = require('../../messages/manager/ManagerMessageCommon');
const DateUtils = require('../../utils/DateUtils');
const UpdateCategoryConfigDto = require('../../dto/manager/category/UpdateCategoryConfigDto');
const UpdateCategoryResponseDto = require('../../dto/manager/category/UpdateCategoryResponseDto');
const DeleteCategoryConfigDto = require('../../dto/manager/category/DeleteCategoryConfigDto');
const DeleteCategoryResponseDto = require('../../dto/manager/category/DeleteCategoryResponseDto');
const CreateTagConfigDto = require('../../dto/manager/tag/CreateTagConfigDto');
const Tag = require('../../models/Tag');
const CreateTagResponseDto = require('../../dto/manager/tag/CreateTagResponseDto');
const DeleteTagConfigDto = require('../../dto/manager/tag/DeleteTagConfigDto');
const DeleteTagResponseDto = require('../../dto/manager/tag/DeleteTagResponseDto');
const UpdateTagConfigDto = require('../../dto/manager/tag/UpdateTagConfigDto');
const UpdateTagResponseDto = require('../../dto/manager/tag/UpdateTagResponseDto');

const postRepository = new PostRepository();
const postCategoryRepository = new PostCategoryRepository();
const postTagRepository = new PostTagRepository();
const categoryRepository = new CategoryRepository();
const userRepository = new UserRepository();
const postViewRepository = new PostViewRepository();
const tagRepository = new TagRepository();

const managerResponseConst = new ManagerResponseConst();
const orderConst = new OrderConst();
const postsParamsConst = new PostsParamsConst();

const slugUtil = new SlugUtil();
const managerEventCenter = new ManagerEventCenter();

const propertyUtils = new PropertyUtils();
const dateUtils = new DateUtils();

class ManagerService {

    /* ======================================================================= POST ======================================================================= */

    /**
     * @param {CreatePostConfigDto} dto 
     * @returns {CreatePostResponseDto} response 
     */
    createPost = async (dto = new CreatePostConfigDto()) => {
        try {
            const post = new Post();
            post.authorId = dto.authorId;
            post.parentId = dto.parentId;
            post.title = dto.title;
            post.metaTitle = dto.metaTitle;
            post.slug = slugUtil.slug(dto.title);
            post.summary = dto.summary;
            post.content = dto.content;
            post.createdAt = dateUtils.formatyyyMMddHHmmss(Date.now());

            const postCreated = await postRepository.createPost(post);

            await Promise.all(dto.categoryIds.map(categoryId => {
                postCategoryRepository.createPostCategory(postCreated.insertId, categoryId);
            }));

            await Promise.all(dto.tagIds.map(tagId => {
                postTagRepository.createPostTag(postCreated.insertId, tagId);
            }));

            let response = new CreatePostResponseDto();
            response.isSucceed = true;

            managerEventCenter.fireEvent(managerEventCenter.CREATE_POST_SUCCEED, response);

        } catch (err) {
            console.log(err);
            let response = new CreatePostResponseDto();
            response.isSucceed = false;
            response.messageType = MessageType.ERROR;
            response.message = ManagerMessageCommon.ERROR;

            managerEventCenter.fireEvent(managerEventCenter.CREATE_POST_ERROR, response);
        }
    }

    /**
     * @param {GetPostsQueryParamsConfigDto}  params
     * @returns {} response 
     */
    getPosts = async (params = new GetPostsQueryParamsConfigDto()) => {
        try {
            let options = [];
            if (Array.isArray(params.status)) {
                options = await Promise.all(params.status.map(async status => {
                    let optionParams = {};
                    if (status === PostStatus.PUBLISHED) {
                        optionParams[postsParamsConst.PUBLISHED] = true;
                        optionParams[postsParamsConst.DELETED] = false;
                    }
                    if (status === PostStatus.DRAFT) {
                        optionParams[postsParamsConst.PUBLISHED] = false;
                        optionParams[postsParamsConst.DELETED] = false;
                    }
                    if (status === PostStatus.DELETE) {
                        optionParams[postsParamsConst.DELETED] = true;
                    }
                    // TODO: => search full text
                    if (params.search) {
                        optionParams[postsParamsConst.TITLE] = params.search;
                    }

                    const category = await categoryRepository.getCategoryBySlug(params.category);
                    if (category) {
                        optionParams[postsParamsConst.CATEGORY_ID] = category.id;
                    }

                    return optionParams;
                }));
            }

            let order = orderConst.DESC;
            if (params.order) {
                order = params.order.toUpperCase();
            }

            let skip = null;
            let limit = null;

            if (params.number) {
                limit = params.number;
            }

            if (params.number && params.page) {
                skip = (params.page - 1) * params.number;
            }

            let posts = [];
            await Promise.all(options.map(async option => {
                const postResults = await postRepository.getPosts(option, limit, skip, order);
                posts = posts.concat(postResults);
            }));


            const data = await Promise.all(posts.map(async post => {
                post = propertyUtils.getProperties(post, managerResponseConst.POST_PRIMARY);

                let categories = await categoryRepository.getCategoriesOfPost(post.id);
                categories = categories.map(category => {
                    return propertyUtils.getProperties(category, managerResponseConst.CATEGORY_BASIC);
                });

                let author = await userRepository.getUserWritePost(post.id);
                author = propertyUtils.getProperties(author, managerResponseConst.AUTHOR_BASIC);

                let viewCount = await postViewRepository.getViewCountOfPost(post.id);

                post.categories = categories;
                post.author = author;
                post.viewCount = viewCount;

                return post;
            }));

            let response = new GetPostsResponseDto();
            response.isSucceed = true;
            response.posts = data;

            managerEventCenter.fireEvent(managerEventCenter.GET_POSTS_SUCCEED, response);

        } catch (err) {
            console.log(err);
            let response = new GetPostsResponseDto();
            response.isSucceed = false;
            response.messageType = MessageType.ERROR;
            response.message = ManagerMessageCommon.ERROR;
            response.posts = null;

            managerEventCenter.fireEvent(managerEventCenter.GET_POSTS_ERROR, response);
        }

    }

    /**
     * @param {GetPostDetailConfigDto}  dto
     * @returns {} response 
     */
    getPostDetail = async (dto = new GetPostDetailConfigDto()) => {
        try {
            let post = await postRepository.getPost(dto.postId);
            if (!post) {
                let response = new GetPostDetailResponseDto();
                response.isSucceed = false;
                response.messageType = MessageType.ERROR;
                response.message = ManagerPostMessage.GET_POST_DETAIL_NOT_FOUND_POST;
                response.post = null;

                managerEventCenter.fireEvent(managerEventCenter.GET_POST_DETAIL_ERROR, response);
                return;
            }

            let categories = await categoryRepository.getCategoriesOfPost(post.id);
            categories = categories.map(category => {
                return propertyUtils.getProperties(category, managerResponseConst.CATEGORY_BASIC);
            });

            let author = await userRepository.getUserWritePost(post.id);
            author = propertyUtils.getProperties(author, managerResponseConst.AUTHOR_BASIC);

            let viewCount = await postViewRepository.getViewCountOfPost(post.id);

            post.categories = categories;
            post.author = author;
            post.viewCount = viewCount;

            const postTags = await postTagRepository.getPostTagsByPostId(dto.postId);
            let tags = [];
            await Promise.all(postTags.map(async postTag => {
                const tag = await tagRepository.getTag(postTag.tagId);
                if (tag) {
                    tags.push(tag);
                }
            }));

            post.tags = tags;

            let response = new GetPostDetailResponseDto();
            response.isSucceed = true;
            response.post = post;

            managerEventCenter.fireEvent(managerEventCenter.GET_POST_DETAIL_SUCCEED, response);
        } catch (err) {
            console.log(err);
            let response = new GetPostDetailResponseDto();
            response.isSucceed = false;
            response.messageType = MessageType.ERROR;
            response.message = ManagerMessageCommon.ERROR;
            response.post = null;

            managerEventCenter.fireEvent(managerEventCenter.GET_POST_DETAIL_ERROR, response);
        }
    }


    /* ======================================================================= CATEGORY ======================================================================= */
    /**
     * @param {CreateCategoryConfigDto}  dto
     * @returns {} response 
     */
    createCategory = async (dto = new CreateCategoryConfigDto()) => {
        try {
            const category = new Category();
            category.parentId = dto.parentId;
            category.title = dto.title;
            category.description = dto.description;
            category.createdAt = dateUtils.formatyyyMMddHHmmss(Date.now());
            category.slug = slugUtil.slug(dto.title);

            const isCreatedCategory = await categoryRepository.createCategory(category);
            if (isCreatedCategory) {
                const response = new CreateCategoryResponseDto();
                response.isSucceed = true;
                managerEventCenter.fireEvent(managerEventCenter.CREATE_CATEGORY_SUCCEED, response);
            } else {
                throw new Error('Can not create category.');
            }
        } catch (err) {
            console.log(err);
            let response = new CreateCategoryResponseDto();
            response.isSucceed = false;
            response.messageType = MessageType.ERROR;
            response.message = ManagerMessageCommon.ERROR;
            managerEventCenter.fireEvent(managerEventCenter.CREATE_CATEGORY_ERROR, response);
        }
    }

    /**
    * @param {UpdateCategoryConfigDto}  dto
    * @returns {} response 
    */
    updateCategory = async (dto = new UpdateCategoryConfigDto()) => {
        try {
            const category = new Category();
            category.parentId = dto.parentId;
            category.title = dto.title;
            category.description = dto.description;
            category.slug = slugUtil.slug(dto.title);
            category.updatedAt = dateUtils.formatyyyMMddHHmmss(Date.now());

            const categoryId = dto.id;

            const isUpdatedCategory = await categoryRepository.updateCategory(categoryId, category);

            if (isUpdatedCategory) {
                let response = new UpdateCategoryResponseDto();
                response.isSucceed = true;

                managerEventCenter.fireEvent(managerEventCenter.UPDATE_CATEGORY_SUCCEED, response);
            } else {
                throw new Error('Can not update category.');
            }
        } catch (err) {
            console.log(err);
            let response = new UpdateCategoryResponseDto();

            response.isSucceed = false;
            response.messageType = MessageType.ERROR;
            response.messageType = ManagerMessageCommon.ERROR;
            managerEventCenter.fireEvent(managerEventCenter.UPDATE_CATEGORY_ERROR, response);
        }
    }

    /**
    * @param {DeleteCategoryConfigDto}  dto
    * @returns {} response 
    */
    deleteCategory = async (dto = new DeleteCategoryConfigDto()) => {
        try {
            const categoryId = dto.id;

            const isDeleted = await categoryRepository.deleteCategory(categoryId);
            if (isDeleted) {
                let response = new DeleteCategoryResponseDto();
                response.isSucceed = true;
                managerEventCenter.fireEvent(managerEventCenter.DELETE_CATEGORY_SUCCEED, response);
            } else {
                throw new Error('Can not delete category.');
            }
        } catch (err) {
            console.log(err);
            let response = new DeleteCategoryResponseDto();
            response.isSucceed = false;
            response.messageType = MessageType.ERROR;
            response.message = ManagerMessageCommon.ERROR;
            managerEventCenter.fireEvent(managerEventCenter.DELETE_CATEGORY_ERROR, response);
        }
    }

    /* ======================================================================= TAG ======================================================================= */

    /**
    * @param {CreateTagConfigDto}  dto
    * @returns {} response 
    */
    createTag = async (dto = new CreateTagConfigDto()) => {
        try {
            const tag = new Tag();
            tag.title = dto.title;
            tag.description = dto.description;
            tag.slug = slugUtil.slug(dto.title);
            tag.createdAt = dateUtils.formatyyyMMddHHmmss(Date.now());

            const isCreated = await tagRepository.createTag(tag);
            if (isCreated) {
                let response = new CreateTagResponseDto();
                response.isSucceed = true;
                managerEventCenter.fireEvent(managerEventCenter.CREATE_TAG_SUCCEED, response);
            } else {
                throw new Error('Can not create tag.');
            }
        } catch (err) {
            console.log(err);
            let response = new CreateTagResponseDto();
            response.isSucceed = false;
            response.messageType = MessageType.ERROR;
            response.message = ManagerMessageCommon.ERROR;
            managerEventCenter.fireEvent(managerEventCenter.CREATE_TAG_ERROR, response);
        }
    }

    /**
    * @param {DeleteTagConfigDto}  dto
    * @returns {} response 
    */
    deleteTag = async (dto = new DeleteTagConfigDto()) => {
        try {
            const tagId = dto.id;

            const isDeleted = await tagRepository.deleteTag(tagId);
            if (isDeleted) {
                let response = new DeleteTagResponseDto();
                response.isSucceed = true;
                managerEventCenter.fireEvent(managerEventCenter.DELETE_TAG_SUCCEED, response);
            } else {
                throw new Error('Can not delete tag.');
            }
        } catch (err) {
            console.log(err);
            let response = new DeleteTagResponseDto();
            response.isSucceed = false;
            response.messageType = MessageType.ERROR;
            response.message = ManagerMessageCommon.ERROR;
            managerEventCenter.fireEvent(managerEventCenter.DELETE_TAG_ERROR, response);
        }
    }

    /**
    * @param {UpdateTagConfigDto}  dto
    * @returns {} response 
    */
    updateTag = async (dto = new UpdateTagConfigDto()) => {
        try {
            const tag = new Tag();
            tag.title = dto.title;
            tag.description = dto.description;
            tag.slug = slugUtil.slug(dto.title);
            tag.updatedAt = dateUtils.formatyyyMMddHHmmss(Date.now());

            const tagId = dto.id;

            const isUpdated = await tagRepository.updateTag(tagId, tag);
            if (isUpdated) {
                let response = new UpdateTagResponseDto();
                response.isSucceed = true;
                managerEventCenter.fireEvent(managerEventCenter.UPDATE_TAG_SUCCEED, response);
            } else {
                throw new Error('Can not update tag.');
            }
        } catch (err) {
            console.log(err);
            let response = new UpdateTagResponseDto();
            response.isSucceed = false;
            response.messageType = MessageType.ERROR;
            response.messageType = ManagerMessageCommon.ERROR;
            managerEventCenter.fireEvent(managerEventCenter.UPDATE_TAG_ERROR, response);
        }
    }
}

module.exports = ManagerService;