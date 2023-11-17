const passport = require("../config/passport");

const auth = {
  authenticatedAdmin: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
      if (!user) {
        console.log(err);
        req.flash("warning_msg", "JWT驗證未通過!");
        return res.redirect("/admin/login");
      }
      if (user.role !== "admin") {
        req.flash("warning_messages", "權限不足!");
        return res.redirect("/admin/sign-in");
      }
      res.locals.user = req.user;
      res.locals.isAuthenticated = req.isAuthenticated();
      return next();
    })(req, res, next);
  },
  authenticated: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
      if (!user) {
        console.log(err);
        req.flash("warning_messages", "JWT驗證未通過!");
        return res.redirect("/users/login");
      }
      res.locals.user = req.user;
      res.locals.isAuthenticated = req.isAuthenticated();
      res.locals.token = req.session.token;
      return next();
    })(req, res, next);
  },
};

module.exports = auth;
