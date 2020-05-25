const authRoutes = require('express').Router();
const LoginConfigDto = require('../../dto/auth/LoginConfigDto');
const LoginDto = require('../../dto/auth/LoginDto');
const authConfig = require('../../config/auth/AuthConfig');
const jwt = require('jsonwebtoken');

/** login
 * [POST] api/auth/login
 * @returns {LoginDto} response
 */
authRoutes.post('/login', (req, res) => {
    const postData = req.body;
    const dto = new LoginConfigDto();
    dto.email = postData.email;
    dto.password = postData.password;
    
    // TODO: thực hiện kiểm tra thông tin trong DB
    const user = {};
    // đăng nhập thành công. tạo accessToken cho user.
    const accessToken = jwt.sign(user, authConfig.accessTokenSecret, {
        expiresIn: authConfig.accessTokenLife
    });
    // tạo refresh token. lưu vào cookies
    const refreshToken = jwt.sign(user, authConfig.refreshTokenSecret, {
        expiresIn: authConfig.refreshTokenLife
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true
    });

    const response = new LoginDto();
    response.isSucceed = true;
    response.accessToken = accessToken;

    res.json(response);
});

module.exports = authRoutes;