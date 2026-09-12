import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tag: { type: String, default: 'General' },
    category: {
      type: String,
      enum: ['form', 'receipt', 'warranty', 'medical', 'insurance', 'other'],
      default: 'other'
    },
    fields: { type: Map, of: String, default: {} },
    status: { type: String, default: 'Pending' },
    processed: { type: Boolean, default: false },
    // 768-dim vector from Gemini text-embedding-004
    embedding: { type: [Number], select: false }
  },
  { timestamps: true }
);

// Text to embed = title + tag + all field values
documentSchema.methods.toEmbeddingText = function () {
  const fieldValues = this.fields ? [...this.fields.values()].join(' ') : '';
  return `${this.title} ${this.tag} ${fieldValues} ${this.status}`;
};

export default mongoose.model('Document', documentSchema);
