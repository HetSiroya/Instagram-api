const express = require('express');
// const jwt = require('jsonwebtoken');
const User = require('../Models/Users');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const generatetoken = require('../Helpers/tokens');

exports.updatedata = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }
        // console.log("Token:", token);
        // Decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // Log the decoded payload as a string for readability
        // console.log("Decoded:", JSON.stringify(decoded));
        // console.log("id", decoded.id);
        // Update the user data
        try {
            const { name, email, bio, gender, username, Mobilenumber, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            // console.log("hashedPassword", hashedPassword);
            const updatedata = { name, email, bio, gender, username, Mobilenumber, password: hashedPassword };
            const updatedUser = await User.findByIdAndUpdate(decoded.id, updatedata, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ status: false, message: 'User not found', data: {} });
            }
            const token = generatetoken(updatedUser)
            res.status(200).json({ status: true, message: 'User data updated successfully', data: updatedUser, token: token });
        } catch (error) {
            console.error("Error updating user data:", error.message);
            return res.status(500).json({ status: false, message: 'Error updating user data', data: {} });
        }
    } catch (error) {
        console.error("Error decoding token:", error.message);
        return res.status(400).json({ status: false, message: 'Invalid token', data: {} });
    }
};
