const BaseEvent = require('../BaseEvent');

class ManagerEventCenter extends BaseEvent {
    CREATE_POST_SUCCEED = 'createPostSucceed';
    CREATE_POST_ERROR = 'createPostError';

    GET_POSTS_SUCCEED = 'getPostsSucceed';
    GET_POSTS_ERROR = 'getPostsError';

    GET_POST_DETAIL_SUCCEED = 'getPostSucceed';
    GET_POST_DETAIL_ERROR = 'getPostError';

    CREATE_CATEGORY_SUCCEED = 'createCategorySucceed';
    CREATE_CATEGORY_ERROR = 'createCategoryError';

    UPDATE_CATEGORY_SUCCEED = 'updateCategorySucceed';
    UPDATE_CATEGORY_ERROR = 'updateCategoryError';

    DELETE_CATEGORY_SUCCEED = 'deleteCategorySucceed';
    DELETE_CATEGORY_ERROR = 'deleteCategoryError';
    
    CREATE_TAG_SUCCEED = 'createTagSucceed';
    CREATE_TAG_ERROR = 'createTagError';

    DELETE_TAG_SUCCEED = 'deleteTagSucceed';
    DELETE_TAG_ERROR = 'deleteTagError';

    UPDATE_TAG_SUCCEED = 'updateTagSucceed';
    UPDATE_TAG_ERROR = 'updateTagError';
}

module.exports = ManagerEventCenter;