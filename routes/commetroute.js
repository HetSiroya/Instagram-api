const express = require('express')
const router = express.Router()
const { Postcomment, getcomment } = require('../Controllers/Commetscontroller')

router.post('/postcomment', Postcomment)
router.get('/getcomment', getcomment)

module.exports = router