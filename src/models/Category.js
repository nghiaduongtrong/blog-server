const DateUtils = require("../utils/DateUtils");

const dateUtils = new DateUtils();

/* category model
 */
class Category {
    id = Number();
    parentId = Number();
    title = String();
    metaTitle =  String();
    slug = String();
    description = String();
    createdAt = null;
    updatedAt = null;
}

module.exports = Category;