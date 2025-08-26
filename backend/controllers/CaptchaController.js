const Captcha = require('../models/Captcha');

const captchatype = async(req,res) => {
    try{
        const {captcha} = req.body;

        const existing = await Captcha.findOne({captcha});
        if(existing){
            return res.status(400).json({message:"Captcha Type Already Exists"});
        }
        const newCaptcha = await Captcha.create({
            captcha
        });
        res.status(200).json({
            message:"Captcha Type Succesfully Created",
            captcha:{
                _id:newCaptcha.id
            }
        });
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

const getAllCaptchas = async(req,res) => {
    try{
        const captchas = await Captcha.find().select('-__v');
        res.status(200).json(captchas);
    }
    catch(err){
        console.error(err.message);
    }
};

const deleteCaptcha = async(req,res) => {
    try{
        const{ id } = req.params;
        await Captcha.findByIdAndDelete(id);
        res.status(200).json({message:"Captcha Deleted Succesfully"});
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

const editCaptcha = async (req, res) => {
  try {
    const { id } = req.params;
    const { captcha } = req.body;

    if (!captcha) {
      return res.status(400).json({ message: "Captcha is required" });
    }

    const captchaDoc = await Captcha.findById(id);
    if (!captchaDoc) {
      return res.status(404).json({ message: "Captcha not found" });
    }

    const existingCaptcha = await Captcha.findOne({ captcha, _id: { $ne: id } });
    if (existingCaptcha) {
      return res.status(400).json({ message: 'Captcha Type already exists' });
    }

    captchaDoc.captcha = captcha;
    await captchaDoc.save();

    res.json({ message: 'Captcha updated successfully', captcha: captchaDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

module.exports = {captchatype, getAllCaptchas, deleteCaptcha, editCaptcha}