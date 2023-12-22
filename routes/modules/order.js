const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/order-controller')

router.get('/data', orderController.fillOrder)
router.post('/data', orderController.postOrder)
router.get('/:id', orderController.getOrder)
router.post('/:id/cancel', orderController.cancelOrder)
router.get('/', orderController.getOrders)

router.post('/newebpay/callback', orderController.newebpayCallback)

module.exports = router
