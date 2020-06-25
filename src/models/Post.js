const DateUtils = require("../utils/DateUtils");

const dateUtils = new DateUtils();

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
    publishedAt = dateUtils.formatyyyMMddHHmmss(Date.now());
    createdAt = dateUtils.formatyyyMMddHHmmss(Date.now());
    updatedAt = dateUtils.formatyyyMMddHHmmss(Date.now());

    constructor() {
        this.published = false;
        this.deleted = false;
        this.publishedAt = null;
    }
}

module.exports = Post;