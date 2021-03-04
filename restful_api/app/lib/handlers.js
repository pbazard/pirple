'use strict'

var _data = require('./data');
var helpers = require('./helpers');

const handlers = {};

handlers.notFound = (data, callback) => {
    callback(404);
};

handlers.hello = (data, callback) => {
    callback(406, { 'msg': 'Hello Pirple World!' });
};

handlers.ping = (data, callback) => {
    callback(200);
};

handlers.users = (data, callback) => {
    const acceptableMethods = ['get', 'post', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._users = {};

handlers._users.get = (data, callback) => {

}

handlers._users.post = (data, callback) => {
    const firstName = typeof (data.payload.firstName) == 'string' &&
        data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() > 0 : false;
    const lastName = typeof (data.payload.lastName) == 'string' &&
        data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() > 0 : false;
    const email = typeof (data.payload.email) == 'string'
        && data.payload.email.trim().length > 0 ? data.payload.email : false;
    const phone = typeof (data.payload.phone) == 'string'
        && data.payload.phone.trim().length > 0 ? data.payload.phone : false;
    const password = typeof (data.payload.password) == 'string'
        && data.payload.password.trim().length > 0 ? data.payload.password : false;
    const password2 = typeof (data.payload.password2) == 'string'
        && data.payload.password2.trim().length > 0 ? data.payload.password2 : false;

    if (firstName && lastName && email && password) {
        _data.read('users', phone, function (err, data) {
            if (err) {
                var hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                    // Create the user object
                    let userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'email': email,
                        'phone': phone,
                        'password': password
                    };
                    // Store the user
                    // TODO: Create a more complex primary key. Here phone only
                    _data.create('users', phone, userObject, (err) => {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, { 'Error': 'Could not create the new user' });
                        }
                    });
                } else {
                    callback(500, { 'Error': 'Could not create the user\'s password' });
                }

            } else {
                callback(400, { 'Error': 'User already exists' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required fileds' });
    }
}

handlers._users.put = (data, callback) => {

}

handlers._users.delete = (data, callback) => {

}

module.exports = handlers