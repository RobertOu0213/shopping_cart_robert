const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')

router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.login)

router.get('/register', userController.registerPage)
router.post('/register', userController.register)

router.get('/logout', userController.logout)

module.exports = router
