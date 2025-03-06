const express = require('express');
// const router = express.Router();
const app = express();
const jwt = require('jsonwebtoken');
const Users = require('../Models/Users');
const Postlike = require('../Models/Postlike');
const { findOne } = require('../Models/RigsterModel');
const Blockmodel = require('../Models/Blockmodel');
// const { find } = require('../Models/RigsterModel');
// const file = require('../Models/file');
const Posts = require('../Models/file');


exports.postlike = async (req, res) => {
    try {
        const postid = req.query.id;
        console.log(postid);
        const user = req.user;
        const userId = user._id;
        const post = await Posts.findById(postid);
        if (!post) {
            return res.status(400).json({ status: false, message: 'Post not found', data: {} });
        }
        const exitsingLike = await Postlike.findOne({ postid, likedBy: user._id });
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
        const file = await Posts.findById(postid);
        console.log("user: " + file.userId);
        const blockusercheck = await Blockmodel.findOne({
            blockedBy: file.userId
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

        const postup = await Posts.findByIdAndUpdate(postid, { $inc: { like: likeCount } }, { new: true });
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
        const user = req.user;
        const userId = user.id;


        const exist = await Users.findById(userId);
        if (!exist) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("postID", postId);

        const post = await Posts.findById(postId);
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



