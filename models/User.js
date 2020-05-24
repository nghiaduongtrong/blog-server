/* user model 
 */
class User {
    id = Number();
    roleId = Number();
    firstName = String();
    middleName = String();
    lastName = String();
    active = Boolean();
    mobile = String();
    email = String();
    passwordHash = String();
    registeredAt = Date();
    lastLogin = Date();

    constructor(id, roleId, firstName, middleName, lastName, active, mobile, email, passwordHash, registeredAt, lastLogin) {
        this.id = id;
        this.roleId = roleId;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.active = active;
        this.mobile = mobile;
        this.email = email;
        this.passwordHash = passwordHash;
        this.registeredAt = registeredAt;
        this.lastLogin = lastLogin;
    }

    /**
    * Returns object user
    * @returns {object} user
    */
    convert = () => {
        return {
            id = this.id,
            role_id = this.roleId,
            first_name = this.firstName,
            middle_name = this.middleName,
            last_name = this.lastName,
            active = this.active,
            mobile = this.mobile,
            email = this.email,
            password_hash = this.passwordHash,
            registered_at = this.registeredAt,
            last_login = this.lastLogin
        }
    }
}

module.exports = User;