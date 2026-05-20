import mongoose, { Schema } from 'mongoose';

const bidSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bidderName: String,
    amount: { type: Number, required: true },
  },
  { timestamps: true },
);

const paintingSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    images: [{ type: String }],
    stock: { type: Number, default: 1, min: 0 },
    artist: { type: String, required: true },
    style: { type: String, default: 'Modern', index: true },
    popularity: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    bids: [bidSchema],
  },
  { timestamps: true },
);

export const Painting = mongoose.model('Painting', paintingSchema);
