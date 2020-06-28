const connection = require('../connection');
const mysql = require('mysql');
const QueryUtils = require('./utils/QueryUtils');

const queryUtils = new QueryUtils();
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

    /**
     * @param {Category} category   
     * @returns {} 
     */
    createCategory = (category) => {
        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO ?? SET ?';
            const inserts = ['category'];
            sql = mysql.format(sql, inserts);
            connection.query(sql, category, (err, results, fields) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    }

    /**
     * @param {Number} categoryId   
     * @param {Category} categoryDataUpdate   
     * @returns {Boolean} 
     */
    updateCategory = (categoryId, categoryDataUpdate) => {
        return new Promise((resolve, reject) => {
            const sql = queryUtils.createUpdateQuery('category', categoryDataUpdate, {
                where: {
                    id: categoryId
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

module.exports = CategoryRepository;