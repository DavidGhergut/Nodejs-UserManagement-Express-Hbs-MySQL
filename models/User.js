const mysql = require('mysql');

// Connection Pool
let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3305,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Here we handle the results of the query and we make sure to handle the error
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

// this function gets all active users
async function queryAllActiveUsers() {
    return await queryPromise('SELECT * FROM user WHERE status = "active"', []);
}

exports.queryAllActiveUsers = queryAllActiveUsers;

// this function searches for all the users by what is in "searchTerm"
async function searchWithSearchTerm(searchTerm) {
    return await queryPromise('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%']);
}

exports.searchWithSearchTerm = searchWithSearchTerm;

// this function creates an user with attributes first_name, last_name, email, phone and comments
async function createUser(first_name, last_name, email, phone, comments) {
    return await queryPromise('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments])
}

exports.createUser = createUser;

// this function returns the user with the id "id"
async function findUserById(id) {
    return await queryPromise('SELECT * FROM user WHERE id = ?', [id])
}

exports.findUserById = findUserById;

// this function updates the  user with the id, first_name, last_name, email, phone and comments
async function updateUser(id, first_name, last_name, email, phone, comments) {
    return await queryPromise('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, id])
}

exports.updateUser = updateUser;

// this function updates the status of the user with the id, "id"
async function updateUserStatus(id, status) {
    return await queryPromise('UPDATE user SET status = ? WHERE id = ?', [status, id])
}

exports.updateUserStatus = updateUserStatus;

// this function toggles the status button between "active" and "none"
async function activateOrDeactivate(id) {
    let user = await findUserById(id);

    if (user.status === 'active') {
        // Here we update the status of the user to none
        await updateUserStatus(id, 'none')
    } else {
        // Here we update the status of the user to active
        await updateUserStatus(id, 'active')
    }
}

exports.activateOrDeactivate = activateOrDeactivate;