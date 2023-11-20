const { Product } = require('../models')
const { localFileHandler } = require('../helpers/file.helpers')

const adminController = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll({ raw: true, nest: true })

      return res.render('admin/products', { products })
    } catch {
      err => console.log(err)
    }
  },
  postProducts: async (req, res) => {
    try {
      const { name, price, image, description } = req.body
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
    } catch {
      err => console.log(err)
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
      console.log(product)
      return res.render('admin/products', {
        product: product.toJSON(),
        products,
        status
      })
    } catch {
      err => console.log(err)
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
    } catch {
      err => console.log(err)
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id
      const product = await Product.findByPk(id)
      await product.destroy()
      return res.redirect('back')
    } catch {
      err => console.log(err)
    }
  },
  loginPage: (req, res) => {
    return res.render('login')
  },
  login: (req, res) => {
    req.flash('success_messages', '登入成功')
    return res.redirect('/admin/products')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/login')
  }
}
module.exports = adminController
