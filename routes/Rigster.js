const express = require('express');
const { registerpost, Login } = require('../Controllers/RegisterAuth');
const router = express.Router();



router.post('/register', registerpost)
router.post('/login', Login)
// router.get('/')
module.exports = router;