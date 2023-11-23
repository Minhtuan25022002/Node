// const mysql = require('mysql2');

// const pool = mysql.createConnection({
//     host: 'localhost',
//     database: 'node-complete',
//     user: 'root',
//     password: 'ntmt2502',
//     port: 3307,
// });

// module.exports = pool.promise();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'ntmt2502', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3307,
});

module.exports = sequelize;


