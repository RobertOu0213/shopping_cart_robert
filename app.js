if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const PORT = process.env.PORT
const routes = require('./routes')
const exphbs = require('express-handlebars')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')

app.engine(
  'handlebars',
  exphbs.engine({ helpers: require('./helpers/handlebars-helpers') })
)
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, 'public')))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 error_msg 訊息
  res.locals.warning_messages = req.flash('warning_messages') // 設定 warning_msg 訊息
  res.locals.user = req.user
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`express is listening on PORT ${PORT}`)
})
