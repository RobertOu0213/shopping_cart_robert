const bcrypt = require('bcryptjs')
const { User } = require('../models')
const jwt = require('jsonwebtoken')

const userController = {
  loginPage: (req, res) => {
    const front = true
    return res.render('login', { front })
  },
  login: async (req, res) => {
    try {
      // const { email, password } = req.body;
      // const user = await User.findOne({ where: { email } });
      // const hashPassword = await bcrypt.compare(password, user.password);
      // if (!user) {
      //   req.flash("warning_messages", "信箱錯誤");
      //   return res.redirect("/users/login");
      // }
      // if (!hashPassword) {
      //   req.flash("warning_messages", "密碼錯誤");
      //   return res.redirect("/users/login");
      // }

      // //token
      // const payload = { id: user.id };
      // const expiresIn = { expiresIn: "24h" };
      // const token = jwt.sign(payload, process.env.JWT_SECRET, expiresIn);
      // // 存入 session
      // req.session.email = email;
      // req.session.token = token;

      req.flash('success_messages', '登入成功')
      return res.redirect('/products')
    } catch {
      err => console.log(err)
    }
  },
  registerPage: (req, res) => { res.render('register') },
  register: async (req, res, next) => {
    try {
      const { email, password, confirmPassword } = req.body
      const user = await User.findOne({ where: { email } })
      const salt = await bcrypt.genSaltSync(10)
      const hash = await bcrypt.hashSync(password, salt) /// /密碼加密

      if (!email || !password || !confirmPassword) {
        req.flash('error_messages', '全部欄位都需填寫')
        return res.redirect('back')
      }
      if (password !== confirmPassword) {
        req.flash('error_messages', '密碼不相同')
        return res.redirect('back')
      }
      if (user) {
        req.flash('error_messages', '帳號註冊過了')
        return res.redirect('back')
      }

      await User.create({
        email,
        password: hash,
        role: 'user'
      })
      req.flash('success_messages', '註冊成功')
      return res.redirect('/users/login')
    } catch {
      err => console.log(err)
    }
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/users/login')
  }
}

module.exports = userController
