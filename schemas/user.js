let mongoose = require('mongoose')
let jwt = require('jwt-simple')    //加密模块
let SECRET = 'JOSENYANG'

let UserSchema = new mongoose.Schema({
    username: {
        unique: true,
        type: String
    },
    password: String,
    pid: String,
    classify: String,
    // role < 10 menas normal user
    // role > 50 menas administrator
    role: {
        type: Number,
        default: 1
    },
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

UserSchema.pre('save', function (next) {
    let user = this

    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    //encode password
    user.password = jwt.encode(user.password, SECRET)
    next()
})

//decode password and checking
UserSchema.methods = {
    comparePassword: function (_password, cb) {
        let dpassword = jwt.decode(this.password, SECRET)
        cb(_password === dpassword)
    }
}

UserSchema.statics = {
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
    }
}

module.exports = UserSchema