const BaseEvent = require('../BaseEvent');

class AuthEventCenter extends BaseEvent{
    DO_LOGIN_ERROR = 'doLoginError';
    DO_LOGIN_SUCCEED = 'doLoginSucceed';
    REFRESH_TOKEN_ERROR = 'refreshTokenError';
    REFRESH_TOKEN_SUCCEED = 'refreshTokenSucceed';

    constructor() {
        super();
    }
}

module.exports = AuthEventCenter;