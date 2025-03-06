var express = require('express');
var router = express.Router();
const multer = require('multer');
const { uploadFile, deletepost, getuserpost } = require('../Controllers/ImageUpload');
const { postlike, deletepostlike } = require('../Controllers/Postlike');
const { upload } = require('../Middlewares/file-upload');
const { security } = require('../Middlewares/token-decode');
// const {  } = require('../Controllers/');





router.post('/', upload.array('file'), uploadFile);
router.delete('/delete', deletepost)
router.post('/postlike', security, postlike)
router.delete('/deletepostlilke', security, deletepostlike)
router.get('/getuserpost', getuserpost)

module.exports = router;    