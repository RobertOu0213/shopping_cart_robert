const { Product, Cart, CartItem } = require('../models')
const productController = {
  // getProducts: async (req, res) => {
  //   const products = await Product.findAll({ raw: true, nest: true })
  //   res.render('products', { products })
  // }
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll({ raw: true, nest: true })

      // 沒有登入
      if (!req.user) {
        // 沒有購物車
        if (!req.session.cartId) {
          return res.render('products', { products })
        } else {
          let cart = await Cart.findByPk(req.session.cartId, { include: 'items' })
          cart = cart || { items: [] }
          const totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
          return res.render('products', { products, cart: cart.toJSON(), totalPrice })
        }
      } else {
        // 登入後
        let cart = await Cart.findOne({
          where: { UserId: req.user.id },
          include: 'items'
        })
        if (!req.session.cartId) {
          if (!cart) {
            return res.render('products', { products })
          } else {
            cart = cart.toJSON()
            const totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
            return res.render('products', { products, cart, totalPrice })
          }
        } else {
          if (!cart) {
          // 更新使用者購物車
            await Cart.update(
              { UserId: req.user.id },
              { where: { id: req.session.cartId } }
            )
            let userCart = await Cart.findOne({
              where: { UserId: req.user.id },
              include: 'items'
            })
            userCart = userCart.toJSON()
            const totalPrice = userCart.items.length > 0 ? userCart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
            return res.render('products', { products, cart: userCart, totalPrice })
          } else {
          // 更新購物車 id
            await CartItem.update(
              { CartId: cart.id },
              { where: { CartId: req.session.cartId } }
            )
            let userCart = await Cart.findByPk(cart.id, { include: 'items' })
            userCart = userCart.toJSON()
            const totalPrice = userCart.items.length > 0 ? userCart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
            return res.render('products', { products, cart: userCart, totalPrice })
          }
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = productController
