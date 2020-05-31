const slugify = require('slugify');
const SlugifyConfig = require('../../config/slugify/SlugifyConfig');

class SlugUtil {
    /**
     * @param {String} text
     */
    slug = (text) => {
        return slugify(text, SlugifyConfig);
    }
}

module.exports = SlugUtil;