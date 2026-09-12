import express from 'express';
import ChatMessage from '../models/ChatMessage.js';

const router = express.Router();

// GET chat history for a session
router.get('/', async (req, res) => {
  try {
    const { sessionId = 'default', limit = 50 } = req.query;
    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 })
      .limit(Number(limit));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST save a chat message
router.post('/', async (req, res) => {
  try {
    const { sender, text, sessionId = 'default' } = req.body;
    const message = await ChatMessage.create({ sender, text, sessionId });
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE clear session history
router.delete('/', async (req, res) => {
  try {
    const { sessionId = 'default' } = req.query;
    await ChatMessage.deleteMany({ sessionId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
