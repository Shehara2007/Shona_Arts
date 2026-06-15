import mongoose, { Schema } from 'mongoose';

export interface IBid {
  auctionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  bidAmount: number;
  bidRating?: 'Low Bid' | 'Fair Bid' | 'Strong Bid' | 'Winning Chance High';
  aiSuggestion?: number;
  createdAt: Date;
}

const bidSchema = new Schema<IBid>(
  {
    auctionId: { type: Schema.Types.ObjectId, ref: 'Auction', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bidAmount: { type: Number, required: true, min: 0 },
    bidRating: {
      type: String,
      enum: ['Low Bid', 'Fair Bid', 'Strong Bid', 'Winning Chance High'],
    },
    aiSuggestion: { type: Number }, // AI suggested bid amount
  },
  { timestamps: true },
);

// Indexes for performance
bidSchema.index({ auctionId: 1, createdAt: -1 });
bidSchema.index({ userId: 1 });

export const Bid = mongoose.model<IBid>('Bid', bidSchema);
