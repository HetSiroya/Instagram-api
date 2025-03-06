const express = require('express');
// const jwt = require('jsonwebtoken');
const User = require('../Models/Users');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const generatetoken = require('../Helpers/tokens');

exports.updatedata = async (req, res) => {
    try {
        const user = req.user;
        console.log("user", user);

        const { name, email, bio, gender, username, Mobilenumber, password } = req.body;
        console.log("email", email);

        let updatedata = { name, email, bio, gender, username, Mobilenumber };

        if (password && password !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedata.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $set: updatedata },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ status: false, message: 'User not found', data: {} });
        }

        const token = generatetoken(updatedUser);
        res.status(200).json({
            status: true,
            message: 'User data updated successfully',
            data: updatedUser,
            token: token
        });
    } catch (error) {
        console.error("Error updating user data:", error.message);
        return res.status(500).json({ status: false, message: 'Error updating user data', data: {} });
    }
} 
