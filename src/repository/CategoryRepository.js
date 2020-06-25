const connection = require('../connection');
const mysql = require('mysql');

class CategoryRepository {

    /**
     * @param {String} slug   
     * @returns {} 
     */
    getCategoryBySlug = (slug) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM ?? WHERE ?? = ?';
            const inserts = ['category', 'slug', slug];
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
     * @returns {} 
     */
    getCategoriesOfPost = (postId) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ?';
            const inserts = ['category', 'post_category', 'category.id', 'post_category.categoryId', 'postId', postId];
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

module.exports = CategoryRepository;