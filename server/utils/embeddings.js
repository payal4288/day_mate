import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

/**
 * Generate a 768-dimensional embedding vector for a text string.
 * Used to power MongoDB Atlas Vector Search.
 */
export async function generateEmbedding(text) {
  try {
    const result = await model.embedContent(text);
    return result.embedding.values; // float[]
  } catch (err) {
    console.error('Embedding generation failed:', err.message);
    // Fallback: deterministic pseudo-random vector for demo/dev
    return deterministicFallback(text, 768);
  }
}

/**
 * Deterministic fallback so the app still works without a real API key.
 * Produces the same vector for the same input (seeded by string hash).
 */
function deterministicFallback(text, dims) {
  let seed = 0;
  for (let i = 0; i < text.length; i++) seed = (seed * 31 + text.charCodeAt(i)) | 0;
  const vec = [];
  let s = seed;
  for (let i = 0; i < dims; i++) {
    s = Math.imul(48271, s) | 0;
    vec.push((s / 0x7fffffff) * 2 - 1);
  }
  const norm = Math.sqrt(vec.reduce((a, v) => a + v * v, 0));
  return vec.map(v => v / norm);
}
