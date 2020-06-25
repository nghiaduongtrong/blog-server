const managerRoute = require('express').Router();
const authenticate = require('../../middlewares/auth/Authenticate');
const CreatePostConfigDto = require('../../dto/manager/post/CreatePostConfigDto');
const ManagerService = require('../../services/manager/ManagerService');
const ManagerEventCenter = require('../../events/manager/ManagerEventCenter');
const CreatePostResponseDto = require('../../dto/manager/post/CreatePostResponseDto');
const GetPostsQueryParamsConfigDto = require('../../dto/manager/post/GetPostsQueryParamsConfigDto');
const GetPostDetailConfigDto = require('../../dto/manager/post/GetPostDetailConfigDto');
const CreateCategoryConfigDto = require('../../dto/manager/category/CreateCategoryConfigDto');

const managerService = new ManagerService();
const managerEventCenter = new ManagerEventCenter();

/** create post
 * [POST] api/manager/posts
 * @returns {CreatePostResponseDto} response
 */
managerRoute.post('/posts', authenticate, (req, res) => {
    const postData = req.body;
    const user = req.user;

    const dto = new CreatePostConfigDto();
    dto.authorId = user.id;
    dto.parentId = postData.parentId;
    dto.categoryIds = postData.categoryIds;
    dto.title = postData.title;
    dto.metaTitle = postData.metaTitle;
    dto.summary = postData.summary;
    dto.content = postData.content;
    dto.tagIds = postData.tagIds;

    const createPostSucceed = (response = new CreatePostResponseDto()) => {
        res.json(response);
    }

    const createPostError = (response = new CreatePostResponseDto()) => {
        res.json(response);
    }

    managerEventCenter.addListener(managerEventCenter.CREATE_POST_SUCCEED, createPostSucceed);
    managerEventCenter.addListener(managerEventCenter.CREATE_POST_ERROR, createPostError);
    managerService.createPost(dto);
});

/** get posts
 * [GET] api/manager/posts
 * @returns {} response
 */
managerRoute.get('/posts', authenticate, (req, res) => {
    const queryParams = req.query;
    const params = new GetPostsQueryParamsConfigDto();
    params.search = queryParams.search;
    queryParams.status && (params.status = queryParams.status.split(','));
    params.category = queryParams.category;
    params.order = queryParams.order;
    params.number = queryParams.number;
    params.page = queryParams.page;

    const getPostsSucceed = (response) => {
        res.json(response);
    }

    const getPostsError = (response) => {
        res.json(response);
    }

    managerEventCenter.addListener(managerEventCenter.GET_POSTS_SUCCEED, getPostsSucceed);
    managerEventCenter.addListener(managerEventCenter.GET_POSTS_ERROR, getPostsError);
    
    managerService.getPosts(params);
});

/** get post detail
 * [GET] api/manager/posts/123
 * @returns {} response
 */
managerRoute.get('/posts/:postId', authenticate, (req, res) => {
    const params = req.params;
    const dto = new GetPostDetailConfigDto();
    dto.postId = params.postId;

    const getPostDetailSucceed = (response) => {
        res.json(response);
    }

    const getPostDetailError = (response) => {
        res.json(response);
    }

    managerEventCenter.addListener(managerEventCenter.GET_POST_DETAIL_SUCCEED, getPostDetailSucceed);
    managerEventCenter.addListener(managerEventCenter.GET_POST_DETAIL_ERROR, getPostDetailError);
    managerService.getPostDetail(dto);
});

/** create category
 * [POST] api/manager/categories
 * @returns {} response
 */
managerRoute.post('/categories', authenticate, (req, res) => {
    const postData = req.body;
    const dto = new CreateCategoryConfigDto();
    dto.parentId = postData.parentId;
    dto.title = postData.title;
    dto.description = postData.description;
    dto.createdAt = Date.now();

    const createCategorySucceed = (response) => {
        res.json(response);
    }
    
    const createCategoryError = (response) => {
        res.json(response);
    }

    managerEventCenter.addListener(managerEventCenter.CREATE_CATEGORY_SUCCEED, createCategorySucceed);
    managerEventCenter.addListener(managerEventCenter.CREATE_CATEGORY_ERROR, createCategoryError);

    managerService.createCategory(dto);
});

module.exports = managerRoute;