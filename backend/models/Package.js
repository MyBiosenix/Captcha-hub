const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    packages:{
        type:String,
        required:true,
        unique:true
    }
})

module.exports = mongoose.model("Package",packageSchema);