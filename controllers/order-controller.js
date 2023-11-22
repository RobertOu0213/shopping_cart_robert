const { Cart } = require('../models')
const orderController = {
  getOrder: async (req, res) => {
    try {
      const UserId = req.user.id
      const cart = await Cart.findOne({ where: { UserId }, include: 'items', raw: true, nest: true })
      if (!cart || !cart.items.length) {
        req.flash('warning_messsags', '購物車是空的!')
        return res.redirect('/cart')
      }
      const cartId = cart.id
      const amount = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      res.render('orderInfo', { cartId, amount })
    } catch (err) {
      console.log(err)
    }
  },
  postOrder: (req, res) => {

  }
}

module.exports = orderController
