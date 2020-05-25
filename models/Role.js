/* role model
 */
class Role {
    id = Number();
    title = String();
    slug = String();
    description = String();
    createdAt = Date();
    updatedAt = Date();

    constructor(id, title, slug, description, createdAt, updatedAt) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.createdAt = createdAt; 
        this.updatedAt = updatedAt;
    }
}

module.exports = Role;