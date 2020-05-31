const connection = require('../connection');
const mysql = require('mysql');

class PostRepository {

    /**
     * @param {Post} post   
     * @returns {} 
     */
    createPost = (post) => {
        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO ?? SET ?';
            const inserts = ['post'];
            sql = mysql.format(sql, inserts);
            connection.query(sql, post, (err, results, fields) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    /**
     * @param {Object} params   
     * @param {Number} limit   
     * @param {Number} offset   
     * @param {String} order   
     * @returns {Array} posts 
     */
    getPosts = (params, limit, offset, order) => {
        return new Promise((resolve, reject) => {
            let query = ['SELECT * FROM ?? INNER JOIN ?? ON ?? = ??'];
            let inserts = ['post', 'post_category', 'post.id', 'post_category.postId'];
            if (params) {
                const keys = Object.keys(params);
                const keysLength = keys.length;
                if (keysLength > 0) {
                    query.push('WHERE');
                }
                for (const [index, key] of keys.entries()) {
                    if (index < (keysLength - 1)) {
                        query.push('?? = ? AND');
                    } else {
                        query.push('?? = ?');
                    }
                    inserts.push(key, params[key]);
                }
            }

            if (order) {
                query.push(`ORDER BY ?? ${order}`);
                inserts.push('publishedAt');
            }

            if (limit) {
                query.push(`LIMIT ${limit}`);
            }

            if (offset) {
                query.push(`OFFSET ${offset}`);
            }

            let sql = query.join(' ');
            sql = mysql.format(sql, inserts);
            connection.query(sql, (err, results, fields) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = PostRepository;