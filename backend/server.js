import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import cvRoutes from './routes/cvRoutes.js';
import careerRecommendationRoutes from './routes/careerRecommendationRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import campusRoutes from './routes/campusRoutes.js';
import seedAll from './utils/seed.js';
import { checkAPIStatus } from './ai/service.js';

dotenv.config();

const app = express();

const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:3000'].filter(Boolean);
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' }
});

app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/career-recommend', careerRecommendationRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/campus', campusRoutes);

app.get('/api/health', async (req, res) => {
  const aiStatus = await checkAPIStatus();
  res.json({ 
    status: 'ok', 
    message: 'SmartBDU AI Server is running',
    version: '2.0.0',
    features: ['auth', 'chat', 'departments', 'schedules', 'announcements', 'courses', 'campus', 'ai'],
    ai: aiStatus
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ success: false, error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedAll();
    
    const aiStatus = await checkAPIStatus();
    
    if (aiStatus.available) {
      console.log(`✓ AI enabled (${aiStatus.provider}) - Model: ${aiStatus.model}`);
    } else {
      console.warn('⚠️  AI not available - Check configuration');
    }
    
    app.listen(PORT, () => {
      console.log(`✓ SmartBDU Server running on http://localhost:${PORT}`);
      console.log(`✓ API: http://localhost:${PORT}/api`);
      console.log(`✓ Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
