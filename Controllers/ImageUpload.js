const File = require('../models/File');

const uploadFile = async (req, res) => {
    try {
        const { file } = req;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const newFile = new File({
            name: file.originalname,
            path: file.path,
            size: file.size,
        });

        await newFile.save();
        res.status(201).json({ message: 'File uploaded successfully', file: newFile });
    } catch (err) {
        res.status(500).json({ message: 'Error uploading file', error: err.message });
    }
};

module.exports = { uploadFile };