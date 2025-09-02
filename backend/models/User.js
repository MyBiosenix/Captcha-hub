const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type:String,
        required:true,
        trim:true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Admin',
        required: true
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    paymentmode: {
        type: String,
        enum: ['cash','cheque','online','gpay','phonepe'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    password: { 
        type: String, 
        required: true 
    },
    totalCaptcha: {
        type: Number,
        default: 0
    },
    rightCaptcha: {
        type: Number,
        default: 0
    },
    wrongCaptcha: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    captchaLength: {
        type: Number,
        default: 6,
        min: 4,
        max: 10
    },
    captchaDifficulty: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    sleepTime: {
        type: Number,
        default: 0
    },
    difficultyMode: {
        type: String,
        enum: ["auto", "manual"],
        default: "auto"
    },
    validTill: {
        type: Date,
        required: true
    },
    activeToken: {
        type: String,
        default: null,
    }
});

module.exports = mongoose.model('User', userSchema);
