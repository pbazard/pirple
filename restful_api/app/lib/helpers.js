
'use strict'

const crypto = require('crypto');
const config = require('./config');

const helpers = {};

// Create a SHA256 hash
helpers.hash = (str) => {
    if (typeof (str) == 'string' && str.length > 0) {
        var hash = crypto.createHmac('sha256', config.secret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

// Parse a json string to an object
helpers.parseJsonToObject = (str) => {
    try {
        const obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    };
};

module.exports = helpers;