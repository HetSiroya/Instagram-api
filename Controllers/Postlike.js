const express = require('express');
// const router = express.Router();
const app = express();
const file = require('../Models/file');
const jwt = require('jsonwebtoken');
const Users = require('../Models/Users');
const Postlike = require('../Models/Postlike');
const { findOne } = require('../Models/RigsterModel');
const Blockmodel = require('../Models/Blockmodel');
// const { find } = require('../Models/RigsterModel');
// const file = require('../Models/file');


exports.postlike = async (req, res) => {
    try {
        const postid = req.query.id;
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;

        const post = await file.findById(postid);
        if (!post) {
            return res.status(400).json({ status: false, message: 'Post not found', data: {} });
        }


        const exitsingLike = await Postlike.findOne({ postid, likedBy: userId });

        // Fixed aggregation pipeline
        const orde = await Postlike.aggregate([
            {
                $match: { postid: postid }
            },
            {
                $lookup: {
                    from: "users", // Collection name should be lowercase
                    localField: "likedBy",
                    foreignField: "_id",
                    as: "likedByUser"
                }
            },
            {
                $unwind: "$likedByUser"
            }
        ]);

        console.log("orde: " + orde);
        const user = await file.findById(postid);
        console.log("user: " + user.userId);
        const blockusercheck = await Blockmodel.findOne({
            blockedBy: user.userId
        })
        if (blockusercheck) {
            return res.status(400).json({ status: false, message: 'User Blocked', data: {} });
        }


        const likes = await Postlike.find({ postid })


        const likeCount = likes.length;


        if (exitsingLike) {
            return res
                .status(400)
                .json({ status: false, message: "Post Already Liked" });
        }

        const postup = await file.findByIdAndUpdate(postid, { $inc: { like: likeCount } }, { new: true });
        await postup.save();


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

        const post = await file.findById(postId);
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



