"use strict"
/**
 * Primary file for the API
 */

// Dependencies
const { stat } = require('fs');
const http = require('http');
const { type } = require('os');
const { StringDecoder } = require('string_decoder');
const url = require('url');
const fs = require('fs');
const _data = require('./lib/data');

// TESTING
//@TODO delete this
_data.create('test', 'newFile', { 'foo': 'bar' }, (err) => {
    console.log('There was an error', err);
});

_data.read('test', 'newFile', (err, data) => {
    console.log('There was an error', err, ' and this was the data', data);
});

_data.update('test', 'newFile', { 'fizz': 'buzz' }, (err, data) => {
    console.log('There was an error', err);
});

/** 
_data.delete('test', 'newFile', (err) => {
    console.log('There was an error', err);
});
*/

// Server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const queryStringObject = parsedUrl.query;
    const method = req.method.toLocaleLowerCase();
    const headers = req.headers;
    const decoder = new StringDecoder('utf-8');
    const buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        chosenHandler(data, function (statusCode, payload) {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            payload = typeof (payload) == 'object' ? payload : {};
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log("Return this response ", statusCode, payloadString);
        });
    });
});

const handlers = {};

handlers.notFound = (data, callback) => {
    callback(404);
};

handlers.hello = (data, callback) => {
    callback(406, { 'msg': 'Hello Pirple World!' });
};


const router = {
    'sample': handlers.sample,
    'hello': handlers.hello
};

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});
