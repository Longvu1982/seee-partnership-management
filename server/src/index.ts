import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import { pino } from 'pino';
import { notFoundHandler } from './middleware/not-found';
import requestLogger from './middleware/requestLogger';

dotenv.config();

export const logger = pino({ name: 'server start' });
const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

// CORS Middleware
const corsOptions = {
  // origin: process.env.APP_ENV == 'developement' ? '*' : process.env.ORIGIN,
  origin: [process.env.ORIGIN!],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
// JSON Middleware & Form Data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log(process.env.APP_ENV);

// cookie parser middleware
app.use(cookieParser());

// Request Logger
app.use(requestLogger);

// Main Routes
app.use('/health', (req, res) => {
  res.status(200).json({ message: 'OK' });
});

// Not Found Middleware
app.use(notFoundHandler);

// Error Handling Middleware

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Listening on PORT ${PORT}`);
});
