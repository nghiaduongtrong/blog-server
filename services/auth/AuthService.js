const LoginConfigDto = require('../../dto/auth/LoginConfigDto');
const UserRepository = require('../../repository/UserRepository');
const LoginResponseDto = require('../../dto/auth/LoginResponseDto');
const AuthEventCenter = require('../../events/auth/AuthEventCenter');
const SessionDto = require('../../dto/session/SessionDto');
const AuthMessageType = require('../../consts/auth/AuthMessageType');
const AuthMessage = require('../../consts/auth/AuthMessage');
const RoleType = require('../../consts/auth/RoleType');

const authEventCenter = new AuthEventCenter();

const userRepository = new UserRepository();

/**
 *@param {String} message
 *@returns {LoginResponseDto} result
 * */
const createErrorLoginResult = (message) => {
    const result = new LoginResponseDto();
    result.isSucceed = false;
    result.messageType = AuthMessageType.ERROR;
    result.message = message;

    return result;
}

/**
 *@param {Object} user
 *@returns {LoginResponseDto} result
 * */
const createSucceedLoginResult = (user) => {
    const result = new LoginResponseDto();
    const sessionDto = new SessionDto();

    sessionDto.id = user.id;
    sessionDto.fullName = [user.firstName, user.middleName, user.lastName].join(' ');
    sessionDto.loginDate = Date.now();

    result.isSucceed = true;
    result.sessionDto = sessionDto;

    return result;
}

class AuthService {
    login = async (config = new LoginConfigDto) => {
        try {
            const user = await userRepository.getUserByEmail(config.email);
            if (!user) {
                const result = createErrorLoginResult(AuthMessage.USER_NOT_EXIST);
                authEventCenter.fireEvent(authEventCenter.DO_LOGIN_ERROR, result);
                return;
            }
            if (user.passwordHash !== config.password) {
                const result = createErrorLoginResult(AuthMessage.WRONG_PASSWORD);
                authEventCenter.fireEvent(authEventCenter.DO_LOGIN_ERROR, result);
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
                const result = createErrorLoginResult(AuthMessage.NOT_AUTHORIZED);
                authEventCenter.fireEvent(authEventCenter.DO_LOGIN_ERROR, result);
                return;
            }

            const result = createSucceedLoginResult(user);
            authEventCenter.fireEvent(authEventCenter.DO_LOGIN_SUCCEED, result);
        } catch (err) {
            console.log(err);
            const result = createErrorLoginResult(AuthMessage.ERROR);
            authEventCenter.fireEvent(authEventCenter.DO_LOGIN_ERROR, result);
            return;
        }
    }
}

module.exports = AuthService;