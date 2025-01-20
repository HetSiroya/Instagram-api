var express = require('express');
var router = express.Router();
const Rigster = require('./Rigster')
const GetData = require('./GetData');
const updatedata = require('./Updatedata');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.use('/auth', Rigster)
router.use('/get', GetData)
router.use('/update', updatedata)


module.exports = router;
