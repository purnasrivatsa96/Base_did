/**
 * Cors method to eliminate cross origin resource sharing issues
 */
const express = require('express');
const cors = require('cors');
const app = express();


const whitelist = ['http://localhost:3000', 'https://localhost:3443']; // ports for the server
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    corsOptions = { origin: true };
    // if(whitelist.indexOf(req.header('Origin')) !== -1) {
    //     corsOptions = { origin: true };
    // }
    // else {
    //     corsOptions = { origin: true };
    // }
    callback(null, corsOptions);
};



exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
