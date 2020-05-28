const authRoutes = require('express').Router();
const LoginConfigDto = require('../../dto/auth/LoginConfigDto');
const LoginResponseDto = require('../../dto/auth/LoginResponseDto');
const UserDto = require('../../dto/auth/UserDto');
const authConfig = require('../../config/auth/AuthConfig');
const jwt = require('jsonwebtoken');
const AuthService = require('../../services/auth/AuthService');
const AuthEventCenter = require('../../events/auth/AuthEventCenter');

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

        // đăng nhập thành công. tạo accessToken cho user.
        const accessToken = jwt.sign(user.toJSON(), authConfig.accessTokenSecret, {
            expiresIn: authConfig.accessTokenLife
        });
        // tạo refresh token. lưu vào cookies
        const refreshToken = jwt.sign(user.toJSON(), authConfig.refreshTokenSecret, {
            expiresIn: authConfig.refreshTokenLife
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true
        });

        response.accessToken = accessToken;

        res.json(response);
    }

    authEventCenter.addListener(authEventCenter.DO_LOGIN_ERROR, doLoginError);
    authEventCenter.addListener(authEventCenter.DO_LOGIN_SUCCEED, doLoginSucceed);

    authService.login(dto);
});

module.exports = authRoutes;