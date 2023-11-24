const { Cart, Order, OrderItem } = require('../models')

const orderController = {
  fillOrder: async (req, res) => {
    try {
      const UserId = req.user.id
      let cart = await Cart.findOne({ where: { UserId }, include: 'items' })
      cart = cart.toJSON()
      // if (!cart || !cart.items.length) {
      //   req.flash('warning_messsags', '購物車是空的!')
      //   return res.redirect('/cart')
      // }
      const cartId = cart.id
      const amount = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0

      res.render('orderInfo', { cartId, amount })
    } catch (err) {
      console.log(err)
    }
  },
  postOrder: async (req, res) => {
    try {
      const { cartId } = req.body
      const cart = await Cart.findByPk(cartId, { include: 'items' })

      // 建立訂單
      let order = await Order.create({
        ...req.body,
        UserId: req.user.id
      })
      console.log(order)
      order = order.toJSON()

      const items = Array.from({ length: cart.items.length })
        .map((_, i) => (
          OrderItem.create({
            OrderId: order.id,
            ProductId: cart.items[i].dataValues.id,
            price: cart.items[i].dataValues.price,
            quantity: cart.items[i].CartItem.dataValues.quantity
          })
        ))

      await Promise.all(items)

      await cart.destroy()
      req.session.cartId = ''
      return res.redirect(`/order/${order.id}`)
    } catch (err) {
      console.log(err)
    }
  },
  getOrder: async (req, res) => {
    try {
      const id = req.params.id
      let order = await Order.findByPk(id, { include: 'orderProducts' })
      order = order.toJSON()
      if (order.paymentStatus === '0') {
        res.render('order', { order })
      } else {
        const paidOrder = true
        res.render('order', { order, paidOrder })
      }
    } catch (err) {
      console.log(err)
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id)
      await order.update({
        ...req.body,
        shippingStatus: '-1',
        paymentStatus: '-1'
      })
      req.flash('success_messages', '成功取消訂單')
      return res.redirect('back')
    } catch (err) { console.log(err) }
  }
}

module.exports = orderController
