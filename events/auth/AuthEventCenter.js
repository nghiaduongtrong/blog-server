const BaseEvent = require('../BaseEvent');

class AuthEventCenter extends BaseEvent{
    DO_LOGIN_ERROR = 'doLoginError';
    DO_LOGIN_SUCCEED = 'doLoginSucceed';
    
    constructor() {
        super();
    }
}

module.exports = AuthEventCenter;