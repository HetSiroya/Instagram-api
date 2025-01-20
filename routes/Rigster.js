const express = require('express');
const { registerpost, Login, Users, changePassword } = require('../Controllers/RegisterAuth');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/register', registerpost)
router.post('/Users', Users)
router.post('/Login', Login)
router.patch('/change-password', changePassword)
module.exports = router;