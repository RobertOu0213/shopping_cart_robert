const { product } = require("db");

const adminController = {
  getProducts: (req, res) => {
    return res.render("admin/products");
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
