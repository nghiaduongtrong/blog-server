const connection = require('../connection');
const mysql = require('mysql');

class PostRepository {

    /**
     * @param {Post} post   
     * @param {}   
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
}

module.exports = PostRepository;