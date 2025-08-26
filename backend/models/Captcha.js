const mongoose = require('mongoose');

const CaptchaSchema = new mongoose.Schema({
    captcha:{
        type:String,
        required:true,
        unique:true
    }
})

module.exports = mongoose.model("Captcha",CaptchaSchema);