const express = require('express')
const app = express()
const port = 3000
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = 'public/uploads/';

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

exports.upload = upload;