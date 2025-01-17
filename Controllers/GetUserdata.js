const Userdata = require('../Models/Login')
const jwt = require('jsonwebtoken');
const express = require('express');

const app = express();
const router = express.Router();


exports.getdata = async (req, res) => {
    try {
        const token = req.headers.authorization;
        console.log("token:" + token);
        const decoded = jwt.decode(token);
        console.log("decoded :" + decoded);
    } catch (error) {

    }
}