const { Cart, Order, OrderItem } = require('../models')

const orderController = {
  fillOrder: async (req, res) => {
    try {
      const userId = req.user.id
      const cart = await Cart.findOne({ where: { userId }, include: 'items' })
      if (!cart || !cart.items.length) {
        req.flash('warning_messages', '購物車是空的!')
        return res.redirect('/cart')
      }
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
        userId: req.user.id
      })
      console.log(order)
      order = order.toJSON()

      const items = Array.from({ length: cart.items.length })
        .map((_, i) => (
          OrderItem.create({
            orderId: order.id,
            productId: cart.items[i].dataValues.id,
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
  },
  getOrders: async (req, res) => {
    try {
      const ordersHavingProducts = await Order.findAll({
        raw: true,
        nest: true,
        where: { userId: req.user.id },
        include: 'orderProducts'
      })

      const orders = await Order.findAll({ where: { userId: req.user.id }, raw: true, nest: true })
      orders.forEach(order => { order.items = [] })

      ordersHavingProducts.forEach(product => {
        const index = orders.findIndex(order => order.id === product.id)
        if (index === -1) return
        orders[index].items.push(product.orderProducts)
      })

      res.render('orders', { orders })
    } catch (err) {
      console.log(err)
    }
  }
}
module.exports = orderController
