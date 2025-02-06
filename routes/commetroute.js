const express = require('express')
const router = express.Router()
const { Postcomment, getcomment, likecommets, unlikecommets } = require('../Controllers/Commetscontroller')

router.post('/postcomment', Postcomment)
router.get('/getcomment', getcomment)
router.patch('/likepostcommet', likecommets)
router.delete('/dislikecomment', unlikecommets)

module.exports = router