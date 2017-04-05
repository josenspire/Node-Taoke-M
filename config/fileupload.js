let multer = require('multer');
let md5 = require('md5');
let config = require('./config')

Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}

let storage = multer.diskStorage({
    //设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
    //Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
    // destination: config.upload.path,
    destination: './../xlsx/',
    //TODO:文件区分目录存放
    //给上传文件重命名
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split(".");
        // cb(null, file.fieldname + "." + fileFormat[fileFormat.length - 1]);
        cb(null, (parseInt(new Date().format("yyyyMMdd")) - 1) + "." + fileFormat[fileFormat.length - 1]);

    }
});

//添加配置文件到muler对象。
let upload = multer({
    storage: storage,
    //其他设置请参考multer的limits
    //limits:{}
});
//导出对象
module.exports = upload;