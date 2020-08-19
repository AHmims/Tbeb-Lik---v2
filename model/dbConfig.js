const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname + '/../.env')
});

// 
try {
    var pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
} catch (err) {
    console.error(err);
}
const connect = () => {
    return pool.getConnection();
}
// 
module.exports = {
    connect
}