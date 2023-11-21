const { Cart, CartItem } = require('../models')

const cartController = {
  getCart: async (req, res) => {
    const UserId = req.user.id
    let cart = await Cart.findOne({ where: { UserId }, include: 'items' })
    if (!cart) res.render('cart')
    cart = cart.toJSON()
    console.log(cart.items)
    const totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
    res.render('cart', { cart, totalPrice })
  },
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
