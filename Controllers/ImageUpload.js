const express = require('express');
const router = express.Router();
const app = express();
const file = require('../Models/file')
const jwt = require('jsonwebtoken');
const { find } = require('../Models/Users');
// const decoded = require('../Middleware/decode');

// const user = require('../Models/Users');


const uploadFile = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // decoded(req);

        // console.log("decoded", decoded.id);

        // Ensure `req.files` exists and is an array
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }


        // console.log(userId);
        const userId = decoded.id;
        // console.log(userId);

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

const deletepost = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const id = req.query.id;
        const deleteid = req.query.deleteid;
        // console.log("deleteid" + deleteid);
        // console.log(id);
        let post = await file.findById(id);
        console.log(post);
        // const deletepost = await file.findByIdAndDelete(id);
        post = post.files
        const deletepost = await file.findByIdAndDelete(
            // if(post == deleteid){
            //     return deletepost;
            // }
            // else{
            //     return null;
            // }    
        )
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
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;
        console.log("Decoded User ID:", userId);
        const post = await file.find({ userId });
        if (!post) {
            return res.status(404).json({ message: "User post not found" });
        }

        console.log("User Post:", post);
        return res.status(200).json({ status: true, message: 'User post fetched successfully', data: post });
    }
    catch (error) {
        console.error("Error decoding token:", error.message);
        return res.status(400).json({ status: false, message: 'Invalid token', data: {} });
    }
}


const allposts = async (req, res) => {
    try {
        const posts = await file.find()
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
        const post = await file.findById(postId)
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
        // const token = req.header('Authorization')?.split(' ')[1];
        // if (!token) {
        //     return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        // }

        // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // // decoded(req);

        // console.log("decoded", decoded.id);
        const userId = req.query.userId
        const post = await file.find({ userId })
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

module.exports = { uploadFile, deletepost, getuserpost, allposts, getpostbyid, getpostbyuserid };
