require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const ConnectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const typeRoutes = require('./routes/typeRoutes');
const userRoutes = require('./routes/userRoutes');
const citizenAuthRoutes = require('./routes/citizenAuthRoutes');
const subadminRoutes = require('./routes/subAdminRoutes');

ConnectDB();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
app.use('/api/auth', authRoutes);
app.use('/api/auth/admin', adminRoutes);
/*app.use('/api/admin', adminRoutes);*/
app.use('/api/types',typeRoutes);
app.use('/api/auth/user',userRoutes);

app.use('/api/citizen', citizenAuthRoutes);
app.use('/api/sub-admin',subadminRoutes);

app.listen(PORT,() => {
    console.log(`Server Running on PORT:${PORT}`);
})