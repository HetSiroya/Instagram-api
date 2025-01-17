var express = require('express');
const { getdata } = require('../Controllers/GetUserdata');
var router = express.Router();



router.get('/user', getdata)

module.exports = router;