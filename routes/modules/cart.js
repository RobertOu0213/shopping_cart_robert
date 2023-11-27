const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cart-controller')
const { authenticated } = require('../../middleware/auth')

router.post('/:id/add', cartController.addCart)
router.post('/:id/sub', cartController.subCart)
router.delete('/:id', cartController.deleteCart)
router.get('/', authenticated, cartController.getCart)
router.post('/', cartController.postCart)

module.exports = router
