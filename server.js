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

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// ✅ Allowlisted CORS origins
const allowedOrigins = [
  'http://localhost:3000',
];



// ✅ Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// ✅ Preflight support
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ✅ Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

// ✅ Body parsers
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// ✅ Connect to MongoDB
connectDatabase();

// ✅ Routes
app.use('/api/users', userRoutes)

// ✅ Health check
app.get('/', (req, res) => {
  res.json({ message: '🩺 Hello from CredenHealth backend.' });
});


// ✅ Start the server
const PORT = process.env.PORT || 6060;
server.listen(PORT, '0.0.0.0', () => {
 console.log(`Server is running at http://localhost:${PORT}`);
});
