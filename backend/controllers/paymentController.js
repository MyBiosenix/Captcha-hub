const PaymentReq = require('../models/PaymentReq');

const mypayment = async (req, res) => {
  try {
    const {
      name, email, pcamount, reqamount,
      bankname, branchname, accholder, accnumber,
      paymentmode, paymentDate, paymentTime, notes
    } = req.body;

    const newRequest = await PaymentReq.create({
      user: req.user.id, // 🔑 attach user who created it
      name, email, pcamount, reqamount,
      bankname, branchname, accholder, accnumber,
      paymentmode, paymentDate, paymentTime, notes
    });

    res.status(200).json({
      message: "Payment Request Initiated",
      Payment: {
        _id: newRequest.id,
        name: newRequest.name,
        email: newRequest.email,
        pcamount: newRequest.pcamount,
        paymentmode: newRequest.paymentmode,
        paymentStatus: newRequest.paymentStatus,
        paymentDate: newRequest.paymentDate,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error creating payment request" });
  }
};


const getAllRequests = async(req,res) => {
    try{
        const payments = await PaymentReq.find().select('-__v');
        res.status(200).json(payments);
    }
    catch(err){
        res.status(400).json(err.message);
    }
}

const getUserPaymentRequests = async( req, res ) => {
    try {
    const payments = await PaymentReq.find({ user: req.user.id }) 
      .select("-__v");
    res.status(200).json(payments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deletereqs = async(req,res) => {
    try{
        const{ id } = req.params;
        await PaymentReq.findByIdAndDelete(id);
        res.status(200).json({message:"Payment Request Deleted Succesfully"});
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

module.exports = { mypayment, getAllRequests,getUserPaymentRequests, deletereqs}