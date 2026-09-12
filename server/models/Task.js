import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    action: { type: String },
    contractor: { type: String },
    booked: { type: Boolean, default: false },
    dueDate: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
