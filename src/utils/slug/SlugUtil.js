const slugify = require('slugify');
const SlugifyConfig = require('../../config/slugify/SlugifyConfig');

class SlugUtil {
    /**
     * @param {String} text
     * @returns {String} slug
     */
    slug = (text) => {
        return slugify(text, SlugifyConfig);
    }
}

module.exports = SlugUtil;