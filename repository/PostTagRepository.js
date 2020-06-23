const connection = require('../connection');
const mysql = require('mysql');

class PostTagRepository {

    /**
     * @param {Number} postId  
     * @param {Number} tagId
     * @returns {} 
     */
    createPostTag = (postId, tagId) => {
        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO ?? SET ?? = ?, ?? = ?';
            const inserts = ['post_tag', 'postId', postId, 'tagId', tagId];
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
     * @param {Number} postId  
     * @returns {Array} postTags
     */
    getPostTagsByPostId = (postId) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM ?? WHERE ?? = ?';
            const inserts = ['post_tag', 'postId', postId];
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

module.exports = PostTagRepository;