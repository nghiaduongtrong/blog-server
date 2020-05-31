const connection = require('../connection');
const mysql = require('mysql');

class UserRepository {
    /**
     * @param {String} email
     * @returns {Object} user
     */
    getUserByEmail = (email) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM ?? WHERE ?? = ? LIMIT 1';
            const inserts = ['user', 'email', email];
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
     * @param {String} userId 
     * @returns {Array} role
     */
    getRole = (id) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT ?? FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ?';
            const inserts = ['role.*', 'user', 'role', 'user.roleId', 'role.id', 'user.id', id];
            sql = mysql.format(sql, inserts);
            connection.query(sql, (err, results, fields) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            }); 
        });
    }

    /**
     * @param {Number} id
     * @returns {Object} user
     */
    getUser = (id) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM ?? WHERE ?? = ? LIMIT 1';
            const inserts = ['user', 'id', id];
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
     * @param {Number} postId
     * @returns {Object} user
     */
    getUserWritePost = (postId) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT ?? FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ? LIMIT 1';
            const inserts = ['user.*','user', 'post', 'user.id', 'post.authorId', 'post.id', postId];
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
module.exports = UserRepository;