let express = require('express');
let jwt = require('jwt-simple')    //加密模块
let router = express.Router();
let fs = require('fs')
let User = require('../models/user')
let SECRET = 'JOSENYANG'

router.get('/signin', (req, res, next) => {
  res.render('signin', {
    title: '用户登录'
  })
})

router.get('/signup', (req, res, next) => {
  res.render('signup', {
    title: '用户注册'
  })
})

// user signup
router.post('/userSignup', (req, res, next) => {
  let result = ''
  let _user = {}
  _user.username = req.body.username || ''
  _user.classify = req.body.classify || ''
  _user.password = req.body.password || ''
  _user.confirm = req.body.confirm || ''
  _user.pid = req.body.pid || ''
  _user.group = req.body.group || ''
  _user.preferrerid = req.body.referrer || ''

  console.log(_user)
  if (_user.username == '' || _user.password == '' || _user.pid == '') {
    return res.json({
      status: 'ERROR',
      message: 'INPUT_INFO_INVALID'
    })
  } else if (_user.password != _user.confirm) {
    return res.json({
      status: 'ERROR',
      message: 'PASSWORD_EQUAL_INVALID'
    })
  } else if (_user.password.length < 6 || _user.password.length > 16) {
    return res.json({
      status: 'ERROR',
      message: 'PARAMS_LENGTH_INVALID'
    })
  } else {
    User.findOne({ username: _user.username }, (err, user) => {
      if (err) {
        console.log(err)
        return res.json({
          status: 'ERROR',
          message: 'SERVER_UNKNOW_ERROR'
        })
      } else if (user) {
        return res.json({
          status: 'ERROR',
          message: 'USERNAME_EXIST_INVALID'
        })
      } else {
        let user = new User(_user)
        user.save((err, user) => {
          if (err) {
            return res.json({
              status: 'ERROR',
              message: 'SERVER_UNKNOW_ERROR'
            })
          } else {
            return res.json({
              status: 'SUCCESS',
              message: ''
            })
          }
        })
      }
    })
  }
})

// user signin
router.post('/userSignin', (req, res, next) => {
  let result = ''
  let username = req.body.username
  let password = req.body.password

  console.log(username, password)
  
  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return res.json({
        status: 'ERROR',
        message: 'SERVER_UNKNOW_ERROR'
      })
    } else if (!user) {
      return res.json({
        status: 'ERROR',
        message: 'USER_USERNAME_UNEXIST'
      })
    } else if (!err && user) {
      user.comparePassword(password, (isMatch) => {   //password check correct
        if (isMatch) {
          req.session.user = user
          console.log('Login success..')
          console.log(user)
          return res.json({
            status: 'SUCCESS',
            user: user,
            message: ''
          })
        } else {
          return res.json({
            status: 'ERROR',
            message: 'USER_PASSWORD_INCORRECT'
          })
        }
      })
    }
  })
})

// user logout
router.get('/logout', (req, res) => {
  delete req.session.user

  res.redirect('/')
})

// user statement
router.get('/statement', (req, res, next) => {
  res.render('statement', {
    title: '报表中心'
  })
})

router.get('/statement/show', (req, res, next) => {

  let username = req.session.user.username
  console.log(req.session.user)

  let filename = req.query.filename

  console.log('Current filename is: ', filename)

  fs.readFile('./../parseXlsx/' + filename + '.json', (err, data) => {
    if (err) {
      console.log('Read file ' + err)
      return res.json({
        status: 'ERROR',
        message: 'READ_FILE_ERROR'
      })
    } else {
      let items = JSON.parse(data)

      let dataList = []
      dataList = items.filter(ele => {
        return ele.advName == username
      })

      if (dataList) {
        return res.json({
          status: 'SUCCESS',
          data: dataList
        })
      } else {
        return res.json({
          status: 'ERROR',
          message: 'GET_STATEMENT_ERROR'
        })
      }
    }
  })
})
module.exports = router;
