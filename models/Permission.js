/* permission model
 */
class Permission {
    id = Number();
    title = String();
    slug = String();
    description = String();
    active = Boolean();
    createdAt = Date();
    updatedAt = Date();

    constructor(id, title, slug, description, active, createdAt, updatedAt) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = Permission;