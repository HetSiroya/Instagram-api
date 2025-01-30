var express = require('express');
const { getdata } = require('../Controllers/GetUserdata');
const { allposts, getpostbyid, getpostbyuserid } = require('../Controllers/ImageUpload')
var router = express.Router();



router.get('/user', getdata)
router.get('/usersposts', allposts)
router.get('/postbyid', getpostbyid)
router.get('/userid', getpostbyuserid)
module.exports = router;