const express = require('express');
var router = express.Router();
const { updatedata } = require('../Controllers/Updateuser');


router.patch("/", updatedata);

module.exports = router;
