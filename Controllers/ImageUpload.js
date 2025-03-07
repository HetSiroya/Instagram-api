const express = require('express');
const router = express.Router();
const app = express();
const file = require('../Models/file')
const jwt = require('jsonwebtoken');
const Postlike = require('../Models/Postlike');
const Users = require('../Models/Users');
const Posts = require('../Models/file');
const uploadFile = async (req, res) => {
    try {
        const user = req.user;
        const userId = user.id;
        const file = req.file;
        const newPost = new Posts({
            userId: userId,
            image: file.path
        });

        const data = await newPost.save();
        res.status(200).json({ status: true, message: 'File uploaded successfully', data });
    }
    catch (error) {
        console.error("Error uploading file:", error.message);
        return res.status(500).json({ status: false, message: 'Error uploading file', error: error.message });
    }
};

const deletepost = async (req, res) => {
    try {
        const user = req.user;
        const deleteid = req.query.deleteid;
        let post = await file.findById(deleteid);
        console.log(post);
        post = post.files
        const deletepost = await file.findByIdAndDelete(deleteid)
        if (!post) {
            return res.status(404).json({ status: false, message: 'Post not found' });
        }
        res.status(200).json({ status: true, message: 'Post deleted successfully' });
    }
    catch (error) {
        console.error("Error decoding token:", error.message);
        return res.status(400).json({ status: false, message: 'Invalid token', data: {} });
    }

}

const getuserpost = async (req, res) => {
    try {
        const user = req.user;
        const post = await Posts.find({
            userId: user.id
        });

        if (!post) {
            return res.status(404).json({ message: "User post not found" });
        }


        // console.log("User Post:", post);
        return res.status(200).json({ status: true, message: 'User post fetched successfully', data: post });
    }
    catch (error) {
        console.error("Error decoding token:", error.message);
        return res.status(400).json({ status: false, message: 'Invalid token', data: {} });
    }
}

const allposts = async (req, res) => {
    try {
        const posts = await Posts.find()

        if (!posts) {
            return res.status(404).json({ message: 'No posts found' });
        }
        return res.status(200).json({ status: true, message: 'Posts fetched successfully', data: posts });
    }
    catch (error) {
        console.error("Error decoding token:", error.message);
        return res.status(400).json({ status: false, message: 'Invalid token', data: {} });
    }

}

const getpostbyid = async (req, res) => {
    try {
        const postId = req.query.id
        const post = await Posts.findById(postId)
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({ status: true, message: 'Post fetched successfully', data: post });
    }
    catch (error) {
        console.error("Error decoding token:", error.message);
        return res.status(400).json({ status: false, message: 'Error', data: {} });
    }
}

const getpostbyuserid = async (req, res) => {
    try {
        const userId = req.query.userId
        const post = await Posts.find({ userId })
        if (!post) {
            return res.status(404).json({ message: 'No posts found' });
        }
        return res.status(200).json({ status: true, message: 'Posts fetched successfully', data: post });
    }
    catch (error) {
        console.error("Error decoding token:", error.message);
        return res.status(400).json({ status: false, message: 'Error', data: {} });
    }
}

const searchuser = async (req, res) => {
    try {
        const search = req.query.username
        const users = await Users.find({
            $or: [
                { username: new RegExp('^' + search, 'i') },
                { name: new RegExp('^' + search, 'i') },
            ]
        }).select(' username name')
        console.log('users', users);

        const data = users;
        return res.status(200).json({ status: true, message: 'Users fetched successfully', data: data });

    }
    catch (error) {
        console.error("Error decoding token:", error.message);
        return res.status(400).json({ status: false, message: 'Error', data: data });
    }
}

module.exports = { uploadFile, deletepost, getuserpost, allposts, getpostbyid, getpostbyuserid, searchuser };
