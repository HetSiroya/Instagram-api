const Userdata = require('../Models/Users')
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const express = require('express');
const file = require('../Models/file');
const Postlike = require('../Models/Postlike');
const Users = require('../Models/Users');

const app = express();
const router = express.Router();


exports.getpostall = async (req, res) => {
    try {
        const user = req.user;

        const filteredPosts = await file.aggregate([
            {
                $match: {
                    userId: { $ne: user.id }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            }
        ]);

        if (filteredPosts.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }

        res.status(200).json({
            status: true,
            message: 'Posts fetched successfully',
            data: filteredPosts
        });

    } catch (error) {
        console.error("Error fetching posts:", error.message);
        return res.status(500).json({ status: false, message: 'Error fetching posts', data: {} });
    }
};