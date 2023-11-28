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
