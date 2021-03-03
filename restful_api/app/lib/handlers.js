'use strict'

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
        data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof (data.payload.lastName) == 'string' &&
        data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const phone = typeof (data.payload.phone);
    const email = typeof (data.payload.phone);
}

handlers._users.put = (data, callback) => {

}

handlers._users.delete = (data, callback) => {

}

module.exports = handlers