const authRoutes = require('express').Router();
const LoginConfigDto = require('../../dto/auth/LoginConfigDto');
const LoginResponseDto = require('../../dto/auth/LoginResponseDto');
const RefreshTokenResponseDto = require('../../dto/auth/RefreshTokenResponseDto');
const LogoutResponseDto = require('../../dto/auth/LogoutResponseDto');
const UserDto = require('../../dto/auth/UserDto');
const authConfig = require('../../config/auth/AuthConfig');
const jwt = require('jsonwebtoken');
const AuthService = require('../../services/auth/AuthService');
const AuthEventCenter = require('../../events/auth/AuthEventCenter');

const authenticate = require('../../middlewares/auth/Authenticate');
const authEventCenter = new AuthEventCenter();

const authService = new AuthService();

/** login
 * [POST] api/auth/login
 * @returns {LoginDto} response
 */
authRoutes.post('/login', (req, res) => {
    const postData = req.body;
    const dto = new LoginConfigDto();
    dto.email = postData.email;
    dto.password = postData.password;

    const doLoginError = (response = new LoginResponseDto()) => {
        res.json(response);
    }

    const doLoginSucceed = (response = new LoginResponseDto()) => {
        const user = new UserDto();
        user.id = response.sessionDto.id;
        user.fullName = response.sessionDto.fullName;

        // tạo refresh token. lưu vào cookies
        const refreshToken = jwt.sign(user.toJSON(), authConfig.REFRESH_TOKEN_SECRET, {
            expiresIn: authConfig.REFRESH_TOKEN_LIFE
        });

        res.cookie(authConfig.REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
            httpOnly: true
        });

        res.json(response);
    }

    authEventCenter.addListener(authEventCenter.DO_LOGIN_ERROR, doLoginError);
    authEventCenter.addListener(authEventCenter.DO_LOGIN_SUCCEED, doLoginSucceed);

    authService.login(dto);
});

/** refresh token 
 * [POST] api/auth/refresh-token
 * @returns {LoginDto} response
 */
authRoutes.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.cookies;

    const refreshTokenError = (response = new RefreshTokenResponseDto()) => {
        res.json(response);
    }

    const refreshTokenSucceed = (response = new RefreshTokenResponseDto()) => {
        res.json(response);
    }

    authEventCenter.addListener(authEventCenter.REFRESH_TOKEN_ERROR, refreshTokenError);
    authEventCenter.addListener(authEventCenter.REFRESH_TOKEN_SUCCEED, refreshTokenSucceed);

    authService.refreshToken(refreshToken);
});

/** logout 
 * [POST] api/auth/logout
 * @returns {LogoutResponseDto} response
 */
authRoutes.post('/logout', (req, res) => {
    const logoutSucceed = (response = new LogoutResponseDto()) => {
        res.clearCookie(authConfig.REFRESH_TOKEN_COOKIE_KEY);
        res.json(response);
    }

    const logoutError = (response = new LogoutResponseDto()) => {
        res.json(response);
    }

    authEventCenter.addListener(authEventCenter.LOGOUT_SUCCEED, logoutSucceed);
    authEventCenter.addListener(authEventCenter.LOGOUT_ERROR, logoutError);

    authService.logout();
});

module.exports = authRoutes;