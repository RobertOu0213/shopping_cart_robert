const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cart-controller')

router.post('/:id/add', cartController.addCart)
router.post('/:id/sub', cartController.subCart)
router.get('/', cartController.getCart)
router.post('/', cartController.postCart)

module.exports = router
