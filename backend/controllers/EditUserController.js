const User = require('../models/User');

const EditUser = async(req,res) => {
    try{
        const AllUsers = await User.find()
            .select('-__v -password')
            .populate({ path: 'package', select: 'packages' }); 
        res.status(200).json(AllUsers);
    }
    catch(err){
        console.error(err.message);
        res.status(400).json({message: err.message})
    }
};

const updateCaptchaSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { captchaLength, captchaDifficulty, sleepTime } = req.body;

    if (captchaLength < 4 || captchaLength > 10) {
      return res.status(400).json({ message: "Captcha length must be between 4 and 10" });
    }

    if (captchaDifficulty < 0 || captchaDifficulty > 10) {
      return res.status(400).json({ message: "Captcha difficulty must be between 0 and 10" });
    }

    if (sleepTime < 0) {
      return res.status(400).json({ message: "Sleep time must be 0 or more" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        captchaLength,
        captchaDifficulty,
        sleepTime,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Captcha settings updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating captcha settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { EditUser, updateCaptchaSettings }