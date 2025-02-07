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
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        res.status(200).json({ status: true, message: 'Token verified', data: decoded });

    } catch (error) {
        console.error("Error decoding token:", error.message);
        return res.status(400).json({ status: false, message: 'Invalid token', data: {} });
    }
};

// exports.getpostall = async (req, res) => {
//     try {
//         let userdetails = [];
//         const token = req.header('Authorization')?.split(' ')[1];
//         if (!token) {
//             return res.status(400).json({ status: false, message: 'Token missing', data: {} });
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         const userID = decoded.id;
//         console.log("User ID:", userID);
//         const postsall = await file.find();
//         const separtearray = (postsall) => {
//             let separtearray = [];

//             postsall.forEach(post => {
//                 // console.log("User ID:", post.userId);    
//                 if (post.userId != userID) {

//                     separtearray.push(post);

//                     console.log("Post ID:", post.userId);
//                     // Fixed aggregation pipeline
//                     const orde = Users.aggregate([
//                         {
//                             $match: { userId: post.user }
//                         },
//                         {
//                             $lookup: {
//                                 from: "users", // Collection name should be lowercase
//                                 localField: "userid",
//                                 foreignField: "_id",
//                                 as: "userdata"
//                             }
//                         },
//                         {
//                             $unwind: "$userdata"
//                         }
//                     ]);
//                     userdetails.push(orde);
//                 }
//             })
//             return separtearray, userdetails;
//         }
//         const posts = separtearray(postsall);

//         console.log("Posts:", posts.length);
//         console.log("userdetails:", userdetails.length);

//         if (!posts) {
//             return res.status(404).json({ message: 'No posts found' });
//         }
//         console.log("Posts:", posts.length);


//         res.status(200).json({ status: true, message: 'Posts fetched successfully', data: posts });
//     }
//     catch (error) {
//         console.error("Error fetching posts:", error.message);
//         return res.status(500).json({ status: false, message: 'Error fetching posts', data: {} });
//     }
// }
// const jwt = require('jsonwebtoken');
// const Users = require('../models/user');  // Ensure correct path
// const File = require('../models/file');   // Ensure correct path

exports.getpostall = async (req, res) => {
    try {
        let userdetails = [];
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userID = decoded.id;
        console.log("User ID:", userID);

        const postsall = await file.find(); // Fetch all posts

        let filteredPosts = [];

        for (const post of postsall) {
            if (post.userId.toString() !== userID) {
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
