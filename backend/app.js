import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import errorHandler from './middlewares/error.middleware.js';
const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (!process.env.CLIENT_URL || process.env.CLIENT_URL === '*') {
        return callback(null, origin);
      }
      const allowed = process.env.CLIENT_URL.split(',').map((u) => u.trim());
      if (allowed.includes(origin)) {
        return callback(null, origin);
      }
      return callback(null, origin);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'));
}

app.use('/api', routes);

app.use((_request, response) => {
	response.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

export default app;
