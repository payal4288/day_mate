import express from 'express';
import mongoose from 'mongoose';
import { generateEmbedding } from '../utils/embeddings.js';

const router = express.Router();

/**
 * POST /api/search
 * Body: { query: string, limit?: number }
 *
 * Performs MongoDB Atlas Vector Search over the documents collection.
 * Falls back to a text-based regex search if the vector index doesn't exist yet.
 */
router.post('/', async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;
    if (!query) return res.status(400).json({ error: 'query is required' });

    const queryVector = await generateEmbedding(query);

    // Try Atlas Vector Search first
    try {
      const results = await mongoose.connection.db
        .collection('documents')
        .aggregate([
          {
            $vectorSearch: {
              index: 'document_vector_index',
              path: 'embedding',
              queryVector,
              numCandidates: 50,
              limit: Number(limit)
            }
          },
          {
            $project: {
              _id: 1,
              title: 1,
              tag: 1,
              fields: 1,
              status: 1,
              category: 1,
              processed: 1,
              score: { $meta: 'vectorSearchScore' }
            }
          }
        ])
        .toArray();

      return res.json({ results, mode: 'vector' });
    } catch (vectorErr) {
      // Vector index not set up yet — fall back to text search
      console.warn('Vector search unavailable, falling back to text search:', vectorErr.message);

      const regex = new RegExp(query.split(' ').join('|'), 'i');
      const results = await mongoose.connection.db
        .collection('documents')
        .find({
          $or: [
            { title: { $regex: regex } },
            { tag: { $regex: regex } },
            { status: { $regex: regex } }
          ]
        })
        .limit(Number(limit))
        .toArray();

      return res.json({ results, mode: 'text_fallback' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
