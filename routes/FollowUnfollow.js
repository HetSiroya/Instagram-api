const express = require('express')
const { followUser, unfollowUser, getfollowers, getfollowering } = require('../Controllers/followcontroler')
const { security } = require('../Middlewares/token-decode')
const router = express.Router()

// Importing routes
router.post('/userfollow', security, followUser)
router.delete('/unfollowUser', security, unfollowUser)
router.get('/getuserfollow', security, getfollowers)
router.get('/getuserfollowing', security, getfollowering)

module.exports = router
