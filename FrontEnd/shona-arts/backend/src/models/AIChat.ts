import mongoose, { Schema } from 'mongoose';

export interface IAIChat {
  userId: mongoose.Types.ObjectId;
  artworkId?: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  context?: string;
  createdAt: Date;
}

const aiChatSchema = new Schema<IAIChat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    artworkId: { type: Schema.Types.ObjectId, ref: 'Painting' },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    context: { type: String }, // Additional context like page, artwork details
  },
  { timestamps: true },
);

// Index for faster queries
aiChatSchema.index({ userId: 1, createdAt: -1 });
aiChatSchema.index({ artworkId: 1 });

export const AIChat = mongoose.model<IAIChat>('AIChat', aiChatSchema);
