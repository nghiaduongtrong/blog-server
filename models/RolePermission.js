/* role_permission model
 */
class RolePermission {
    roleId = String();
    permissionId = String();

    constructor(roleId, permissionId) {
        this.roleId = roleId;
        this.permissionId = permissionId;
    }
}

module.exports = RolePermission;