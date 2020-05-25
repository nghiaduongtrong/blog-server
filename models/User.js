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
}

module.exports = User;