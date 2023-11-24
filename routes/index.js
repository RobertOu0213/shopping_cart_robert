const express = require('express')
const router = express.Router()
const productController = require('../controllers/product-controller')
const admin = require('./modules/admin')
const users = require('./modules/users')
const cart = require('./modules/cart')
const order = require('./modules/order')
const { authenticated } = require('../middleware/auth')

router.use('/admin', admin)
router.use('/users', users)
router.use('/cart', authenticated, cart)
router.use('/order', authenticated, order)
router.get('/products', productController.getProducts)
router.use('/', (req, res) => { res.redirect('/products') })

module.exports = router
