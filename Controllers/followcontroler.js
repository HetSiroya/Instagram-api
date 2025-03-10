const express = require('express');
const jwt = require('jsonwebtoken');
const Users = require('../Models/Users');
const FollowModel = require('../Models/FollowModel');
const { blockuser } = require('../Helpers/Blockuser');

exports.followUser = async (req, res, next) => {
    try {
        const userID = req.user._id;
        const { userToFollow } = req.query;
        console.log("usertofollow:" + userToFollow);
        const followUser = await Users.findById(userToFollow);
        console.log("followUser: ", followUser);

        if (!followUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (userID == followUser.id) {
            return res.status(400).json({ message: "Cannot follow yourself" });
        }
        const userExists = await FollowModel.findOne({ UserID: userID });
        const blockusercheck = await blockuser(userToFollow, userID);

        console.log("blockusercheck", blockusercheck);
        if (blockusercheck) {
            return res.status(400).json({ message: "User is blocked" });
        }

        if (userExists) {
            return res.status(400).json({ message: "User already following" });
        }
        const follow = new FollowModel({ UserID: userID, FollowingID: followUser.id });
        follow.save()
        res.status(200).json({ message: "Followed successfully", data: follow })
    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json({ message: "Internal server error", data: error.message });
    }

}

exports.unfollowUser = async (req, res, next) => {
    try {
        const user = req.user;
        const loginuserid = user.id;
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
        const user = req.user;
        const follower = user.id;
        const followers = await FollowModel.find({ FollowingID: follower });
        const total = followers.length;

        const userdata = await Users.aggregate([
            {
                $match: {
                    _id: { $in: followers.map(follower => follower.UserID) }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    username: 1,
                    email: 1,
                    bio: 1,
                    profile: 1,
                    gender: 1
                }
            }
        ]);

        res.status(200).json({
            status: true,
            message: "Followers retrieved successfully",
            data: {
                followers: userdata,
                total: total
            }
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message
        });
    }
}

exports.getfollowering = async (req, res) => {
    try {
        const user = req.user;
        const follower = user.id;
        const following = await FollowModel.find({ UserID: follower });
        const total = following.length;

        // Get detailed user information for people being followed
        const userdata = await Users.aggregate([
            {
                $match: {
                    _id: { $in: following.map(follow => follow.FollowingID) }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    username: 1,
                    email: 1,
                    bio: 1,
                    profile: 1,
                    gender: 1
                }
            }
        ]);

        res.status(200).json({
            status: true,
            message: "Following list retrieved successfully",
            data: {
                following: userdata,
                total: total
            }
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message
        });
    }
}