import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import { notFound, errorHandler } from './middlewares/errorMiddleware';

const app = express();

// Logging in dev mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ✅ Updated CORS config: allow Vercel + local development
app.use(
  cors({
    origin: [
      'https://collab-task-frontend.vercel.app',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
    ],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
