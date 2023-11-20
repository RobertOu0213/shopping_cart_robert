const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const passport = require('../../config/passport')
const upload = require('../../middleware/multer')

router.get('/login', adminController.loginPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/admin/login', failureFlash: true }), adminController.login)
router.get('/logout', adminController.logout)

router.get('/products/:id', adminController.getProduct)
router.get('/products', adminController.getProducts)
router.post('/products', upload.single('image'), adminController.postProducts)
router.put('/products/:id', upload.single('image'), adminController.putProducts)
router.delete('/products/:id', adminController.deleteProduct)

router.use('/', (req, res) => res.redirect('/admin/products'))

module.exports = router
