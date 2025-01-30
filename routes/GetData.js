var express = require('express');
const { getdata } = require('../Controllers/GetUserdata');
const { allposts, getpostbyid, getpostbyuserid } = require('../Controllers/ImageUpload');
const { like } = require('../Controllers/Postlike');
var router = express.Router();



router.get('/user', getdata)
router.get('/usersposts', allposts)
router.get('/postbyid', getpostbyid)
router.get('/userid', getpostbyuserid)
router.get('/like', like)
module.exports = router;