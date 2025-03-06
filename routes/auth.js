const express = require('express');
const { registerpost, Login, Users, changePassword, forgotPassword } = require('../Controllers/RegisterAuth');
// const { ImageUpload } = require('../Controllers/ImageUpload');
const router = express.Router();
const bcrypt = require('bcryptjs');
const app = require('../Controllers/ImageUpload');
const { security } = require('../Middlewares/token-decode');

router.post('/register', registerpost)
router.post('/Users', Users)
router.post('/Login', Login)
router.patch('/change-password', security, changePassword)
router.use('/forget-password', forgotPassword)

module.exports = router;