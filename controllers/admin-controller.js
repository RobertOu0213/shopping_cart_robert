const { Product } = require("../models");

const adminController = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll({ raw: true, nest: true });
      return res.render("admin/products", { products });
    } catch {
      (err) => console.log(err);
    }
  },
  createProducts: (req, res) => {},
  loginPage: (req, res) => {
    return res.render("login");
  },
  login: (req, res) => {
    req.flash("success_messages", "登入成功");
    return res.redirect("/admin/products");
  },
  logout: (req, res) => {
    req.flash("success_messages", "登出成功！");
    req.logout();
    res.redirect("/admin/login");
  },
};
module.exports = adminController;
