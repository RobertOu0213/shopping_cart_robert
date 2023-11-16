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

      if (!email || !password || confirmPassword) {
        return res.redirect("back");
      }
      if (password !== confirmPassword) {
        return res.redirect("back");
      }
      if (user) {
        return res.redirect("back");
      }
      await User.create({
        email,
        password: hash,
        role: "user",
      });
      return res.redirect("/users/login");
    } catch {
      (err) => next(err);
    }
  },
};

module.exports = userController;
