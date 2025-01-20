const express = require('express');
const jwt = require('jsonwebtoken');
exports.updatedata = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }
        console.log("Token:", token);
        // Decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // Log the decoded payload as a string for readability
        console.log("Decoded:", JSON.stringify(decoded));
        // Proceed with further logic
        res.status(200).json({ status: true, message: 'Token verified', data: decoded });
    } catch (error) {
        console.error("Error decoding token:", error.message);
        return res.status(400).json({ status: false, message: 'Invalid token', data: {} });
    }
};
