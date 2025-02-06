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
        const commentcnt = await commentmodel.find({ postid })
        console.log("commentcnt " + commentcnt);

        // console.log(likes.length);

        const commentCount = commentcnt.length;
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

// exports.likecommets = async (req, res) => {
//     try {
//         const commentId = req.query.commentId;
//         const token = req.header('Authorization')?.split(' ')[1];

//         if (!token) {
//             return res.status(400).json({ status: false, message: 'Token missing', data: {} });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         const userId = decoded.id;

//         const user = await Users.findById(userId);
//         if (!user) {
//             return res.status(404).json({ status: false, message: "User not found" });
//         }

//         const comment = await commentmodel.findById(commentId);
//         if (!comment) {
//             return res.status(404).json({ status: false, message: "Comment not found" });
//         }

//         // Check if user has already liked the comment
//         if (comment.Likedby && comment.Likedby.includes(userId)) {
//             return res.status(400).json({ status: false, message: "You have already liked this comment" });
//         }

//         // Update the comment with like
//         const updatedComment = await commentmodel.findByIdAndUpdate(
//             commentId,
//             {
//                 $inc: { Commet_like: 1 },
//                 Likedby: userId
//             },
//             { new: true }
//         );

//         return res.status(200).json({
//             status: true,
//             message: "Comment liked successfully",
//             data: updatedComment
//         });
//     }
//     catch (err) {
//         console.error("Error in likecommets:", err);
//         return res.status(500).json({
//             status: false,
//             message: "Internal server error",
//             error: err.message
//         });
//     }
// }
exports.likecommets = async (req, res) => {
    try {
        const commentId = req.query.commentId;
        const token = req.header('Authorization')?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;

        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        const comment = await commentmodel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ status: false, message: "Comment not found" });
        }
        const likecount = await commetlikemodel.find({
            postid: comment.postid
        })  
        // console.log("post", comment.postid);
        const finddata = await commetlikemodel.findOne({
            postid: comment.postid,
            commentid: comment.id,
            likeby: userId
        })
        // console.log("finddata", finddata);
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
        const token = req.header('Authorization')?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        const comment = await commentmodel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ status: false, message: "Comment not found" });
        }
        const likecount = commetlikemodel.find()
        console.log("like" + likecount);

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
