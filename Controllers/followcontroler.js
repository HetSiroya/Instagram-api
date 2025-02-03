const express = require('express');
const jwt = require('jsonwebtoken');
const Users = require('../Models/Users');
const FollowModel = require('../Models/FollowModel');

exports.followUser = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(400).json({ status: false, message: 'Token missing', data: {} });
    }
    // if (!req.body.password || !req.body.newpassword) {
    //     return res.status(400).json({ status: false, message: 'Password and new password are required', data: {} });
    // }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { userToFollow } = req.body;
    const followUser = await Users.findById(userToFollow);
    const userID = decoded.id;
    console.log("followUser ID: " + followUser.id);
    console.log("UserID: " + userID);

    if (!followUser) {
        return res.status(404).json({ message: "User not found" });
    }
    if (userID == followUser.id) {
        return res.status(400).json({ message: "Cannot follow yourself" });
    }
    const userExists = await FollowModel.findOne({ UserID: userID });
    if (userExists) {
        return res.status(400).json({ message: "User already following" });
    }
    const follow = new FollowModel({ UserID: userID, FollowingID: followUser.id });
    follow.save()
    res.status(200).json({ message: "Followed successfully", data: "" })
}

exports.unfollowUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const loginuserid = decoded.id;
        const userToUnfollow = req.query.unfollowid;
        const userExists = await FollowModel.findOne({ UserID: loginuserid, FollowingID: userToUnfollow });
        if (!userExists) {
            return res.status(404).json({ message: "User not found to unfollow" });
        }
        await FollowModel.deleteOne({ UserID: loginuserid, FollowingID: userToUnfollow });
        res.status(200).json({ message: "Unfollowed successfully", data: "" })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }

}

exports.getfollowers = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const follower = decoded.id
        const followers = await FollowModel.find({ FollowingID: follower });
        const total = followers.length
        res.status(200).json({ followers: followers, total: total })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.getfollowering = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const follower = decoded.id
        const followers = await FollowModel.find({ UserID: follower });
        const total = followers.length
        res.status(200).json({ followers: followers, total: total })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}