const express = require('express');
// const router = express.Router();
const app = express();
const file = require('../Models/file');
const jwt = require('jsonwebtoken');
const Users = require('../Models/Users');
const Postlike = require('../Models/Postlike');
const { find } = require('../Models/RigsterModel');


exports.postlike = async (req, res) => {
    try {
        const postid = req.query.id;
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;

        const post = file.findById(postid);
        if (!post) {
            return res.status(400).json({ status: false, message: 'Post not found', data: {} });
        }

        const exitsingLike = await Postlike.findOne({ postid, likedBy: userId });
        if (exitsingLike) {
            return res
                .status(400)
                .json({ status: false, message: "Post Already Liked" });
        }

        const newLike = new Postlike({ postid, likedBy: userId });
        await newLike.save();
        return res.status(200).json({ status: true, message: 'Post liked successfully', data: newLike });

    } catch (error) {
        console.error("Error decoding token:", error.message);
        return res.status(400).json({ status: false, message: 'Invalid token', data: {} });
    }

}

exports.deletepostlike = async (req, res) => {
    try {
        const { postId } = req.query.id;
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;
        console.log("Decoded User ID:", userId);

        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("postID", postId);

        const post = file.findById(postId);
        console.log("Post:", post);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const like = await Postlike.findOneAndDelete({ postId, likedBy: userId });
        if (!like) {
            return res.status(400).json({ status: false, message: "Post not liked" });
        }
        // await like.save();
        return res
            .status(200)
            .json({ status: true, message: "Post unliked successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



