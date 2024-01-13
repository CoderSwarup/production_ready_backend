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
//Routes Declaration
app.use('/api/v1/users', UserRouter);

// Swagger Api Documentation Route || API Docs
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const file = fs.readFileSync(
  path.resolve(__dirname, '../Swagger_Api_Doc/swagger.yaml'),
  'utf8',
);
const swaggerDocument = YAML.parse(file);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
