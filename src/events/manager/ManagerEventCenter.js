const BaseEvent = require('../BaseEvent');

class ManagerEventCenter extends BaseEvent {
    CREATE_POST_SUCCEED = 'createPostSucceed';
    CREATE_POST_ERROR = 'createPostError';

    GET_POSTS_SUCCEED = 'getPostsSucceed';
    GET_POSTS_ERROR = 'getPostsError';

    GET_POST_DETAIL_SUCCEED = 'getPostSucceed';
    GET_POST_DETAIL_ERROR = 'getPostError';
}

module.exports = ManagerEventCenter;