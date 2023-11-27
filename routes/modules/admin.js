const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/logout', adminController.logout)

router.get('/products/:id', authenticatedAdmin, adminController.getProduct)
router.get('/products', authenticatedAdmin, adminController.getProducts)
router.post('/products', upload.single('image'), adminController.postProducts)
router.put('/products/:id', upload.single('image'), adminController.putProducts)
router.delete('/products/:id', adminController.deleteProduct)

router.get('/orders/:id', authenticatedAdmin, adminController.getOrder)
router.get('/orders', authenticatedAdmin, adminController.getOrders)
router.post('/orders/:id/ship', adminController.shipOrder)
router.post('/orders/:id/cancel', adminController.cancelOrder)
router.post('/orders/:id/recover', adminController.recoverOrder)

router.get('/authority', authenticatedAdmin, adminController.getAuthority)
router.post('/authority/:id', adminController.changeAuth)
router.use('/', authenticatedAdmin, (req, res) => res.redirect('/admin/products'))

module.exports = router
