import express from 'express';
import dotenv from 'dotenv';
// Cookie Parser
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Swagger
import swaggerSpecs from '.././Swagger_Api_Doc/swagger.js';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import YAML from 'yaml';
dotenv.config();

// Define app
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);
// cookie parser is user to get cookie and set cookie
app.use(cookieParser());

// Accept json
app.use(
  express.json({
    limit: '16kb',
  }),
);

// Express UrlEncoder
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
//Static
app.use(express.static('Public'));

// Routes

// Import Routes
import UserRouter from './routes/user.routes.js';
import healthcheckRouter from './routes/healthcheck.routes.js';
import tweetRouter from './routes/tweet.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import videoRouter from './routes/video.routes.js';
import commentRouter from './routes/comment.routes.js';
import likeRouter from './routes/like.routes.js';
import playlistRouter from './routes/playlist.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';

//Routes Declaration
app.use('/api/v1/healthcheck', healthcheckRouter);
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/tweets', tweetRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/playlist', playlistRouter);
app.use('/api/v1/dashboard', dashboardRouter);

// Swagger Api Documentation Route || API Docs
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const file = fs.readFileSync(
  path.resolve(__dirname, '../Swagger_Api_Doc/swagger.yaml'),
  'utf8',
);
const swaggerDocument = YAML.parse(file);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
