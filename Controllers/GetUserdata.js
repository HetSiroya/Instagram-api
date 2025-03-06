const Userdata = require('../Models/Users')
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const express = require('express');
const file = require('../Models/file');
const Postlike = require('../Models/Postlike');
const Users = require('../Models/Users');

const app = express();
const router = express.Router();


exports.getdata = async (req, res) => {
    try {
        const user = req.user;

        res.status(200).json({ status: true, message: 'User Data', data: user });

    } catch (error) {
        console.error("Error decoding token:", error.message);
        return res.status(400).json({ status: false, message: 'Error', data: {} });
    }
};

exports.getpostall = async (req, res) => {
    try {
        let userdetails = [];
        const user = req.user;

        const postsall = await file.find(); // Fetch all posts

        let filteredPosts = [];

        for (const post of postsall) {
            if (post.userId.toString() !== user.id) {
                filteredPosts.push(post);

                console.log("Post ID:", post._id);

                // Fetch user details using aggregation
                const userDetail = await Users.aggregate([
                    {
                        $match: { _id: post.userId }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "_id",
                            foreignField: "_id",
                            as: "userdata"
                        }
                    },
                    { $unwind: "$userdata" }
                ]);
                if (userDetail.length > 0) {
                    userdetails.push(userDetail[0]);
                }
            }
        }

        if (filteredPosts.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }

        console.log("Filtered Posts:", filteredPosts.length);
        console.log("User Details:", userdetails.length);

        res.status(200).json({
            status: true,
            message: 'Posts fetched successfully',
            data: filteredPosts,
            userdetails: userdetails
        });

    } catch (error) {
        console.error("Error fetching posts:", error.message);
        return res.status(500).json({ status: false, message: 'Error fetching posts', data: {} });
    }
};
