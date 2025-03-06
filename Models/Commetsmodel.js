const mongoose = require('mongoose')


const postcommet = new mongoose.Schema({
    postid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file',
        required: true
    },

    comment: {
        type: String,
        required: true
    },
    commentby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    commentbyUsername: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Comments', postcommet)