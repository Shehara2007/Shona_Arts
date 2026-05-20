import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        artwork: { type: Schema.Types.ObjectId, ref: 'Painting', required: true },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    shippingAddress: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    orderStatus: { type: String, enum: ['processing', 'packed', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
    payhereOrderId: String,
  },
  { timestamps: true },
);

export const Order = mongoose.model('Order', orderSchema);
