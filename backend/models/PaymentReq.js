const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    pcamount:{
        type: Number,
        required: true,
    },
    reqamount:{
        type:Number,
        required: true
    },
    bankname:{
        type: String,
        required: true
    },
    branchname:{
        type: String,
        required: true,
    },
    accholder:{
        type: String,
        required: true,
    },
    accnumber:{
        type: String,
        required: true
    },
    paymentmode:{
        type: String,
        enum: ["cash","cheque","online transfer","gpay","phonepay"]
    },
    paymentDate:{
        type: String,
        required: true
    },
    paymentTime:{
        type: String,
        required:true
    },
    notes:{
        type:String,
        default:''
    },
    paymentStatus:{
        type: String,
        enum:['Pending','Approved','Rejected']
    }
})

module.exports = mongoose.model('Payment',paymentSchema);