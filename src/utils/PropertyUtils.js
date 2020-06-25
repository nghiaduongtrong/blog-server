class PropertyUtils {
    /**
     * @param {Object}  object
     * @param {Array}  properties
     * @returns {Object} object 
     */
    deleteProperties = (object, properties) => {
        for(const property of properties) {
            if (object.hasOwnProperty(property)) {
                delete object[property];
            }
        }
        return object;
    }

    /**
     * @param {Object}  object
     * @param {Array}  properties
     * @returns {Object} data 
     */
    getProperties = (object, properties) => {
        const data = {};
        for(const property of properties) {
            if (object.hasOwnProperty(property)) {
                data[property] = object[property];
            }
        }
        return data;
    }
}

module.exports = PropertyUtils;