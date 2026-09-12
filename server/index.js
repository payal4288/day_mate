import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import documentsRouter from './routes/documents.js';
import billsRouter from './routes/bills.js';
import tasksRouter from './routes/tasks.js';
import chatRouter from './routes/chat.js';
import searchRouter from './routes/search.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/documents', documentsRouter);
app.use('/api/bills', billsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/chat', chatRouter);
app.use('/api/search', searchRouter);

// Health check
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
);

// ── MongoDB Connection ───────────────────────────────────────────────────────
async function start() {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('YOUR_USERNAME')) {
    console.warn('\n⚠️  MONGODB_URI not configured in server/.env');
    console.warn('   Edit server/.env with your Atlas connection string.\n');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected:', mongoose.connection.host);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('   Check your MONGODB_URI in server/.env\n');
  }

  app.listen(PORT, () => {
    console.log(`🚀 DayMate API running at http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
  });
}

start();
