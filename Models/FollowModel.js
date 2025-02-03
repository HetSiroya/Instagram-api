const mongoose = require('mongoose');
const FollowSchema = new mongoose.Schema({
    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    FollowingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    FollowDate: {
        type: Date,
        default: Date.now,
    }

})

module.exports = mongoose.model('Follow', FollowSchema);