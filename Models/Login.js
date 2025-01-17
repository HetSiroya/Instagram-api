const mongoose = require('mongoose');
const { users } = require('../Controllers/RegisterAuth');

const login = new mongoose.Schema({
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
    otplogin: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Login', login);   