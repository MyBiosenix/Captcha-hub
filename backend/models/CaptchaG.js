
const mongoose = require('mongoose');

const CaptchaGSchema = new mongoose.Schema({
    text:{type:String, required:true},
    createdAt : {
        type: Date,
        default: Date.now(),
        expires: 60
    }
});

module.exports = mongoose.model("Captchaa",CaptchaGSchema);