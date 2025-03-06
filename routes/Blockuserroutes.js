const express = require('express');
const { blockUser, unblock } = require('../Controllers/blockUnblockuser');
const { security } = require('../Middlewares/token-decode');
const router = express.Router();

router.post('/userblock', security, blockUser)
router.delete('/userunblock', security, unblock)

module.exports = router;