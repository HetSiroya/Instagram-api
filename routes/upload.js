var express = require('express');
var router = express.Router();
const multer = require('multer');
const { uploadFile, deletepost, getuserpost } = require('../Controllers/ImageUpload');
const { postlike, deletepostlike } = require('../Controllers/Postlike');
const { upload } = require('../Middlewares/file-upload');
const { security } = require('../Middlewares/token-decode');


router.post('/', upload.single('file'), security, uploadFile);
router.delete('/delete', security, deletepost)
router.post('/postlike', security, postlike)
router.delete('/deletepostlilke', security, deletepostlike)
router.get('/getuserpost', security, getuserpost)

module.exports = router;    