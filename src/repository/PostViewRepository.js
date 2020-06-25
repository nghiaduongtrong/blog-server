const connection = require('../connection');
const mysql = require('mysql');

class PostViewRepository {

    /**
     * @param {Number} postId  
     * @returns {} 
     */
    getViewCountOfPost = (postId) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT SUM(??) AS VIEWS FROM ?? WHERE ?? = ?';
            const inserts = ['count', 'post_view', 'postId', postId];
            sql = mysql.format(sql, inserts);
            connection.query(sql, (err, results, fields) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0]['VIEWS']);
            }); 
        });
    }
}

module.exports = PostViewRepository;