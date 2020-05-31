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

const postRepository = new PostRepository();
const postCategoryRepository = new PostCategoryRepository();
const postTagRepository = new PostTagRepository();

const slugUtil = new SlugUtil();
const managerPostEventCenter = new ManagerPostEventCenter();

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
}

module.exports = ManagerService;