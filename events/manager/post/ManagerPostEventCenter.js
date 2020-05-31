const BaseEvent = require('../../BaseEvent');

class ManagerPostEventCenter extends BaseEvent {
    CREATE_POST_SUCCEED = 'createPostSucceed';
    CREATE_POST_ERROR = 'createPostError';

    GET_POSTS_SUCCEED = 'getPostsSucceed';
    GET_POSTS_ERROR = 'getPostsError';

}

module.exports = ManagerPostEventCenter;