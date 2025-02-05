const express = require('express');
const { blockUser, unblock } = require('../Controllers/blockUnblockuser');
const router = express.Router();

router.post('/userblock', blockUser)
router.delete('/userunblock', unblock)

module.exports = router;