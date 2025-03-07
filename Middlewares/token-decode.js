
const express = require('express');
const jwt = require('jsonwebtoken');
const Users = require('../Models/Users');
require('dotenv').config();

exports.security = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }

        const token = authHeader.split(' ')[1];
        // console.log(token);

        if (!token) {
            return res.status(400).json({ status: false, message: 'Invalid token format', data: {} });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res.status(400).json({ status: false, message: 'Invalid token', data: {} });
        }

        const userId = decoded.id;
        const decodedUser = await Users.findById(userId);
        if (!decodedUser) {
            return res.status(400).json({ status: false, message: 'User not found', data: {} });
        }
        // console.log(decodedUser);
        if (token != decodedUser.token) {
            return res.status(400).json({ status: false, message: "token is not verifed", data: {} });
        }
        req.user = decodedUser;
        next();
    } catch (err) {
        return res.status(400).json({ status: false, message: err.message, data: {} });
    }
};