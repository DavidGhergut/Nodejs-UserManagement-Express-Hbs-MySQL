const mysql = require('mysql');

// Connection Pool
let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3305,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Here we handle the results of the query and we make sure to return the
function query(query, args, callback, callback_error) {
    connection.query(query, args, (err, rows) => {
        // When done with the connection, release it
        if (!err) {
            callback(rows)
        } else {
            callback_error(err)
        }
    });
}

// Here we make the promise
function queryPromise(q, args) {
    return new Promise((resolve, reject) => {
        query(q, args, (rows) => {
            resolve(rows)
        }, (err) => {
            reject(err)
        });
    });
}

async function queryAllActiveUsers() {
    return await queryPromise('SELECT * FROM user WHERE status = "active"', []);
}

exports.queryAllActiveUsers = queryAllActiveUsers;

async function searchWithSearchTerm(searchTerm) {
    return await queryPromise('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%']);
}

exports.searchWithSearchTerm = searchWithSearchTerm;

async function createUser(first_name, last_name, email, phone, comments) {
    return await queryPromise('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments])
}

exports.createUser = createUser;

async function findUserById(id) {
    return await queryPromise('SELECT * FROM user WHERE id = ?', [id])
}

exports.findUserById = findUserById;

async function updateUser(id, first_name, last_name, email, phone, comments) {
    return await queryPromise('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, id])
}

exports.updateUser = updateUser;

async function updateUserStatus(id, status) {
    return await queryPromise('UPDATE user SET status = ? WHERE id = ?', [status, id])
}

exports.updateUserStatus = updateUserStatus;