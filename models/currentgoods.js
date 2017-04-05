const mongoose = require('mongoose')
const CurrentGoodsSchema = require('../schemas/currentGoods')
const CurrentGoods = mongoose.model('CurrentGoods', CurrentGoodsSchema)

module.exports = CurrentGoods