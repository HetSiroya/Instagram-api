const express = require('express')
const { followUser, unfollowUser, getfollowers, getfollowering } = require('../Controllers/followcontroler')
const router = express.Router()

// Importing routes
router.post('/userfollow', followUser)
router.delete('/unfollowUser', unfollowUser)
router.get('/getuserfollow', getfollowers)
router.get('/getuserfollowing', getfollowering)

module.exports = router
