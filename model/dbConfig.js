const mysql = require('mysql2/promise');
require('dotenv').config();
// 
var pool = null;
try {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
} catch (err) {
    console.error('You dont have access to this DB !');
}
const connect = () => {
    return pool.getConnection();
}
// 
module.exports = {
    connect
}