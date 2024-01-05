import express from 'express';
import dotenv from 'dotenv';
// Cookie Parser
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Swagger
import swaggerSpecs from '.././Swagger_Api_Doc/swagger.js';
import swaggerUi from 'swagger-ui-express';

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
    limit: '16kb',
  }),
);

// Express UrlEncoder
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
//Static
app.use(express.static('Public'));
// cookie parser is user to get cookie and set cookie
app.use(cookieParser());

// Routes

// Import Routes
import UserRouter from './routes/user.routes.js';

// Swagger Api Documentation Route

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
//Routes Declaration
app.use('/api/v1/users', UserRouter);

export default app;
