const BaseEvent = require('../BaseEvent');

class AuthEventCenter extends BaseEvent{
    DO_LOGIN_ERROR = 'doLoginError';
    DO_LOGIN_SUCCEED = 'doLoginSucceed';
    REFRESH_TOKEN_ERROR = 'refreshTokenError';
    REFRESH_TOKEN_SUCCEED = 'refreshTokenSucceed';
    LOGOUT_SUCCEED = 'logoutSucceed';
    LOGOUT_ERROR = 'logoutError';
}

module.exports = AuthEventCenter;