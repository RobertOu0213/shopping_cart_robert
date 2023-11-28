const { Product, Cart, CartItem } = require('../models')
const productController = {
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
          where: { userId: req.user.id },
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
              { userId: req.user.id },
              { where: { id: req.session.cartId } }
            )
            let userCart = await Cart.findOne({
              where: { userId: req.user.id },
              include: 'items'
            })
            userCart = userCart.toJSON()
            const totalPrice = userCart.items.length > 0 ? userCart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
            return res.render('products', { products, cart: userCart, totalPrice })
          } else {
          // 更新購物車 id
            await CartItem.update(
              { cartId: cart.id },
              { where: { cartId: req.session.cartId } }
            )

            // 顯示所有產品
            const cartItems = await CartItem.findAll({
              raw: true,
              nest: true,
              where: { cartId: cart.id }
            })
            const map = new Map()
            for (const item of cartItems) {
              if (map.get(item.productId)) {
                const cartItem = await CartItem.findByPk(map.get(item.productId))
                Promise.all([
                  cartItem.update({ quantity: cartItem.quantity + 1 }),
                  await CartItem.destroy({ where: { id: item.id } })
                ])
              } else {
                map.set(item.productId, item.id)
              }
            }
            // 刪除購物車
            if (cart.id !== req.session.cartId) {
              await Cart.destroy({ where: { id: req.session.cartId } })
            } else {
              req.session.cartId = cart.id
            }

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
