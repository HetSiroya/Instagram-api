const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    files: [
        {

            fileName: {
                type: String,
                required: true,
            },
            filePath: {
                type: String,
                required: true,
            },
            fileType: {
                type: String,
                required: true,
            },

            uploadedAt: {
                type: Date,
                default: Date.now,
            }
        }
    ],
    like: {
        type: Number,
        default: 1,
    },
    Comments: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model('Posts', fileSchema);
