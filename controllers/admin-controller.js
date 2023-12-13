const { Product, Order, User } = require('../models')
const { localFileHandler } = require('../helpers/file.helpers')

const adminController = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll({ raw: true, nest: true })

      return res.render('admin/products', { products })
    } catch (err) {
      console.log(err)
    }
  },
  postProducts: async (req, res) => {
    try {
      const { name, price, description } = req.body
      const { file } = req
      const filePath = await localFileHandler(file)
      await Product.create({
        name,
        price,
        image: filePath || null,
        description
      })
      req.flash('success_messages', '產品新增成功')
      res.redirect('/admin/products')
    } catch (err) {
      console.log(err)
    }
  },
  getProduct: async (req, res) => {
    try {
      const status = 1
      const id = req.params.id
      const [product, products] = await Promise.all([
        Product.findByPk(id),
        Product.findAll({ raw: true, nest: true })
      ])
      return res.render('admin/products', {
        product: product.toJSON(),
        products,
        status
      })
    } catch (err) {
      console.log(err)
    }
  },
  putProducts: async (req, res) => {
    try {
      const { name, price, description } = req.body
      const { file } = req
      const [product, filePath] = await Promise.all([
        Product.findByPk(req.params.id),
        localFileHandler(file)
      ])
      await product.update({
        name,
        price,
        description,
        image: filePath || product.image
      })
      req.flash('success_messages', '商品修改成功')
      res.redirect('/admin/products')
    } catch (err) {
      console.log(err)
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id
      const product = await Product.findByPk(id)
      await product.destroy()
      return res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/users/login')
  },
  getOrders: async (req, res) => {
    const orders = await Order.findAll({ raw: true, nest: true })
    return res.render('admin/orders', { orders })
  },
  getOrder: async (req, res) => {
    try {
      const id = req.params.id
      let order = await Order.findByPk(id, { include: 'orderProducts' })
      order = order.toJSON()
      return res.render('admin/order', { order })
    } catch (err) { console.log(err) }
  },
  shipOrder: async (req, res) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id)
      await order.update({ shippingStatus: '1' })
      res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id)
      await order.update({ shippingStatus: -1 })
      return res.redirect('back')
    } catch (err) { console.log(err) }
  },
  recoverOrder: async (req, res) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id)
      await order.update({ shippingStatus: 0 })
      return res.redirect('back')
    } catch (err) { console.log(err) }
  },
  getAuthority: async (req, res) => {
    try {
      const users = await User.findAll({ raw: true, nest: true })
      return res.render('admin/users', { users })
    } catch (err) { console.log(err) }
  },
  changeAuth: async (req, res) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id)
      user.role === 'admin' ? await user.update({ role: 'user' }) : await user.update({ role: 'admin' })
      return res.redirect('back')
    } catch (err) { console.log(err) }
  }
}
module.exports = adminController
