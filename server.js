import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

import connectDatabase from './db/connectDatabase.js';
import userRoutes from "./Routes/UserRoutes.js"

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

connectDatabase();

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Backend running..." });
});

const PORT = process.env.PORT || 6060;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
