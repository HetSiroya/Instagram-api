var express = require('express');
var router = express.Router();
const Rigster = require('./Rigster')
const GetData = require('./GetData');
const updatedata = require('./Updatedata');
const upload = require('./upload');
const postcomment = require('./commetroute');

const FollowUnfollow = require('./FollowUnfollow');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.use('/auth', Rigster)
router.use('/get', GetData)
router.use('/update', updatedata)
router.use('/upload', upload)
router.use('/comment', postcomment)
router.use('/follow', FollowUnfollow)
module.exports = router;
