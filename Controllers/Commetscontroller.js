const express = require('express');
// const router = express.Router();
const app = express();
const Users = require('../Models/Users');
const commentmodel = require('../Models/Commetsmodel');
const jwt = require('jsonwebtoken');
const file = require('../Models/file');
const commetlikemodel = require('../Models/commetlikemodel');


exports.Postcomment = async (req, res, next) => {
    try {
        const { comment, postid } = req.body;
        console.log("PostId", postid);


        const userId = req.user.id;
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const Comment = await commentmodel.find({ postid })
        console.log("Comment " + Comment);

        // console.log(likes.length);

        const commentCount = Comment.length;
        // console.log("commentCount " + commentCount);

        const postup = await file.findByIdAndUpdate(postid, { $inc: { Comments: commentCount } }, { new: true });
        // console.log("Post after comment:", postup);
        await postup.save();
        const newCommet = new commentmodel({ comment, postid: postid, commentby: userId, commentbyUsername: user.name });
        await newCommet.save();

        return res.status(200).json({ status: true, message: 'Comment added successfully', data: newCommet });

        // res.json({ userId: userId })
    }
    catch (err) {
        console.log(err)
    }
}

exports.likecommets = async (req, res) => {
    try {
        const commentId = req.query.commentId;
        const userId = req.user.id;
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        const comment = await commentmodel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ status: false, message: "Comment not found" });
        }
        const finddata = await commetlikemodel.findOne({
            postid: comment.postid,
            commentid: comment.id,
            likeby: userId
        })
        if (finddata) {
            return res.status(400).json({ status: false, message: "You have already liked this comment" });
        }
        const userLike = new commetlikemodel({
            postid: comment.postid,
            commentid: comment.id,
            likeby: userId,
        });
        console.log("user like", userLike);
        userLike.save()

        const postid = await commentmodel.findById(commentId);

        const likecount = await commetlikemodel.find({
            postid: postid.postid
        })
        console.log("likecount", likecount);

        return res.status(200).json({
            status: true,
            message: "Comment liked successfully",
            data: userLike,
            likecount: likecount.length
        });

    }
    catch (err) {
        console.error("Error in likecommets:", err);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
}

exports.unlikecommets = async (req, res) => {
    try {
        const commentId = req.query.commentId;
        const userId = req.user.id;
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        const comment = await commentmodel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ status: false, message: "Comment not found" });
        }
        const likecount = commetlikemodel.find()
        console.log("like" + likecount.length);

        const finddata = await commetlikemodel.findOneAndDelete({
            postid: comment.postid,
            commentid: comment.id,
            likeby: userId
        })
        if (!finddata) {
            return res.status(404).json({ status: false, message: "You have not liked this comment" });
        }
        return res.status(200).json({
            status: true,
            message: "Comment disliked successfully",
            data: finddata
        });
    } catch (error) {
        console.error("Error in unlikecommets:", error);
        return res.status(500).json({
            status: false,
            message: "Error in the disliking the like",
            error: error.message
        });

    }
}

exports.getcomment = async (req, res, next) => {
    try {
        const { postId } = req.query;
        let { page, limit } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 2;
        const skip = (page - 1) * limit;
        const userId = req.user._id;
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const comments = await commentmodel.find().skip(skip).limit(limit);
        const totalPages = await commentmodel.countDocuments()
        return res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalPages / limit),
            totalComments: totalPages,
            data: comments,
            status: true,
            message: 'Comments fetched successfully'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}
