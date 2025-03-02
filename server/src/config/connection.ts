import mongoose from 'mongoose';

const initializeDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks', {
    });
    console.log('Connected to the database');
  } catch (error) {
    console.log('Database connection error:', error);
  }
};

export default initializeDb;
