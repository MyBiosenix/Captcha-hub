require('dotenv').config();
const ConnectDB = require('./config/db');
const Admin = require('./models/Admin');

const createSuperAdmin = async () => {
  try {
    await ConnectDB();
    console.log('Connected to MongoDB');

    const superAdminData = {
      name: 'Rahul',
      email: 'captcha@google.com',
      password: 'Superadmin@123',
      role: 'superadmin'
    };

    const existingAdmin = await Admin.findOne({ email: superAdminData.email });
    if (existingAdmin) {
      console.log('SuperAdmin already exists!');
    } else {
      await Admin.create(superAdminData);
      console.log('SuperAdmin created successfully!');
    }
  } catch (error) {
    console.error('Error creating SuperAdmin:', error.message);
  } finally {
    process.exit();
  }
};

createSuperAdmin();