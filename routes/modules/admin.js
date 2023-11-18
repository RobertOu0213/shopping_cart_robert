const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin-controller");
const passport = require('../../config/passport')

router.get("/login", adminController.loginPage);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/admin/login",
    failureFlash: true,
  }),
  adminController.login
);
router.get("/products", adminController.getProducts);
router.get("/logout", adminController.logout);
router.use("/", (req, res) => res.redirect("/admin/products"));

module.exports = router;
