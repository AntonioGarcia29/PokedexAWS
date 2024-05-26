const mysql = require('mysql2');
const util = require('util');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'pokemon.cr2uu2euqlbf.us-east-1.rds.amazonaws.com',
    user: 'anto',
    password: 'palahumo',
    database: 'pokemon'
});

pool.query = util.promisify(pool.query);

module.exports = pool;