const express = require('express');
const Users = require('../Models/Users');
const jwt = require('jsonwebtoken');
const Blockmodel = require('../Models/Blockmodel');


exports.blockUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log("decoded id", decoded.id);

        const { blockuserid } = req.body;
        if (!blockuserid) {
            return res.status(400).json({ status: false, message: 'User ID is required', data: {} });
        }

        const user = await Users.findById(blockuserid);
        // console.log("user", user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // console.log("blockuserid", blockuserid);

        const blocked = await Blockmodel.findOne({
            blockedBy: decoded.id,
            blockedTo: blockuserid
        });

        if (blocked) {
            return res.status(400).json({
                status: false,
                message: "User already blocked"
            });
        }

        const newBlock = new Blockmodel({
            blockedBy: decoded.id,
            blockedTo: blockuserid
        });
        await newBlock.save();

        res.status(200).json({
            status: true,
            message: 'User blocked successfully',
            block: newBlock
        });
    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json({ message: "Internal server error", data: error.message });
    }

}
exports.unblock = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { unblockuserid } = req.body;
        if (!unblockuserid) {
            return res.status(400).json({ status: false, message: 'User ID is required', data: {} });
        }
        const block = await Blockmodel.findOne({
            blockedBy: decoded.id,
            blockedTo: unblockuserid
        })
        if (!block) {
            return res.status(404).json({ status: false, message: 'User not blocked', data: {} });
        }
        console.log("block", block.id);
        const unblock = await Blockmodel.findByIdAndDelete(block.id);

        res.status(200).json({ status: true, message: "User Unblocked", data: unblock });
    } catch (error) {
        // console.log("Error", error);
        res.status(500).json({ satus: false, message: "", data: error.message });
    }


}