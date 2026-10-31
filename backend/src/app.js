import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.js';
import routes from './routes/index.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());
if (!env.isProd) app.use(morgan('dev'));

// Connect to MongoDB on the first request (needed on serverless hosts).
let ready;
app.use(async (_req, _res, next) => {
  try {
    ready ||= connectDB();
    await ready;
    next();
  } catch (err) {
    ready = null;
    next(err);
  }
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;