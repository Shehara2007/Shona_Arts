import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    artworkId: { type: Schema.Types.ObjectId, ref: 'Painting', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true, trim: true },
    images: [{ type: String }],
    verifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Review = mongoose.model('Review', reviewSchema);
