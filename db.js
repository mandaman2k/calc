var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 20,
    host: '35.229.125.123',
    user: 'root',
    password: 'Presario1',
    database: 'calc'
});

module.exports = pool;
