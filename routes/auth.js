const express = require('express');
const { registerpost, Login, Users, changePassword, forgotPassword, updatedata } = require('../Controllers/RegisterAuth');
// const { ImageUpload } = require('../Controllers/ImageUpload');
const router = express.Router();
const bcrypt = require('bcryptjs');
const app = require('../Controllers/ImageUpload');
const { security } = require('../Middlewares/token-decode');

router.post('/register', registerpost)
router.post('/Users', Users)
router.post('/Login', Login)
router.patch('/change-password', security, changePassword)
router.patch('/forget-password', forgotPassword)
router.patch("/update", security, updatedata);

module.exports = router;