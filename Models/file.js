const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    like: {
        type: Number,
        default: 0,
    },
    Comments: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model('Posts', fileSchema);
