const express = require('express');
const Users = require('../Models/Users');
const Blockmodel = require('../Models/Blockmodel');


exports.blockuser = async (blockto, blockby) => {
    console.log(blockto);
    console.log(blockby);


    const blockusercheck = await Blockmodel.findOne({
        $or: [
            {
                blockedBy: blockby,
                blockedTo: blockto
            },
            {
                blockedBy: blockto,
                blockedTo: blockby
            }
        ]
    })
    console.log(blockusercheck);
    if (blockusercheck) {
        return true;
    }

    return false;
}