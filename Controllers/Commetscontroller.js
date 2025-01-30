const express = require('express');
// const router = express.Router();
const app = express();
const Users = require('../Models/Users');
const File = require('../Models/file');
const commentmodel = require('../Models/Commetsmodel');
const jwt = require('jsonwebtoken');


exports.Postcomment = async (req, res, next) => {
    try {
        const { comment, postId } = req.body;
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;
        console.log("userId " + userId);
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newCommet = new commentmodel({ comment, postid: postId, commentby: userId, commentbyUsername: user.name });
        await newCommet.save();
        return res.status(200).json({ status: true, message: 'Comment added successfully', data: newCommet });

        // res.json({ userId: userId })
    }
    catch (err) {
        console.log(err)
    }
}


exports.getcomment = async (req, res, next) => {
    try {
        const postId = req.query.postId;
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;
        console.log("userId " + userId);
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const comments = await commentmodel.find();
        console.log(comments);

        return res.status(200).json({ status: true, message: 'Comments fetched successfully', data: comments });

    } catch (error) {
        console.log(error);
    }
}


