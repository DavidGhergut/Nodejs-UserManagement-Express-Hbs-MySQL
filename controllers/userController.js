const Users = require('../models/User.js');

function logErr(err) {
    console.log(err);
}


exports.view = (req, res) => {
    // User the connection
    Users.queryAllActiveUsers().then((rows) => {
        let removedUser = req.query.removed;
        res.render('home', {rows, removedUser});
    }).catch(logErr);
}

// Find User by Search
exports.find = (req, res) => {
    let searchTerm = req.body.search;
    // User the connection
    Users.searchWithSearchTerm(searchTerm)
        .then((rows) => {
            res.render('home', {rows});
        })
        .catch(logErr);
}

exports.form = (req, res) => {
    res.render('add-user');
}

// Add new user
exports.create = (req, res) => {
    const {first_name, last_name, email, phone, comments} = req.body;

    // User the connection
    Users.createUser(first_name, last_name, email, phone, comments)
        .then(_rows => {
            res.render('add-user', {alert: 'User added successfully.'});
        }).catch(logErr);
}


// Edit user
exports.edit = (req, res) => {
    // User the connection
    Users.findUserById(req.params.id)
        .then(rows => {
            res.render('edit-user', {rows});
        }).catch(logErr);
}


// Update User
exports.update = (req, res) => {
    const {first_name, last_name, email, phone, comments} = req.body;
    // User the connection
    Users.updateUser(req.params.id, first_name, last_name, email, phone, comments)
        .then(_rows => Users.findUserById(req.params.id))
        .then(rows => {
            res.render('edit-user', {rows, alert: `${first_name} has been updated.`});
        })
        .catch(logErr);
}

// Delete User
exports.delete = (req, res) => {

    // Delete a record

    // Hide a record

    Users.updateUserStatus(req.params.id, 'removed')
        .then(_rows => {
            let removedUser = encodeURIComponent('User successeflly removed.');
            res.redirect('/?removed=' + removedUser);
        })
        .catch(logErr)
}

// View Users
exports.viewall = (req, res) => {
    // User the connection
    Users.findUserById(req.params.id)
        .then(rows => {
            res.render('view-user', {rows});
        })
        .catch(logErr);
}