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

// ✅ CORS Configuration — must allow cookies and set strict origin
const allowedOrigins = [
  'https://collab-task-frontend.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // ✅ allow sending/receiving cookies
  })
);

// ✅ Middleware: order matters!
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
