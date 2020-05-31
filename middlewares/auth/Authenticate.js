const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth/AuthConfig');
const AuthenticateResponseDto = require('../../dto/auth/AuthenticateResponseDto');
const MessageType = require('../../consts/MessageType');
const AuthMessage = require('../../consts/auth/AuthMessage');
const UserRepository = require('../../repository/UserRepository');
const RoleType = require('../../consts/auth/RoleType');
const AuthUtil = require('../../utils/auth/AuthUtil');


const authUtil = new AuthUtil();
const userRepository = new UserRepository();

const createErrorAuthenticate = (message) => {
    const response = new AuthenticateResponseDto();
    response.isSucceed = false;
    response.messageType = MessageType.ERROR;
    response.message = message;

    return response;
}
/**
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {AuthenticateResponseDto} response
 */
const authenticate = async (req, res, next) => {
    const { accessToken } = req.body;
    if (accessToken) {
        try {
            const userPayload = jwt.verify(accessToken, authConfig.ACCESS_TOKEN_SECRET);
            const user = await userRepository.getUser(userPayload.id);
            if (!user) {
                const response = createErrorAuthenticate(AuthMessage.AUTH_FAILD);
                return res.json(response);
            }
            const isAdmin = await authUtil.isUserInRole(user.id, RoleType.ADMIN);
            if (!isAdmin) {
                const response = createErrorAuthenticate(AuthMessage.AUTH_FAILD);
                return res.json(response);
            }
            req.user = userPayload;
            next();
        } catch (err) {
            console.log(err);
            const response = createErrorAuthenticate(AuthMessage.ERROR);
            return res.json(response);
        }
    } else {
        const response = createErrorAuthenticate(AuthMessage.AUTH_FAILD);
        return res.json(response);
    }
}

module.exports = authenticate;