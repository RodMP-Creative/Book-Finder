import mongoose from 'mongoose';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'mongodb',
  url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks',
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const initializeDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');
    await AppDataSource.initialize();
    console.log('Connected to the database');
  } catch (error) {
    console.log('Database connection error:', error);
  }
};

export default initializeDb;
