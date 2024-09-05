import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errorMiddleware } from '../api/middlewares/errorMiddleware';

const configureApp = (): express.Application => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes will be added here

  // Error handling middleware
  app.use(errorMiddleware);

  return app;
};

export default configureApp;