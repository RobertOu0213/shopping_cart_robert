const { Cart, Order, OrderItem, Payment } = require('../models')
const mpgData = require('../utils/mpgData')

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
      const amount =
        cart.items.length > 0
          ? cart.items
            .map(d => d.price * d.CartItem.quantity)
            .reduce((a, b) => a + b)
          : 0

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
      order = order.toJSON()
      const items = Array.from({ length: cart.items.length }).map((_, i) =>
        OrderItem.create({
          orderId: order.id,
          productId: cart.items[i].dataValues.id,
          price: cart.items[i].dataValues.price,
          quantity: cart.items[i].CartItem.dataValues.quantity
        })
      )

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
      const order = await Order.findByPk(id, { include: 'orderProducts' })
      if (order.toJSON().paymentStatus === '0') {
        const tradeData = mpgData.getData(
          order.amount,
          'PLUS-FOOD',
          req.user.email
        )
        await order.update({ sn: tradeData.MerchantOrderNo.toString() })
        return res.render('order', { order: order.toJSON(), tradeData })
      } else {
        const paidOrder = true
        return res.render('order', { order: order.toJSON(), paidOrder })
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
    } catch (err) {
      console.log(err)
    }
  },
  getOrders: async (req, res) => {
    try {
      const ordersHavingProducts = await Order.findAll({
        raw: true,
        nest: true,
        where: { userId: req.user.id },
        include: 'orderProducts'
      })

      const orders = await Order.findAll({
        where: { userId: req.user.id },
        raw: true,
        nest: true
      })
      orders.forEach(order => {
        order.items = []
      })

      ordersHavingProducts.forEach(product => {
        const index = orders.findIndex(order => order.id === product.id)
        if (index === -1) return
        orders[index].items.push(product.orderProducts)
      })

      res.render('orders', { orders })
    } catch (err) {
      console.log(err)
    }
  },
  newebpayCallback: async (req, res) => {
    try {
      const data = JSON.parse(mpgData.decryptData(req.body.TradeInfo))
      // 訂單
      const order = await Order.findOne({
        where: { sn: data.Result.MerchantOrderNo }
      })

      if (data.Status === 'SUCCESS') {
        // 建立 payment
        await Payment.create({
          orderId: order.id,
          payment_method: data.Result.PaymentMethod
            ? data.Result.PaymentMethod
            : data.Result.PaymentType,
          isSuccess: true,
          message: data.Message,
          paidAt: data.Result.PayTime
        })
        await order.update({
          ...req.body,
          paymentStatus: '1'
        })
        req.flash('success_messages', `訂單編號:${order.id} 付款成功!`)
      } else {
        req.flash(
          'warning_messages',
          `訂單編號:${order.id} 付款失敗!  [說明] ${data.Message}`
        )
      }
      return res.redirect(`/order/${order.id}`)
    } catch (err) {
      console.log(err)
    }
  }
}
module.exports = orderController
