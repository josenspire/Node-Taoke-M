let express = require('express');
let superagent = require('superagent')
let fs = require('fs')
let schedule = require('node-schedule')
let router = express.Router()

const AllGoods = require('./../models/allgoods')

// goods detail
let hostUrl = 'http://api.dataoke.com/index.php?r=port/index&appkey=blolkvzgun&v=xxx&id='
router.get('/detail', (req, res, next) => {
    let goodsId = req.query.goodsid || ''
    console.log(goodsId)
    if (!goodsId) {
        return res.json({
            title: '小熊优惠购'
        })
    } else {
        superagent.get(hostUrl + goodsId)     //CNode community
            .end((err, rese) => {
                console.log(JSON.parse(rese.text).result)
                if (err) {
                    return res.redirect('./../views/400.ejs')
                } else {
                    let value = JSON.parse(rese.text).result
                    if (value) {
                        res.render('detail', {
                            title: '小熊优惠购',
                            detail: value
                        })
                    } else {
                        return res.render('400')
                    }
                }
            })

        // AllGoods.findOne({ GoodsID: goodsId }, (err, data) => {
        //     if(err) {
        //         return res.render('error', {
        //             title: '小熊优惠购',
        //             message: '这个产品似乎下架啦，请试试其他产品哦！'
        //         })
        //     } else if(data){
        //         return res.render('detail', {
        //             title: '小熊优惠购',
        //             detail: data
        //         })
        //     } else if(!data) {
        //         return res.render('400')
        //     }
        // })
    }
})
router.get('/detailb', (req, res, next) => {
    let value = {}

    value.GoodsID = req.query.goodsid
    value.Pic = req.query.pic
    // value.Commission = req.query.commission
    value.D_title = req.query.title
    value.Jihua_link = req.query.jihua_link
    value.Org_Price = req.query.org_price
    value.Quan_price = req.query.quan_price
    value.Price = req.query.price
    value.Quan_id = req.query.quan_id
    value.Quan_m_link = req.query.quan_link
    console.log(value)
    return res.render('detail', {
        title: 'Bear Detail',
        detail: value,
    })

})


// create taokouling
let message = ''
let JsonObj
let num = 0
router.post('/tkl', (req, res, next) => {
    if (!JsonObj) {
        JsonObj = JSON.parse(fs.readFileSync('../json/account.json'))
    }
    console.log(req.session.user)
    if (!req.session.user) {
        return res.json({
            status: 'ERROR',
            message: 'USER_UN_LOGIN'
        })
    } else {
        let pid = req.session.user.pid
        let goodsid = req.body.GoodsID
        let quanid = req.body.Quan_id
        let Jihua_link = req.body.Jihua_link
        if (!goodsid || !quanid) {
            return res.status(400).redirect('./error.ejs')
        }
        console.log('pid  ', pid)
        console.log('goodsid  ', goodsid)
        console.log('quanid  ', quanid)
        console.log('Jihua_link  ', Jihua_link)

        let account = JsonObj.users[num]

        let user_name = account.user_name
        let user_pass = account.user_pass

        let loginUrl = 'http://tool.chaozhi.hk/api/wx/wx-login.php'
        let getDetail = 'http://tool.chaozhi.hk/api/tb2/GetItemDetail_num_iid.php?num_iids=' + goodsid
        let getTkl = 'http://tool.chaozhi.hk/api/tb/GetTkl_wx.php'
        let cookieValue = 'PHPSESSID=7undv7430307043ib3ij6sv6l3; CNZZDATA1255591768=1576632938-1477230947-%7C1478605042'
        superagent.post(loginUrl)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Cookie', cookieValue)
            .send({
                user_name: user_name,
                user_pass: user_pass
            })
            .end((err, resc) => {
                if (err) {
                    next(err)
                    console.log('login fail.')
                } else {
                    console.log('Login success.')
                    console.log('the login account already have ' + JSON.parse(resc.text).times + ' times')

                    superagent.get(getDetail)
                        .set('Content-Type', 'application/x-www-form-urlencoded')
                        .set('Cookie', cookieValue)
                        .end((err, resc) => {
                            if (err) {
                                return res.json({
                                    status: 'ERROR',
                                    message: 'SERVER_UNKNOW_ERROR'
                                })
                            } else {
                                let detail = JSON.parse(resc.text).data

                                if (!detail.item_info) {
                                    return res.json({
                                        status: 'ERROR',
                                        message: 'GET_GOODS_DETAIL_ERROR'
                                    })
                                }
                                var logo = detail.item_info.pics.string[0]
                                var title = detail.item_info.title
                                var urlDx = ''

                                if (Jihua_link.trim() != null && Jihua_link.trim() != "") { // 定向
                                    urlDx = 'http://uland.taobao.com/coupon/edetail?activityId=' + quanid + '&itemId=' + goodsid + '&pid=' + pid + '&src=czhk_cztkl&dx=1'
                                    console.log('定向计划')
                                } else {    // 非定向
                                    urlDx = 'http://uland.taobao.com/coupon/edetail?activityId=' + quanid + '&itemId=' + goodsid + '&pid=' + pid + '&src=czhk_cztkl'
                                    console.log('非定向')
                                }
                                superagent.post(getTkl)
                                    .set('Content-Type', 'application/x-www-form-urlencoded')
                                    .set('Cookie', cookieValue)
                                    .send({
                                        text: title,
                                        url: urlDx,
                                        logo: logo,
                                        action: 'refresh'
                                    })
                                    .end((err, rescs) => {
                                        if (err) {
                                            return next(err)
                                        } else {
                                            console.log(rescs.text)
                                            let result = JSON.parse(rescs.text)
                                            let times = parseInt(result.refresh)
                                            if (times <= 20) {
                                                console.log('This current account is also have ' + times + 'times.')
                                                return res.json({
                                                    status: 'ERROR',
                                                    message: 'TKL_TIMES_OUT'
                                                })
                                            }
                                            return res.json({
                                                status: 'SUCCESS',
                                                data: result
                                            })
                                        }
                                    })
                            }
                        })
                }
            })
    }
})

module.exports = router;
