const Userdata = require('../Models/Users')
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const express = require('express');

const app = express();
const router = express.Router();


exports.getdata = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        res.status(200).json({ status: true, message: 'Token verified', data: decoded });
    } catch (error) {
        console.error("Error decoding token:", error.message);
        return res.status(400).json({ status: false, message: 'Invalid token', data: {} });
    }
};
