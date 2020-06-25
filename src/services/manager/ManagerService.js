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
            if(Array.isArray(params.status)) {
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
            category.createdAt = dateUtils.formatyyyMMddHHmmss(dto.createdAt);
            category.slug = slugUtil.slug(dto.title);

            const isCategoryCreated = await categoryRepository.createCategory(category);
            if (isCategoryCreated) {
                const response = new CreateCategoryResponseDto();
                response.isSucceed = true;
                managerEventCenter.fireEvent(managerEventCenter.CREATE_CATEGORY_SUCCEED, response);
            } else {
                throw new Error();
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
}

module.exports = ManagerService;