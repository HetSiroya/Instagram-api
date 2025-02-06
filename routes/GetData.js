var express = require('express');
const { getdata } = require('../Controllers/GetUserdata');
const { allposts, getpostbyid, getpostbyuserid, searchuser } = require('../Controllers/ImageUpload');

var router = express.Router();



router.get('/user', getdata)
router.get('/usersposts', allposts)
router.get('/postbyid', getpostbyid)
router.get('/userid', getpostbyuserid)
router.get('/search-user', searchuser)

module.exports = router;    