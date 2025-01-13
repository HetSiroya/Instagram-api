const express = require('express');
const { registerpost, users } = require('../Controllers/RegisterAuth');
const router = express.Router();



router.post('/register', registerpost)
router.post('/users', users)

module.exports = router;