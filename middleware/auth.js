// const passport = require("../config/passport");

// const auth = {
//   authenticatedAdmin: (req, res, next) => {
//     passport.authenticate("jwt", { session: false }, (err, user) => {
//       if (!user) {
//         console.log(err);
//         req.flash("warning_msg", "JWT驗證未通過!");
//         return res.redirect("/admin/login");
//       }
//       if (user.role !== "admin") {
//         req.flash("warning_messages", "權限不足!");
//         return res.redirect("/admin/sign-in");
//       }
//       res.locals.user = req.user;
//       res.locals.isAuthenticated = req.isAuthenticated();
//       return next();
//     })(req, res, next);
//   },
//   authenticated: (req, res, next) => {
//     passport.authenticate("jwt", { session: false }, (err, user) => {
//       if (!user) {
//         console.log(err);
//         req.flash("warning_messages", "JWT驗證未通過!");
//         return res.redirect("/users/login");
//       }
//       res.locals.user = req.user;
//       res.locals.isAuthenticated = req.isAuthenticated();
//       res.locals.token = req.session.token;
//       return next();
//     })(req, res, next);
//   },
// };

// module.exports = auth;

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'user') return next()
    req.flash('error_messages', '沒有瀏覽權限！')
    res.redirect('/users/login')
  }
  req.flash('error_messages', '請先登入使用者！')
  res.redirect('/users/login')
}

const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') return next()
    req.flash('error_messages', '沒有瀏覽權限！')
    res.redirect('/users/login')
  }
  req.flash('error_messages', '請先登入管理員！')
  res.redirect('/users/login')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
