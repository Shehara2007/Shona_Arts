import mongoose, { Schema } from 'mongoose';

const customOrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    referenceImage: { type: String, required: true },
    artStyle: { type: String, required: true },
    notes: { type: String, required: true },
    budget: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    status: { type: String, enum: ['pending', 'approved', 'in-progress', 'completed', 'rejected'], default: 'pending' },
    payhereOrderId: String,
  },
  { timestamps: true },
);

export const CustomOrder = mongoose.model('CustomOrder', customOrderSchema);
