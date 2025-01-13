var express = require('express');
var router = express.Router();
const Rigster = require('./Rigster')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.use('/auth', Rigster)

module.exports = router;
