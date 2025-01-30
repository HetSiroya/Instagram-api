var express = require('express');
var router = express.Router();
const multer = require('multer');
const { uploadFile, deletepost, getuserpost } = require('../Controllers/ImageUpload');
const { postlike, deletepostlike } = require('../Controllers/Postlike');
// const {  } = require('../Controllers/');



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
router.delete('/delete', deletepost)
router.post('/postlike', postlike)
router.delete('/deletepostlilke', deletepostlike)
router.get('/getuserpost', getuserpost)

module.exports = router;    