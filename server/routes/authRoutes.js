const express = require('express')
const router = express.Router()
const { loginUser, verify } = require('../controllers/authController.js')

router.post('/login', loginUser)
router.get('/verify', verify)

module.exports = router
