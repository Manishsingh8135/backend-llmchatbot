import mongoose from 'mongoose';
import { logger } from '../infrastructure/logger/logger';

const connectDatabase = async (): Promise<void> => {
  try {
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }

    await mongoose.connect(dbUri);

    logger.info('Successfully connected to the database');
  } catch (error) {
    logger.error('Error connecting to the database:', error);
    process.exit(1);
  }
};

export default connectDatabase;