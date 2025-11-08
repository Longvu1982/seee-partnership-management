import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import { pino } from 'pino';
import { notFoundHandler } from './middleware/not-found';
import requestLogger from './middleware/requestLogger';
import authRouter from './routes/auth.router';
import userRouter from './routes/user.router';
import contactRouter from './routes/contact.router';
import eventRouter from './routes/event.router';
import partnerRouter from './routes/partner.router';

dotenv.config();

export const logger = pino({ name: 'server start' });
const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

const corsOptions = {
  // origin: process.env.APP_ENV == 'developement' ? '*' : process.env.ORIGIN,
  origin: [process.env.ORIGIN!],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

// Main Routes
app.use('/health', (req, res) => {
  res.status(200).json({ message: 'OK' });
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/contact', contactRouter);
app.use('/api/event', eventRouter);
app.use('/api/partner', partnerRouter);

// Not Found Middleware
app.use(notFoundHandler);

// Error Handling Middleware

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Listening on PORT ${PORT}`);
});
