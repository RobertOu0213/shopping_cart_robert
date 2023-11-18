const { Product } = require("../models");
const { localFileHandler } = require("../helpers/file.helpers");

const adminController = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll({ raw: true, nest: true });
      return res.render("admin/products", { products });
    } catch {
      (err) => console.log(err);
    }
  },
  createProducts: async (req, res) => {
    try {
      const { name, price, image, description } = req.body;
      const { file } = req;
      const filePath = await localFileHandler(file);
      await Product.create({
        name,
        price,
        image: filePath || null,
        description,
      });
      req.flash("success_messages", "產品新增成功");
      res.redirect("/admin/products");
    } catch {
      (err) => console.log(err);
    }
  },
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
