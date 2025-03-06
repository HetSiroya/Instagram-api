var express = require('express');
var router = express.Router();
const auth = require('./auth')
const GetData = require('./GetData');
const updatedata = require('./Updatedata');
const upload = require('./upload');
const postcomment = require('./commetroute');

const Blockuserroutes = require('./Blockuserroutes');

const FollowUnfollow = require('./FollowUnfollow');
const { security } = require('../Middlewares/token-decode');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.use('/auth', auth)
router.use('/get', GetData)
router.use('/update', security, updatedata)
router.use('/upload', security, upload)
router.use('/comment', postcomment)
router.use('/follow', FollowUnfollow)
router.use('/block', Blockuserroutes)
module.exports = router;
