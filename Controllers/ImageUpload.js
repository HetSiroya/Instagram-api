const express = require('express');
const router = express.Router();
const app = express();
const file = require('../Models/file')
const jwt = require('jsonwebtoken')

// const user = require('../Models/Users');


const uploadFile = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        console.log("decoded", decoded.id);

        // Ensure `req.files` exists and is an array
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }


        // console.log(userId);
        const userId = decoded.id;
        console.log(userId);

        const newPost = new file({ userId });
        if (req.files && req.files.length > 0) {
            newPost.files = req.files.map((file) => ({
                fileName: file.originalname,
                filePath: file.filename,
                fileType: file.mimetype.split("/")[1],

            }));
        }
        const data = await newPost.save();
        res.status(200).json({ status: true, message: 'File uploaded successfully', data });
    }
    catch (error) {
        console.error("Error decoding token:", error.message);
        return res.status(400).json({ status: false, message: 'Invalid token', data: {} });
    }
};

module.exports = { uploadFile };
