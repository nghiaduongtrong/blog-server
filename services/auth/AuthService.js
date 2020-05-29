const LoginConfigDto = require('../../dto/auth/LoginConfigDto');
const UserRepository = require('../../repository/UserRepository');
const LoginResponseDto = require('../../dto/auth/LoginResponseDto');
const RefreshTokenResponseDto = require('../../dto/auth/RefreshTokenResponseDto');
const LogoutResponseDto = require('../../dto/auth/LogoutResponseDto');
const UserDto = require('../../dto/auth/UserDto');
const authConfig = require('../../config/auth/AuthConfig');
const AuthEventCenter = require('../../events/auth/AuthEventCenter');
const SessionDto = require('../../dto/session/SessionDto');
const AuthMessageType = require('../../consts/auth/AuthMessageType');
const AuthMessage = require('../../consts/auth/AuthMessage');
const RoleType = require('../../consts/auth/RoleType');
const jwt = require('jsonwebtoken');

const authEventCenter = new AuthEventCenter();

const userRepository = new UserRepository();

/**
 *@param {String} message
 *@returns {LoginResponseDto} response
 * */
const createErrorLoginResult = (message) => {
    const response = new LoginResponseDto();
    response.isSucceed = false;
    response.messageType = AuthMessageType.ERROR;
    response.message = message;

    return response;
}

/**
 *@param {Object} user
 *@returns {LoginResponseDto} response
 * */
const createSucceedLoginResult = (user) => {
    const response = new LoginResponseDto();
    const sessionDto = new SessionDto();

    sessionDto.id = user.id;
    sessionDto.fullName = [user.firstName, user.middleName, user.lastName].join(' ');
    sessionDto.loginDate = Date.now();

    response.isSucceed = true;
    response.sessionDto = sessionDto;

    const userPayload = new UserDto();
    userPayload.id = user.id;
    userPayload.fullName = [user.firstName, user.middleName, user.lastName].join(' ');
    // đăng nhập thành công. tạo accessToken cho user.
    const accessToken = jwt.sign(userPayload.toJSON(), authConfig.accessTokenSecret, {
        expiresIn: authConfig.accessTokenLife
    });

    response.accessToken = accessToken;

    return response;
}

/**
 *@param {String} message
 *@returns {RefreshTokenResponseDto} response
 * */
const createErrorRefreshTokenResult = (message) => {
    const response = new RefreshTokenResponseDto();
    response.isSucceed = false;
    response.messageType = AuthMessageType.ERROR;
    response.message = message;

    return response;
}

/**
 *@param {Object} user
 *@returns {RefreshTokenResponseDto} response
 * */
const createSucceedRefreshTokenResult = (user) => {
    const response = new RefreshTokenResponseDto();
    response.isSucceed = true;

    const userPayload = new UserDto();
    userPayload.id = user.id;
    userPayload.fullName = user.fullName;
    // đăng nhập thành công. tạo accessToken cho user.
    const accessToken = jwt.sign(userPayload.toJSON(), authConfig.accessTokenSecret, {
        expiresIn: authConfig.accessTokenLife
    });

    response.accessToken = accessToken;

    return response;
}

class AuthService {
    /**
     * @param {LoginConfigDto} config
     * @returns {LoginResponseDto} response 
     */
    login = async (config = new LoginConfigDto) => {
        try {
            const user = await userRepository.getUserByEmail(config.email);
            if (!user) {
                const response = createErrorLoginResult(AuthMessage.USER_NOT_EXIST);
                authEventCenter.fireEvent(authEventCenter.DO_LOGIN_ERROR, response);
                return;
            }
            if (user.passwordHash !== config.password) {
                const response = createErrorLoginResult(AuthMessage.WRONG_PASSWORD);
                authEventCenter.fireEvent(authEventCenter.DO_LOGIN_ERROR, response);
                return;
            }
            const roles = await userRepository.getRole(user.id);
            let isAdmin = false;
            for (const role of roles) {
                if (role.title === RoleType.ADMIN) {
                    isAdmin = true;
                    break;
                }
            }
            if (!isAdmin) {
                const response = createErrorLoginResult(AuthMessage.NOT_AUTHORIZED);
                authEventCenter.fireEvent(authEventCenter.DO_LOGIN_ERROR, response);
                return;
            }

            const response = createSucceedLoginResult(user);
            authEventCenter.fireEvent(authEventCenter.DO_LOGIN_SUCCEED, response);
        } catch (err) {
            console.log(err);
            const response = createErrorLoginResult(AuthMessage.ERROR);
            authEventCenter.fireEvent(authEventCenter.DO_LOGIN_ERROR, response);
            return;
        }
    }

    /**
     * @param {String} refreshToken 
     * @returns {RefreshTokenResponseDto} response 
     */
    refreshToken = (refreshToken) => {
        try {
            if (!refreshToken) {
                const response = createErrorRefreshTokenResult(AuthMessage.REFRESH_TOKEN_NOT_FOUND);
                authEventCenter.fireEvent(authEventCenter.REFRESH_TOKEN_ERROR, response);
                return;
            }
            const user = jwt.verify(refreshToken, authConfig.refreshTokenSecret);
            const response = createSucceedRefreshTokenResult(user);
            authEventCenter.fireEvent(authEventCenter.REFRESH_TOKEN_SUCCEED, response);
            return;
        } catch (err) {
            console.log(err);
            const response = createErrorRefreshTokenResult(AuthMessage.ERROR);
            authEventCenter.fireEvent(authEventCenter.REFRESH_TOKEN_ERROR, response);
            return;
        }
    }

    /**
     * 
     * @returns {LogoutResponseDto} response 
     */
    logout = () => {
        try {
            const response = new LogoutResponseDto();
            response.isSucceed = true;
            authEventCenter.fireEvent(authEventCenter.LOGOUT_SUCCEED, response);
        } catch (err) {
            console.log(err);
            const response = new LogoutResponseDto();
            response.isSucceed = false;
            authEventCenter.fireEvent(authEventCenter.LOGOUT_ERROR, response);
        }
    }
}

module.exports = AuthService;