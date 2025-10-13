import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import skillRoutes from './routes/skillRoutes';
import matchRoutes from './routes/matchRoutes';
import connectionRoutes from './routes/connectionRoutes';
import messageRoutes from './routes/messageRoutes';
import vouchRoutes from './routes/vouchRoutes';
import reportRoutes from './routes/reportRoutes';
import postRoutes from './routes/postRoutes';  // NEW

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/vouches', vouchRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/posts', postRoutes);  // NEW

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
