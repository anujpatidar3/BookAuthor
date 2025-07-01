import mongoose, { Document, Schema } from 'mongoose';

export interface IBookMetadata extends Document {
  bookId: number;
  genres: string[];
  tags: string[];
  isbn?: string;
  pageCount?: number;
  language: string;
  coverImageUrl?: string;
  averageRating?: number;
  totalReviews: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookMetadataSchema: Schema = new Schema(
  {
    bookId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    genres: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
    },
    pageCount: {
      type: Number,
      min: 1,
    },
    language: {
      type: String,
      required: true,
      default: 'English',
    },
    coverImageUrl: {
      type: String,
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

BookMetadataSchema.index({ genres: 1 });
BookMetadataSchema.index({ tags: 1 });
BookMetadataSchema.index({ averageRating: -1 });

export default mongoose.model<IBookMetadata>('BookMetadata', BookMetadataSchema);
