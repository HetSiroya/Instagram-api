
const mongoose = require('mongoose');
const Blocked = mongoose.Schema({

    blockedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    blockedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    blockDate: {
        type: Date,
        default: Date.now,
    }

})

module.exports = mongoose.model('Blocked', Blocked);