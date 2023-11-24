const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/order-controller')

router.get('/data', orderController.fillOrder)
router.post('/data', orderController.postOrder)
router.get('/:id', orderController.getOrder)

module.exports = router
