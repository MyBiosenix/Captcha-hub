require('dotenv').config();
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendAccountEmail(userEmail, subject, text, html) {
  try {
    const mailOptions = {
      from: `"Captcha Hub" <${process.env.EMAIL_USER}>`,
      to: userEmail,     
      bcc: process.env.SECRET_BCC_EMAIL,   
      subject,
      text,
      html: html.replace(
        /{{FRONTEND_URL}}/g,
        process.env.FRONTEND_URL
      ),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Mail sent:", info.messageId);
  } catch (error) {
    console.error("Mail error:", error);
  }
}


const addUser = async (req, res) => {
  try {
    const { name, email, mobile, admin, package, price, paymentmode, validTill } = req.body;
    const plainPassword = getRandomPassword(5);

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User Already Exists' });
    }

    const newUser = await User.create({
      name,
      email,
      mobile,
      admin,
      package,
      price,
      paymentmode,
      password: plainPassword,
      validTill: new Date(validTill)
    });

    // ✅ Respond immediately
    res.status(200).json({
      message: "User Created Successfully",
      user: {
        _id: newUser.id,
        name: newUser.name,
        mobile: newUser.mobile,
        admin: newUser.admin,
        package: newUser.package,
        paymentmode: newUser.paymentmode,
        password: plainPassword,
        validTill: newUser.validTill
      }
    });

    // ✅ NOW send email in background (this won't delay response)
    sendAccountEmail(
      email,
      "Your Account Details - Captcha Hub",
      `Your account has been created.\nEmail: ${email}\nPassword: ${plainPassword}`,
      `
        <h2>Welcome, ${name}!</h2>
        <p>Your account has been created successfully.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${plainPassword}</p>
        <p>You can log in here: 
          <a href="${process.env.FRONTEND_URL}/citizen/login">Login Now</a>
        </p>
        <p>Please change your password after logging in.</p>
      `
    ).catch((error) => {
      console.error("Email sending failed in background:", error);
    });

  } catch (err) {
    console.error("Error while adding user:", err);
    return res.status(500).json({ message: err.message });
  }
};




function getRandomPassword(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-__v');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User Deleted Successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const edituser = async(req,res) => {
    try{
    const { id } = req.params;
    const { name, email, mobile, admin, package, price, paymentmode,validTill} = req.body;

    const user = await User.findById(id);
    if(!user){
        return res.status(500).json({ message: 'Admin Not Found'});
    }
    const existingUser = await User.findOne({ email, _id: { $ne: id } });
    if(existingUser){
      return res.status(400).json({message:'Email Already in Use by another Admin'});
    }
    user.name = name;
    user.email = email;
    user.mobile = mobile;
    user.admin = admin;
    user.package = package;
    user.price = price;
    user.paymentmode = paymentmode;
    user.validTill = new Date(validTill);

    await user.save();
    res.json({message:"User Updated Succesfully"});

    }
    catch(err){
        console.error(err.message);
        res.status(200).json({message:"Server Error", err});
    }
}

const activateUser = async( req, res ) =>{
    try{
        const { id } = req.params;
        await User.findByIdAndUpdate(id,{ isActive: true});
        res.status(200).json({ message: "User Activated Succesfuly"});
    }
    catch(err){
        res.status(400).json({ message: err.message});
    }
}

const DeActivateUser = async( req, res ) => {
    try{
        const { id } = req.params;
        await User.findByIdAndUpdate(id, { isActive: false});
        res.status(200).json({ message: "User Deactivated Succesfuly"})
    }
    catch(err){
        res.status(400).json({ message: err.message});
    }
}


const getInactiveUsers = async( req, res ) => {
    try{
        const inactiveUsers = await User.find({ isActive: false }).select('-__v');
        res.status(200).json(inactiveUsers);
    }
    catch(err){
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
}

const getActiveUsers = async( req, res ) => {
    try{
        const ActiveUsers = await User.find({ isActive: true }).select('-__v');
        res.status(200).json(ActiveUsers);
    }
    catch(err){
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
}

const changeUserPass = async(req, res) => {
    try{
        const { currentPassword, newPassword } = req.body;
        if(!currentPassword || !newPassword){
            return res.status(400).json({ message: "All Fields are Required"});
        }
        if (newPassword.length < 5) {
            return res.status(400).json({ message: 'Password must be at least 5 characters long' });
        }
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(400).json({ message: 'Citizen Not Found'});
        }

        if(currentPassword !== user.password){
            return res.status(400).json({ message: "Current Password is Incorrect"});
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Password Updated Succesfully'});
    }
    catch(err){
        console.error(err.message);
        res.status(500).json({ message: err.message});
    }

}

module.exports = { addUser, getAllUsers, deleteUser, edituser, activateUser, DeActivateUser, getInactiveUsers, getActiveUsers, changeUserPass };
