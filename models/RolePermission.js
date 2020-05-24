/* role_permission model
 */
class RolePermission {
    roleId = String();
    permissionId = String();

    constructor(roleId, permissionId) {
        this.roleId = roleId;
        this.permissionId = permissionId;
    }

    /**
    * Returns object role_permission
    * @returns {object} role_permission
    */
    convert = () => {
        role_id = this.roleId,
        permission_id = this.permissionId
    }
}

module.exports = RolePermission;