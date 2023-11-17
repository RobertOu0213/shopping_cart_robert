const adminController = {
  getProducts: (req, res) => {
    return res.render("admin/products");
  },
  loginPage: (req, res) => {
    return res.render('login')
  }
};
module.exports = adminController;
