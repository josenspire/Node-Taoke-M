let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let mongoose = require('mongoose')
let session = require('express-session')
let MongoStore = require('connect-mongo')(session)    //session 持久化

let dbUrl = 'mongodb://taoke:taokeadmin@118.89.17.132:27017/taoke'
mongoose.connect(dbUrl)

let routes = require('./routes/index')
let admin = require('./routes/admin')
let users = require('./routes/users')
let taoke = require('./routes/taoke')

let app = express();

//跨域设置
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DEvarE,OPTIONS")
  res.header("X-Powered-By", ' 3.2.1')
  // res.header("Content-Type", "application/json;charset=utf-8")
  next()
})

let randomString = len => {
  len = len || 32;
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
app.use(session({
  secret: randomString(32), //secret的值建议使用随机字符串
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 1000 * 30 }, // 过期时间（毫秒）
  store: new MongoStore({     //持久化
    url: dbUrl,
    collection: 'dbsession'
  })
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  let _user = req.session.user
  res.locals.user = _user
  next()
})

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/admin', admin);
app.use('/users', users);
app.use('/taoke', taoke);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 400
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('400', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('400', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
