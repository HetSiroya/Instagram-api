const express = require('express');
const { registerpost, Login, Users } = require('../Controllers/RegisterAuth');
const router = express.Router();



router.post('/register', registerpost)
router.post('/Users', Users)
// router.get('/')
module.exports = router;