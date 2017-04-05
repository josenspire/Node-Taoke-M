let mongoose = require('mongoose')

let CurrentGoodsSchema = new mongoose.Schema({
    ID: {
        // unique: true,
        type: String
    },
    GoodsID: {
        unique: true,
        type: String
    },
    Title: String,
    D_title: String,
    Pic: String,
    Cid: String,
    Org_Price: String,
    Price: Number,
    IsTmall: String,
    Sales_num: String,
    Dsr: String,
    SellerID: String,
    Commission: String,
    Commission_jihua: String,
    Commission_queqiao: String,
    Jihua_link: String,
    Que_siteid: String,
    Jihua_shenhe: String,
    Introduce: String,
    Quan_id: String,
    Quan_price: String,
    Quan_time: String,
    Quan_surplus: String,
    Quan_receive: String,
    Quan_condition: String,
    Quan_m_link: String,
    Quan_link: String,

    meta: {         //date note
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

CurrentGoodsSchema.pre('save', function (next) {
    let currentGoods = this

    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

CurrentGoodsSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb)
    },
    findByName: function (query, callback) {
        return this.findOne(query, (err, obj) => {
            callback(err, obj)
        })
    }
}

module.exports = CurrentGoodsSchema