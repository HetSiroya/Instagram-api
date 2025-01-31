const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    postid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: true,
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    likedAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('like', LikeSchema);
