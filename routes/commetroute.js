const express = require('express')
const router = express.Router()
const { Postcomment, getcomment, likecommets, unlikecommets } = require('../Controllers/Commetscontroller')
const { security } = require('../Middlewares/token-decode')

router.post('/postcomment', security, Postcomment)
router.get('/getcomment', security, getcomment)
router.patch('/likepostcommet', security, likecommets)
router.delete('/dislikecomment', security, unlikecommets)

module.exports = router