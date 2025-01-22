var express = require('express');
var router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../Controllers/ImageUpload');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, 'Uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });


router.post('/', upload.array('file'), uploadFile);

module.exports = router;