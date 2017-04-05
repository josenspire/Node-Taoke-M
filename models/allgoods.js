const mongoose = require('mongoose')
const AllGoodsSchema = require('../schemas/allGoods')
const AllGoods = mongoose.model('AllGoods', AllGoodsSchema)

module.exports = AllGoods