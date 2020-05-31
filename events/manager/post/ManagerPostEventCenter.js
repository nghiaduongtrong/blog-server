const BaseEvent = require('../../BaseEvent');

class ManagerPostEventCenter extends BaseEvent {
    CREATE_POST_SUCCEED = 'createPostSucceed';
    CREATE_POST_ERROR = 'createPostError';
}

module.exports = ManagerPostEventCenter;