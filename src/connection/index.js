const mysql = require('mysql');
const config = require('../config/database/DatabaseConfig');

const connection = mysql.createConnection(config);

connection.connect((err) => {
    if (!err) {
        console.log('connect mysql succeed');
    } else {
        console.log('can not connect mysql: ' + err);
    }
});

module.exports = connection;