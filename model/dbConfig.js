const mysql = require('mysql2/promise');
require('dotenv').config();
// 
var pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const connect = () => {
    return pool.getConnection();
}
// 
module.exports = {
    connect
}