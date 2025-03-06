const express = require('express')
const router = express.Router()
const { Postcomment, getcomment, likecommets, unlikecommets } = require('../Controllers/Commetscontroller')
const { security } = require('../Middlewares/token-decode')

router.post('/postcomment', security, Postcomment)
router.get('/getcomment', getcomment)
router.patch('/likepostcommet', likecommets)
router.delete('/dislikecomment', unlikecommets)

module.exports = router