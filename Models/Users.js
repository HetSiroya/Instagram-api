const mongoose = require('mongoose');
const { users } = require('../Controllers/RegisterAuth');
const { token } = require('morgan');

const Users = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
    },
    gender: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    Mobilenumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: null
    }
})

module.exports = mongoose.model('Users', Users);   