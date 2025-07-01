import mongoose from 'mongoose';
import { config } from './index';

const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.database.mongoUrl);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectMongoDB;
