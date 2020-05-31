const managerRoute = require('express').Router();
const authenticate = require('../../middlewares/auth/Authenticate');
const CreatePostConfigDto = require('../../dto/manager/post/CreatePostConfigDto');
const ManagerService = require('../../services/manager/ManagerService');
const ManagerPostEventCenter = require('../../events/manager/post/ManagerPostEventCenter');
const CreatePostResponseDto = require('../../dto/manager/post/CreatePostResponseDto');


const managerService = new ManagerService();
const managerPostEventCenter = new ManagerPostEventCenter();

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

    managerPostEventCenter.addListener(managerPostEventCenter.CREATE_POST_SUCCEED, createPostSucceed);
    managerPostEventCenter.addListener(managerPostEventCenter.CREATE_POST_ERROR, createPostError);
    managerService.createPost(dto);
});

module.exports = managerRoute;