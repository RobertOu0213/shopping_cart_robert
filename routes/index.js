const express = require('express')
const router = express.Router()
const productController = require('../controllers/product-controller')
const admin = require('./modules/admin')
const users = require('./modules/users')

router.use('/admin', admin)
router.use('/users', users)
router.get('/products', productController.getProducts)
router.use('/', (req, res) => { res.redirect('/products') })

module.exports = router
