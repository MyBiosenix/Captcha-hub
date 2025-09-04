const Package = require('../models/Package');

const packagetype = async(req,res) => {
    try{
        const{packages, price} = req.body;

        if (!packages || !price) {
            return res.status(400).json({ message: "Package Type and Price are required" });
        }

        const existing = await Package.findOne({packages});

        if(existing){
            return res.status(400).json({message:"Package Already Exists"});
        }
        const newPackage = await Package.create({
            packages,
            price
        });

        res.status(200).json({message:"Package Added Succesfully",
            packages:{
                _id:newPackage.id,
                packages: newPackage.packages,
                price: newPackage.price
            }
        });
    }
    catch(err){
        console.error(err.message);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

const getAllPackages = async(req,res) => {
    try{
        const packages = await Package.find().select('-__v');
        res.status(200).json(packages);
    }
    catch(err){
        console.error(err.message);
    }
};

const deletePackages = async(req,res) => {
    try{
        const{ id } = req.params;
        await Package.findByIdAndDelete(id);
        res.status(200).json({message:"Package Deleted Succesfully"});
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

const allPackages = async(req,res) => {
    try{
        const packageName = await Package.find().select('packages');
        res.status(200).json(packageName)
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

const editPackages = async (req, res) => {
  try {
    const { id } = req.params;
    const { packages,price } = req.body;

    if (!packages || !price) {
      return res.status(400).json({ message: "Package Type and Price are required" });
    }

    const packageDoc = await Package.findById(id);
    if (!packageDoc) {
      return res.status(404).json({ message: "Package not found" });
    }

    const existingPackage = await Package.findOne({ packages, _id: { $ne: id } });
    if (existingPackage) {
      return res.status(400).json({ message: 'Package Type already exists' });
    }

    packageDoc.packages = packages;
    packageDoc.price = price
    await packageDoc.save();

    res.json({ message: 'Package updated successfully', Package: packageDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

module.exports = {packagetype, getAllPackages, deletePackages, allPackages, editPackages}