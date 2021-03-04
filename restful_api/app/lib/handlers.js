'use strict'

const { constants } = require('buffer');
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

//TODO: only let authenticated users access their own objects
handlers._users.get = (data, callback) => {
    const phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ?
        data.queryStringObject.phone.trim() : false;
    console.log(data.queryStringObject.phone);
    if (phone) {
        // Lookup the user
        _data.read('users', phone, (err, data) => {
            if (!err && data) {
                delete data.hashedPassword;
                callback(200, data);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' })
    }


}

handlers._users.post = (data, callback) => {
    const firstName = typeof (data.payload.firstName) == 'string' &&
        data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof (data.payload.lastName) == 'string' &&
        data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const email = typeof (data.payload.email) == 'string'
        && data.payload.email.trim().length > 0 ? data.payload.email : false;
    const phone = typeof (data.payload.phone) == 'string'
        && data.payload.phone.trim().length > 0 ? data.payload.phone : false;
    const password = typeof (data.payload.password) == 'string'
        && data.payload.password.trim().length > 0 ? data.payload.password : false;
    //const password2 = typeof (data.payload.password2) == 'string'
    //    && data.payload.password2.trim().length > 0 ? data.payload.password2 : false;
    console.log(data.payload);

    if (firstName && lastName && phone && password) {
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
        callback(400, { 'Error': 'Missing required fields' });
    }
}

// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
// TODO: Only let an authenticated user up their object. Dont let them access update elses.
handlers._users.put = function (data, callback) {
    // Check for required field
    const phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    // Check for optional fields
    const firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // Error if phone is invalid
    if (phone) {
        // Error if nothing is sent to update
        if (firstName || lastName || password) {
            // Lookup the user
            _data.read('users', phone, function (err, userData) {
                if (!err && userData) {
                    // Update the fields if necessary
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.hashedPassword = helpers.hash(password);
                    }
                    // Store the new updates
                    _data.update('users', phone, userData, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, { 'Error': 'Could not update the user.' });
                        }
                    });
                } else {
                    callback(400, { 'Error': 'Specified user does not exist.' });
                }
            });
        } else {
            callback(400, { 'Error': 'Missing fields to update.' });
        }
    } else {
        callback(400, { 'Error': 'Missing required field.' });
    }
};

// Required data: phone
// TODO: Only let an authenticated user delete their object. Dont let them delete update elses.
// TODO: Cleanup (delete) any other data files associated with the user
handlers._users.delete = function (data, callback) {
    // Check that phone number is valid
    var phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // Lookup the user
        _data.read('users', phone, function (err, data) {
            if (!err && data) {
                _data.delete('users', phone, function (err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, { 'Error': 'Could not delete the specified user' });
                    }
                });
            } else {
                callback(400, { 'Error': 'Could not find the specified user.' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' })
    }
};

handlers.tokens = (data, callback) => {
    const acceptableMethods = ['get', 'post', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._tokens = {};

handlers._tokens.post = () => {

};

handlers._tokens.get = () => {

};

handlers._tokens.put = () => {

};

handlers._tokens.delete = () => {

};

module.exports = handlers