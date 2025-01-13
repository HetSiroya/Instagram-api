const mongoose = require('mongoose');

const RigsterModel = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Rigster', RigsterModel)




