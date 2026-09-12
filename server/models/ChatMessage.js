import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ['user', 'ai'], required: true },
    text: { type: String, required: true },
    sessionId: { type: String, default: 'default' }
  },
  { timestamps: true }
);

export default mongoose.model('ChatMessage', chatMessageSchema);
