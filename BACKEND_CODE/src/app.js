import express from 'express';
import dotenv from 'dotenv';
// Cookie Parser
import CookieParser from 'cookie-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

//Cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);

// Accept json
app.use(
  express.json({
    limit: '50kb',
  }),
);
// Express UrlEncoder
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

//Static
app.use(express.static('Public'));

// cookie parser is user to get cookie and set cookie
app.use(cookieParser());

// Routes
// Import Routes
import UserRouter from './routes/user.routes.js';

//Routes Declaration
app.use('/api/v1/users', UserRouter);

export default app;
