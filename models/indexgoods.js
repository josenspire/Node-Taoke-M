var mongoose = require('mongoose')
var IndexGoodsSchema = require('../schemas/indexGoods')
var IndexGoods = mongoose.model('IndexGoods', IndexGoodsSchema)

module.exports = IndexGoods