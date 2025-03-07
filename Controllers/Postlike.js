const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const Users = require('../Models/Users');
const Postlike = require('../Models/Postlike');
const Blockmodel = require('../Models/Blockmodel');
const Posts = require('../Models/file');


exports.postlike = async (req, res) => {
    try {
        const postid = req.query.id;
        // console.log(postid);
        const user = req.user;
        const userId = user._id;
        const post = await Posts.findById(postid);
        if (!post) {
            return res.status(400).json({ status: false, message: 'Post not found', data: {} });
        }
        const exitsingLike = await Postlike.findOne({ postid, likedBy: user._id });
        const file = await Posts.findById(postid);
        // console.log("user: " + file.userId);
        const blockusercheck = await Blockmodel.findOne({
            blockedBy: file.userId
        })
        if (blockusercheck) {
            return res.status(400).json({ status: false, message: 'User Blocked', data: {} });
        }

        if (exitsingLike) {
            return res
                .status(400)
                .json({ status: false, message: "Post Already Liked" });
        }

        const newLike = new Postlike({ postid, likedBy: userId });
        await newLike.save();

        // Get user data who liked the post
        const likerData = await Users.aggregate([
            {
                $match: { _id: userId }
            },
            {
                $project: {
                    name: 1,
                    username: 1,
                    email: 1,
                    bio: 1,
                    gender: 1,
                }
            }
        ]);

        const likes = await Postlike.find({ postid })
        const likeCount = likes.length;
        const postup = await Posts.findByIdAndUpdate(postid, { $inc: { like: likeCount } }, { new: true });
        await postup.save();

        return res.status(200).json({
            status: true,
            message: 'Post liked successfully',
            data: {
                like: newLike,
                likedByUser: likerData[0], // Include user data who liked the post
            },
            count: likeCount,
            // orde: orde
        });

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



