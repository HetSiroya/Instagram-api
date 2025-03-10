const express = require('express');
const Users = require('../Models/Users');
const jwt = require('jsonwebtoken');
const Blockmodel = require('../Models/Blockmodel');


exports.blockUser = async (req, res, next) => {
    try {
        const user = req.user
        const { blockuserid } = req.query;
        if (!blockuserid) {
            return res.status(400).json({ status: false, message: 'User ID is required', data: {} });
        }

        const blockuser = await Users.findById(blockuserid);

        if (!blockuser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.id === blockuserid) {
            return res.status(400).json({
                status: false,
                message: "You can't block yourself"
            });
        }

        const blocked = await Blockmodel.findOne({
            blockedBy: user.id,
            blockedTo: blockuserid
        });

        if (blocked) {
            return res.status(400).json({
                status: false,
                message: "User already blocked"
            });
        }

        const newBlock = new Blockmodel({
            blockedBy: user.id,
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
        const user = req.user;
        const { unblockuserid } = req.query;
        if (!unblockuserid) {
            return res.status(400).json({ status: false, message: 'User ID is required', data: {} });
        }
        const block = await Blockmodel.findOne({
            blockedBy: user.id,
            blockedTo: unblockuserid
        })
        if (!block) {
            return res.status(404).json({ status: false, message: 'User not blocked', data: {} });
        }
        console.log("block", block.id);
        const unblock = await Blockmodel.findByIdAndDelete(block.id);

        res.status(200).json({ status: true, message: "User Unblocked", data: unblock });
    } catch (error) {
        res.status(500).json({ satus: false, message: "", data: error.message });
    }


}