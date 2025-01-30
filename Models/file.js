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
            like: {
                type: Number,
                default: 0,
            },
            uploadedAt: {
                type: Date,
                default: Date.now,
            }
        }
    ]
});

module.exports = mongoose.model('File', fileSchema);
