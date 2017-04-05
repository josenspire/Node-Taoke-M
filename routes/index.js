let express = require('express');
let superagent = require('superagent')
let request = require('request')
let fs = require('fs')
let schedule = require('node-schedule')

let User = require('../models/user')
let IndexGoods = require('../models/indexgoods')
let TopGoods = require('../models/topgoods')
let CurrentGoods = require('../models/currentgoods')
let AllGoods = require('../models/allgoods')

const TopClient = require('../lib/api/topClient.js').TopClient

let router = express.Router()

let client = new TopClient({
    'appkey': '23557591',
    'appsecret': '62ced26b067b4a5daabbbe85d03eb79e',
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
})

// set time to get all goods data
let rule = new schedule.RecurrenceRule()
rule.hour = 2
rule.minute = 10
let j = schedule.scheduleJob(rule, function () {
    allGoods()	//获取数据
})

// set time to get index goods data
let rule2 = new schedule.RecurrenceRule()
rule2.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
let k = schedule.scheduleJob(rule2, function () {
    indexGoods()
    topGoods()
    currentGoods()
})

const url = 'http://api.dataoke.com/index.php?r=Port/index&type=total&appkey=blolkvzgun&v=2&page='
const topUrl = 'http://api.dataoke.com/index.php?r=Port/index&type=top100&appkey=blolkvzgun&v=xxx'
const currentUrl = 'http://api.dataoke.com/index.php?r=Port/index&type=paoliang&appkey=blolkvzgun&v=2'

/* GET home page. */
router.get('/', (req, res, next) => {
    let page = parseInt(req.query.page) || 1
    // if (page < 10) {
    IndexGoods.find({}, (err, data) => {
        if (err) {
            return res.json({
                status: 'ERROR',
                message: 'GET_INDEXGOODS_FALI'
            })
        } else {
            res.render('index', {
                title: '小熊优惠购',
                data: data,
                page: page
            })
        }
    }).limit(20).skip((page - 1) * 20)
    // }
    // } else {
    //     superagent.get(url + page)     //CNode community
    //         .end((err, resc) => {
    //             if (err) {
    //                 next(err)
    //             } else {
    //                 let value = JSON.parse(resc.text).result
    //                 res.render('index', {
    //                     title: '小熊优惠购',
    //                     data: value.slice(page, ),
    //                     page: page
    //                 })
    //             }
    //         })
    // }
})

router.get('/topGoods', (req, res, next) => {
    let page = parseInt(req.query.page) || 1
    TopGoods.find({}, (err, data) => {
        if (err) {
            return res.json({
                status: 'ERROR',
                message: 'GET_TOPGOODS_FALI'
            })
        } else {
            res.render('topGoods', {
                title: '小熊优惠购-Top精选',
                data: data,
                page: page
            })
        }
    }).limit(20).skip((page - 1) * 20)
})

router.get('/currentGoods', (req, res, next) => {
    let page = parseInt(req.query.page) || 1
    CurrentGoods.find({}, (err, data) => {
        if (err) {
            return res.json({
                status: 'ERROR',
                message: 'GET_CURRENTGOODS_FALI'
            })
        } else {
            res.render('currentGoods', {
                title: '小熊优惠购-实时跑量榜',
                data: data,
                page: page
            })
        }
    }).limit(20).skip((page - 1) * 20)
})

// 更新 Index 数据
router.get('/updateIndex', (req, res, next) => {
    indexGoods()
    return res.json({
        status: 'success',
        message: '操作成功'
    })
})

// 更新 Top 数据
router.get('/updateTopGoods', (req, res, next) => {
    topGoods()
    return res.json({
        status: 'success',
        message: '操作成功'
    })
})

// 更新实时跑量版数据
router.get('/updateCurrentGoods', (req, res, next) => {
    currentGoods()
    return res.json({
        status: 'success',
        message: '操作成功'
    })
})

// 更新 All 数据
router.get('/updateAllGoods', (req, res, next) => {
    allGoods()
    return res.json({
        status: 'success',
        message: '操作成功'
    })
})

const indexGoods = () => {
    updateGoods(IndexGoods, url, 1)
}

