import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  bookId: number;
  userId?: string;
  rating: number;
  comment?: string;
  reviewerName: string;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    bookId: {
      type: Number,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
    reviewerName: {
      type: String,
      required: true,
      maxlength: 100,
    },
    helpful: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ bookId: 1, createdAt: -1 });

export default mongoose.model<IReview>('Review', ReviewSchema);
