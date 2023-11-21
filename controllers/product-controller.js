const { Product } = require('../models')
const productController = {
  getProducts: async (req, res) => {
    const products = await Product.findAll({ raw: true, nest: true })
    return res.render('products', { products })
  }
}

module.exports = productController
