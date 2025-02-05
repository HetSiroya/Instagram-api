const express = require('express')
const router = express.Router()
const { Postcomment, getcomment, likecommets } = require('../Controllers/Commetscontroller')

router.post('/postcomment', Postcomment)
router.get('/getcomment', getcomment)
router.patch('/likepostcommet', likecommets)

module.exports = router