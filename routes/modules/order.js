const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/order-controller')

router.get('/data', orderController.getOrder)
router.post('/data', orderController.postOrder)

module.exports = router
