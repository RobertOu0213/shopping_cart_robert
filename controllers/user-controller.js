const bcrypt = require("bcryptjs");
const { User } = require("../models");

const userController = {
  loginPage: (req, res) => {
    res.render("login");
  },
  registerPage: (req, res) => {
    res.render("register");
  },
  register: async (req, res, next) => {
    try {
      const { email, password, confirmPassword } = req.body;
      const user = await User.findOne({ where: { email } });
      const salt = await bcrypt.genSaltSync(10);
      const hash = await bcrypt.hashSync(password, salt); ////密碼加密
      
      if (!email || !password || !confirmPassword) {
        req.flash("error_messages", "全部欄位都需填寫");
        return res.redirect("back");
      }
      if (password !== confirmPassword) {
        req.flash("error_messages", "密碼不相同");
        return res.redirect("back");
      }
      if (user) {
        req.flash("error_messages", "帳號註冊過了");
        return res.redirect("back");
      }

      await User.create({
        email,
        password: hash,
        role: "user",
      });
      req.flash("success_messages", "註冊成功");
      return res.redirect("/users/login");
    } catch {
      (err) => console.log(err);
    }
  },
};

module.exports = userController;
