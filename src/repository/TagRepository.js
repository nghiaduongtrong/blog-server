const connection = require('../connection');
const mysql = require('mysql');

class TagRepository {
    /**
     * @param {Number} tagId
     * @returns {} 
     */
    getTag = (tagId) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM ?? WHERE ?? = ? LIMIT 1';
            const inserts = ['tag', 'id', tagId];
            sql = mysql.format(sql, inserts);
            connection.query(sql, (err, results, fields) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0]);
            }); 
        });
    }
}

module.exports = TagRepository;