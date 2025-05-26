const mongoose = require('mongoose');

const 
mongoURI = "mongodb+srv://strunka:A324a2z4eda1@cluster0.nk5wvkl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async () => {
   try {
       await mongoose.connect(mongoURI);
       console.log('MongoDB connected successfully');
   } catch (err) {
       console.error('Database connection failed:', err);
   }
};

module.exports = connectDB;