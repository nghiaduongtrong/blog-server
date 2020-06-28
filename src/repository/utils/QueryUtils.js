const mysql = require('mysql');

class QueryUtils {
    static _WHERE = 'where';
    /**
     * @param {Object}  object
     * @returns {String} sql 
     */
    createUpdateQuery = (table, object, options) => {
        try {
            let arraySetKeys = [];
            let inserts = [table];

            for (const key in object) {
                if (object[key]) {
                    arraySetKeys.push(`${key} = ?`);
                    inserts.push(object[key]);
                }
            }
            // where
            for (const option in options) {
                if (options[option] && options[option] instanceof Object) {
                    switch (option) {
                        case QueryUtils._WHERE: {
                            const key = Object.keys(options[option])[0];
                            const whereValue = options[option][key];
                            inserts.push(key, whereValue);
                        }
                    }
                }
            }

            const sqlSetKeys = arraySetKeys.join(', ');
            let sql = `UPDATE ?? SET ${sqlSetKeys} WHERE ?? = ?`;
            sql = mysql.format(sql, inserts);

            return sql;
        } catch (err) {
            console.log(err);
            return "";
        }
    }
}

module.exports = QueryUtils;