const mongoose = require('mongoose');
const likecommetSchema = mongoose.Schema({
    postid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file',
        required: true
    },
    commentid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments',
        required: true
    },
    likeby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    likedate: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('LikeComment', likecommetSchema)