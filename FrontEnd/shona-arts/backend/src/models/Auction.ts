import mongoose, { Schema } from 'mongoose';

const bidHistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bidderName: String,
    amount: { type: Number, required: true },
  },
  { timestamps: true },
);

const auctionSchema = new Schema(
  {
    artworkId: { type: Schema.Types.ObjectId, ref: 'Painting', required: true },
    startingPrice: { type: Number, required: true },
    highestBid: { type: Number, default: 0 },
    currentWinner: { type: Schema.Types.ObjectId, ref: 'User' },
    endTime: { type: Date, required: true },
    bidHistory: [bidHistorySchema],
    winner: { type: Schema.Types.ObjectId, ref: 'User' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    payhereOrderId: String,
    status: { type: String, enum: ['draft', 'live', 'closed'], default: 'draft' },
  },
  { timestamps: true },
);

export const Auction = mongoose.model('Auction', auctionSchema);
