const mongoose = require('mongoose');

const ConnectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Mongodb Connected');
    }
    catch(err){
        console.error(err.message);
        console.log("Mongo Connection Failed");
        process.exit(1);
    }
}
module.exports = ConnectDB;