const topGoods = () => {
    updateGoods(TopGoods, topUrl, 1)
}

const currentGoods = () => {
    updateGoods(CurrentGoods, currentUrl, 1)
}

const allGoods = () => {
    totalPage()
        .then(total => {
            updateGoods(AllGoods, url, total)
        })
}

// 数据更新 @params: Model, url, page number
const updateGoods = (model, url, times) => {
    let urlArr = []
    for (let k = 1; k <= times; k++) {
        urlArr.push(url + k)
    }

    const goodsList = urlArr.map(url => {
        console.log(url)
        return getGoods(url)
    })

    Promise.all([...goodsList])
        .then(result => {
            let goodsList = []
            console.time('startTime')
            result.forEach(ele => {
                goodsList = goodsList.concat(ele)
            })

            model.remove({}, (err) => {
                if (err) {
                    console.log('Remove data error.')
                } else {
                    model.create(goodsList, (err, data) => {
                        if (err) {
                            console.log('Save data error.')
                        } else {
                            console.log('Update data success.')
                        }
                    })
                }
            })
            console.timeEnd('startTime')
        })
        .catch(e => {
            console.log(e)
        })
}

// api request
let getGoods = url => {
    return new Promise((resolve, reject) => {
        superagent.get(url)     //CNode community
            .end((err, rese) => {
                if (err) {
                    reject([])
                } else {
                    let data = JSON.parse(rese.text).result
                    resolve(data)
                }
            })
    })
}

// Promise 获取总页数
const totalPage = () => {
    // 获取总产品数
    return new Promise((resolve, reject) => {
        request(url + '1', (err, response, body) => {
            if (err) {
                console.log('Get goods count request error..')
                reject(err)
            } else {
                let total_num = JSON.parse(body).data.total_num
                console.log('total num is: ', total_num)
                let allPage = (total_num % 200) == 0 ? parseInt(total_num / 200) : parseInt(total_num / 200 + 1)
                resolve(parseInt(allPage))
            }
        })
    })
}

// goods search
router.get('/search', (req, res, next) => {
    let page = req.query.page || 1
    let content = req.query.content + ""
    content = content.trim()

    AllGoods.find({ Title: new RegExp(content) }, (err, data) => {
        if (err) {
            res.render('400', {
                title: '小熊优惠购',
                message: '服务器开小差啦，请稍后重试'
            })
        } else {
            if (data) {
                data = data.slice(0, 200)
                res.render('search', {
                    title: '小熊优惠购',
                    data: data,
                    total: data.length,
                    content: content,
                    page: page
                })
            }
        }
    })

})


router.get('/detail', (req, res, next) => {
    let GoodsId = req.query.goodsid || ''

    console.log(GoodsId)

    Promise.all([getDetail(GoodsId), getPics(GoodsId)])
        .then(result => {
            let data = {}
            data.detail = result[0] || ''
            data.pics = result[1] || ''

            return res.render('detail', {
                status: 'SUCCESS',
                data: data
            })
        })
        .catch(e => {
            console.log(e)
            res.render('400')
        })
})

// Get goods picture from taobao api
const getPics = GoodsId => {
    return new Promise((resovle, reject) => {
        client.execute('taobao.tbk.item.info.get', {
            'fields': 'num_iid,title,pict_url,small_images,reserve_price,zk_final_price,user_type,provcity,item_url',
            'platform': '1',
            'num_iids': GoodsId
        }, (error, response) => {
            if (!error) {
                try {
                    resovle(response.results.n_tbk_item[0].small_images.string)
                } catch (e) {
                    reject('TB_UNFOUND')
                }
            } else {
                console.log(error)
                reject('TB_API_ERROR')
            }
        })
    })
}

const getDetail = GoodsId => {
    let url = 'http://api.dataoke.com/index.php?r=port/index&appkey=blolkvzgun&v=xxx&id='
    return new Promise((resolve, reject) => {
        superagent.get(url + GoodsId)     //CNode community
            .end((err, rese) => {
                if (err) {
                    reject('ERROR')
                } else {
                    const value = JSON.parse(rese.text).result
                    resolve(value)
                }
            })
    })
}

module.exports = router
