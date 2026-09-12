import mongoose from 'mongoose';

const billSchema = new mongoose.Schema(
  {
    vendor: { type: String, required: true },
    oldPrice: { type: String },
    newPrice: { type: String },
    alert: { type: String },
    script: { type: String },
    emailSent: { type: Boolean, default: false },
    moneySaved: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Bill', billSchema);
