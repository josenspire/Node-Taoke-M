let express = require('express');
let jwt = require('jwt-simple')    //加密模块
let User = require('../models/user')
let router = express.Router()
let SECRET = 'JOSENYANG'

router.get('/adminSignin', (req, res, next) => {
    res.render('adminLogin', {
        title: 'AdminSigin'
    })
})

// admin required middleware
router.use((req, res, next) => {
    if (!req.session.user) {
        return res.redirect('./../users/signin')
    } else if (!req.session.user.role || req.session.user.role < 50) {
        return res.redirect('./../admin/adminSignin')
    }
    next()
})

// get users list
router.get('/', (req, res, next) => {
    User.find((err, user) => {
        if (err) {
            console.log(err)
        } else {
            let users = []
            users = user.forEach(ele => {
                return ele.password = jwt.decode(ele.password, SECRET)
            })
            users = user.filter(ele => {
                return ele.username != 'admin'
            })
            res.render('admin', {
                title: '管理员中心',
                data: users
            })
        }
    })
})

// get users detail information
router.get('/information', (req, res, next) => {
    let id = req.query._id

    if (!id) {
        return res.render('400', {
            title: '参数错误'
        })
    } else {
        User.findOne({ _id: id }, (err, user) => {
            if (err) {
                console.log(err)
            } else {
                user.password = jwt.decode(user.password, SECRET)
                return res.json({
                    title: '管理员中心',
                    data: user
                })
            }
        })
    }
})

// users information modify
router.post('/modify', (req, res, next) => {
    let data = req.body

    if (!data) {
        return res.render('400', {
            title: '参数错误'
        })
    } else {
        User.update({ username: data.username },
            {
                $set: {
                    username: data.username,
                    password: jwt.encode(data.password, SECRET),
                    pid: data.pid,
                    classify: data.classify
                }
            }, (err, data) => {
                if (err) {
                    return res.json({
                        message: 'UNKNOW_ERROR'
                    })
                }
                else {
                    return res.json({
                        message: 'SUCCESS'
                    })
                }
            })
    }
})

// get users detail information
router.get('/del', (req, res, next) => {
    let username = req.query.username

    if (!username) {
        return res.render('400', {
            title: '参数错误'
        })
    } else {
        User.remove({ username: username }, (err) => {
            if (err) {
                res.json({
                    message: 'DELETE_USER_ERROR'
                })
            } else {
                res.json({
                    message: 'SUCCESS'
                })
            }
        })
    }
})

module.exports = router;
