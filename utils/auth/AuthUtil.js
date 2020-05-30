const UserRepository = require('../../repository/UserRepository');
const userRepository = new UserRepository();

class AuthUtil {
    /**
     * @param {Number} id
     * @param {String} type
     */
    isUserInRole = async (id, type) => {
        let result = false;
        const roles = await userRepository.getRole(id);
        for (const role of roles) {
            if (role.title === type) {
                result = true;
                break;
            }
        }

        return result;
    }
}

module.exports = AuthUtil;