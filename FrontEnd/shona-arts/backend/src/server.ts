import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';
import path from 'path';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/error.js';
import { authRoutes } from './routes/authRoutes.js';
import { adminRoutes } from './routes/adminRoutes.js';
import { commerceRoutes } from './routes/commerceRoutes.js';
import { paintingRoutes } from './routes/paintingRoutes.js';
import { uploadRoutes } from './routes/uploadRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { registerAuctionSocket } from './sockets/auctionSocket.js';

const app = express();
const server = http.createServer(app);
const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:5173';
const allowedOrigins = new Set([
  clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
]);

const corsOptions = {
  origin(origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

const io = new Server(server, { cors: corsOptions });

app.use(helmet());
app.use(cors(corsOptions));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/uploads-local', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'shona-arts-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/paintings', paintingRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', commerceRoutes);
app.use(notFound);
app.use(errorHandler);

registerAuctionSocket(io);

const port = Number(process.env.PORT ?? 5000);

connectDB()
  .then(() => server.listen(port, () => console.log(`API running on port ${port}`)))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
