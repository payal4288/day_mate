import express from 'express';
import Document from '../models/Document.js';
import { generateEmbedding } from '../utils/embeddings.js';

const router = express.Router();

// GET all documents
router.get('/', async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single document
router.get('/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create document + generate embedding
router.post('/', async (req, res) => {
  try {
    const doc = new Document(req.body);
    const embeddingText = doc.toEmbeddingText();
    doc.embedding = await generateEmbedding(embeddingText);
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH update document (e.g. mark as processed)
router.patch('/:id', async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!doc) return res.status(404).json({ error: 'Not found' });

    // Re-embed if content changed
    if (req.body.title || req.body.fields || req.body.status) {
      doc.embedding = await generateEmbedding(doc.toEmbeddingText());
      await doc.save();
    }
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE document
router.delete('/:id', async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
