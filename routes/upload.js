var express = require('express');
var router = express.Router();

const { ImageUpload } = require('../Controllers/ImageUpload');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });


router.post('/upload', upload.single('file'), ImageUpload);