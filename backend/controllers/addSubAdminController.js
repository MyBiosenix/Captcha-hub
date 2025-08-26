const Admin = require('../models/Admin');
const router = require('../routes/adminRoutes');

const addsubadmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email Already Exists' });
    }

    const newAdmin = await Admin.create({
      name,
      email,
      password,
      role
    });

    res.status(200).json({
      message: "Sub Admin Created Successfully",
      admin: {
        _id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllAdmins = async(req,res) => {
  try{
    const admins = await Admin.find().select('-__v');
    res.status(200).json(admins);
  }
  catch(err){
    res.status(400).json({message:err.message});
  }
};
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAdminName = async(req,res) => {
  try{
    const adminName = await Admin.find().select('name');
    res.status(200).json(adminName);
  }
  catch(err){
    res.status(500).json({message:err.message});
  }
}

const editSubAdmin = async(req,res) => {
  try{
    const { id } = req.params;
    const {name, email, role} = req.body;

    if(!name || !email || !role){
      return res.status(400).json({ message: 'All Fields are Required'});
    }
    const admin = await Admin.findById(id);
    if(!admin){
      return res.status(500).json({ message: 'Admin Not Found'});
    }

    const existingAdmin = await Admin.findOne({ email, _id: { $ne: id } });

    if(existingAdmin){
      return res.status(400).json({message:'Email Already in Use by another Admin'});
    }
    admin.name = name;
    admin.email = email;
    admin.role = role;

    await admin.save();
    res.json({ message: 'Admin updated successfully', admin });
  }
  catch(error){
    console.error(error);
    res.status(500).json({message: 'Server Error', error})
  }
};


module.exports = { addsubadmin, getAllAdmins, deleteAdmin, getAdminName, editSubAdmin};