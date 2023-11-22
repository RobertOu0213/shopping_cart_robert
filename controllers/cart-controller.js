const { Cart, CartItem } = require('../models')

const cartController = {
  getCart: async (req, res) => {
    try {
      const user = req.user
      if (!user) {
        req.flash('warning_messages', '請先登入!')
        return res.redirect('/users/login-in')
      }

      const UserId = req.user.id
      let cart = await Cart.findOne({ where: { UserId }, include: 'items' })
      if (!cart) res.render('cart')
      cart = cart.toJSON()
      const totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0

      res.render('cart', { cart, totalPrice })
    } catch (err) {
      console.log(err)
    }
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
      return res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  },
  addCart: async (req, res) => {
    try {
      const id = req.params.id
      const cartItem = await CartItem.findByPk(id)
      await cartItem.update({ quantity: cartItem.quantity + 1 })
      return res.redirect('back')
    } catch (err) { console.log(err) }
  },
  subCart: async (req, res) => {
    try {
      const id = req.params.id
      const cartItem = await CartItem.findByPk(id)
      await cartItem.update({ quantity: cartItem.quantity - 1 >= 1 ? cartItem.quantity - 1 : 1 })
      return res.redirect('back')
    } catch (err) { console.log(err) }
  },
  deleteCart: async (req, res) => {
    try {
      const id = req.params.id
      const cartItem = await CartItem.findByPk(id)
      await cartItem.destroy()
      return res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = cartController
