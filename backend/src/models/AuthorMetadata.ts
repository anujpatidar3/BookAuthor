import mongoose, { Document, Schema } from 'mongoose';

export interface IAuthorMetadata extends Document {
  authorId: number;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    website?: string;
  };
  profileImageUrl?: string;
  awards: string[];
  totalBooks: number;
  averageRating?: number;
  followers: number;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorMetadataSchema: Schema = new Schema(
  {
    authorId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    socialMedia: {
      twitter: String,
      facebook: String,
      website: String,
    },
    profileImageUrl: {
      type: String,
    },
    awards: {
      type: [String],
      default: [],
    },
    totalBooks: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
    },
    followers: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAuthorMetadata>('AuthorMetadata', AuthorMetadataSchema);
