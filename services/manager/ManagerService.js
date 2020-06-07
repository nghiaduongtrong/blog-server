const PostRepository = require('../../repository/PostRepository');
const PostCategoryRepository = require('../../repository/PostCategoryRepository');
const PostTagRepository = require('../../repository/PostTagRepository');
const CreatePostConfigDto = require('../../dto/manager/post/CreatePostConfigDto');
const Post = require('../../models/Post');
const SlugUtil = require('../../utils/slug/SlugUtil');
const ManagerPostEventCenter = require('../../events/manager/post/ManagerPostEventCenter');
const CreatePostResponseDto = require('../../dto/manager/post/CreatePostResponseDto');
const ManagerPostMessage = require('../../consts/manager/ManagerPostMessage');
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

const postRepository = new PostRepository();
const postCategoryRepository = new PostCategoryRepository();
const postTagRepository = new PostTagRepository();
const categoryRepository = new CategoryRepository();
const userRepository = new UserRepository();
const postViewRepository = new PostViewRepository();

const managerResponseConst = new ManagerResponseConst();
const orderConst = new OrderConst();
const postsParamsConst = new PostsParamsConst();

const slugUtil = new SlugUtil();
const managerPostEventCenter = new ManagerPostEventCenter();

const propertyUtils = new PropertyUtils();
/**
 * @returns {CreatePostResponseDto} response 
 */
const createPostSucceedResult = () => {
    const response = new CreatePostResponseDto();
    response.isSucceed = true;

    return response;
}

/**
 * @param {String} message 
 * @returns {CreatePostResponseDto} response 
 */
const createPostErrorResult = (message) => {
    const response = new CreatePostResponseDto();
    response.isSucceed = false;
    response.messageType = MessageType.ERROR;
    response.message = message;

    return response;
}

/**
 * @param {String} message 
 * @returns {GetPostsResponseDto} response 
 */
const getPostsErrorResult = (message) => {
    const response = new GetPostsResponseDto();
    response.isSucceed = false;
    response.messageType = MessageType.ERROR;
    response.message = message;

    return response;
}

/**
 * @param {Array} posts 
 * @returns {GetPostsResponseDto} response 
 */
const getPostsSucceedResult = (posts) => {
    const response = new GetPostsResponseDto();
    response.isSucceed = true;
    response.posts = posts;

    return response;
}
class ManagerService {
    /**
     * @param {CreatePostConfigDto} config 
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
            //TODO: sửa lại đúng model (đang thiếu createdAt và updatedAt )

            const postCreated = await postRepository.createPost(post);

            await Promise.all(dto.categoryIds.map(categoryId => {
                postCategoryRepository.createPostCategory(postCreated.insertId, categoryId);
            }));

            await Promise.all(dto.tagIds.map(tagId => {
                postTagRepository.createPostTag(postCreated.insertId, tagId);
            }));

            const response = createPostSucceedResult();
            managerPostEventCenter.fireEvent(managerPostEventCenter.CREATE_POST_SUCCEED, response);

        } catch (err) {
            console.log(err);
            const response = createPostErrorResult(ManagerPostMessage.ERROR);
            managerPostEventCenter.fireEvent(managerPostEventCenter.CREATE_POST_ERROR, response);
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
             
            const response = getPostsSucceedResult(data);
            managerPostEventCenter.fireEvent(managerPostEventCenter.GET_POSTS_SUCCEED, response);

        } catch (err) {
            console.log(err);
            const response = getPostsErrorResult(ManagerPostMessage.ERROR);
            managerPostEventCenter.fireEvent(managerPostEventCenter.GET_POSTS_ERROR, response);
        }

    }
}

module.exports = ManagerService;