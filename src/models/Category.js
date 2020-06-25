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
    createdAt = dateUtils.formatyyyMMddHHmmss(Date.now());
    updatedAt = dateUtils.formatyyyMMddHHmmss(Date.now());
}

module.exports = Category;