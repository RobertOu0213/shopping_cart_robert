const { Cart, CartItem } = require('../models')

const cartController = {
  postCart: async (req, res) => {
    try {
      // 判斷是否有使用者
      const user = req.user
      let cart = {}
      if (user) {
        const [userCart] = await Cart.findOrCreate({
          where: { UserId: req.user.id || 0 }
        })
        cart = userCart
      } else {
        const [userCart] = await Cart.findOrCreate({
          where: { id: req.session.cartId || 0 },
          defaults: { UserId: 0 }
        })
        cart = userCart
      }
      const [product, created] = await CartItem.findOrCreate({
        where: {
          CartId: cart.id,
          ProductId: req.body.productId
        },
        defaults: { quantity: 1 }
      })

      if (!created) product.quantity += 1
      await product.save()
      req.session.cartId = cart.id
      console.log(req.body)
      return res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = cartController
