const connection = require('../connection');
const mysql = require('mysql');
const QueryUtils = require('./utils/QueryUtils');

const queryUtils = new QueryUtils();
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

    /**
     * @param {Object} tag
     * @returns {} 
     */
    createTag = (tag) => {
        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO ?? SET ?';
            const inserts = ['tag'];
            sql = mysql.format(sql, inserts);
            connection.query(sql, tag, (err, results, fields) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    }

    /**
     * @param {Number} tagId
     * @returns {Boolean} 
     */
    deleteTag = (tagId) => {
        return new Promise((resolve, reject) => {
            let sql = 'DELETE FROM ?? WHERE ?? = ?';
            const inserts = ['tag', 'id', tagId];
            sql = mysql.format(sql, inserts);
            connection.query(sql, (err, results, fields) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    }

    /**
     * @param {Number} tagId
     * @param {Object} tagDataUpdate
     * @returns {Boolean} 
     */
    updateTag = (tagId, tagDataUpdate) => {
        return new Promise((resolve, reject) => {
            const sql = queryUtils.createUpdateQuery('tag', tagDataUpdate, {
                where: {
                    id: tagId
                }
            });

            connection.query(sql, (err, results, fields) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    }
}

module.exports = TagRepository;