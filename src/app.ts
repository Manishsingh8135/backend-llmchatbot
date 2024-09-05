// File: src/app.ts

import { Application } from 'express';
import configureApp from './config/app';
import connectDatabase from './config/database';
import { logger } from './infrastructure/logger/logger';
import authRoutes from './api/routes/authRoutes';
import userRoutes from './api/routes/userRoutes';
import chatRoutes from './api/routes/chatRoutes';


const startServer = async (): Promise<void> => {
  try {
    const app: Application = configureApp();

    // Add routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/chats', chatRoutes);

    await connectDatabase();

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start the server:', error);
    process.exit(1);
  }
};

export default startServer;