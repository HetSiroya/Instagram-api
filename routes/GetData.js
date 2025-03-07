var express = require('express');
const { getdata, getpostall } = require('../Controllers/GetUserdata');
const { allposts, getpostbyid, getpostbyuserid, searchuser } = require('../Controllers/ImageUpload');
const { security } = require('../Middlewares/token-decode');

var router = express.Router();



router.get('/usersposts', allposts)
router.get('/postbyid', getpostbyid)
router.get('/userid', getpostbyuserid)
router.get('/search-user', searchuser)
router.get('/getallpost', security, getpostall)

module.exports = router;    