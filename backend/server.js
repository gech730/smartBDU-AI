import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import cvRoutes from './routes/cvRoutes.js';
import careerRecommendationRoutes from './routes/careerRecommendationRoutes.js';
import seedAll from './utils/seed.js';
import { checkAPIStatus } from './ai/service.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/career-recommend', careerRecommendationRoutes);

app.get('/api/health', async (req, res) => {
  const aiStatus = await checkAPIStatus();
  res.json({ 
    status: 'ok', 
    message: 'SmartBDU AI Server is running',
    ai: aiStatus
  });
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
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();