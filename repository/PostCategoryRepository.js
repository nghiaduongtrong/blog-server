const connection = require('../connection');
const mysql = require('mysql');

class PostCategoryRepository {

    /**
     * @param {Number} postId  
     * @param {Number} categoryId  
     * @returns {} 
     */
    createPostCategory = (postId, categoryId) => {
        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO ?? SET ?? = ?, ?? = ?';
            const inserts = ['post_category', 'postId', postId, 'categoryId', categoryId];
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

module.exports = PostCategoryRepository;