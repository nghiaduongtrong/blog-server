/* Post model
 */
class Post {
    id = Number();
    authorId = Number();
    parentId = Number();
    title = String();
    metaTitle = String();
    slug = String();
    summary = String();
    content = String();
    published = Boolean();
    deleted = Boolean();
    publishedAt = Date();

    constructor() {
        this.published = false;
        this.deleted = false;
        this.publishedAt = null;
    }
}

module.exports = Post;