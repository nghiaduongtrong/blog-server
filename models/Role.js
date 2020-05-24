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

    /**
    * Returns object role
    * @returns {object} role
    */
    convert = () => {
        return {
            id = this.id,
            title = this.title,
            slug = this.slug, 
            description = this.description,
            created_at = this.createdAt,
            updated_at = this.updated_at
        }
    }
}

module.exports = Role;