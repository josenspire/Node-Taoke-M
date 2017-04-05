var mongoose = require('mongoose')
var TopGoodsSchema = require('../schemas/topGoods')
var TopGoods = mongoose.model('TopGoods', TopGoodsSchema)

module.exports = TopGoods