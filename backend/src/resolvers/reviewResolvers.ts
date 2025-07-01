import { GraphQLError } from 'graphql';
import Review from '../models/Review';
import BookMetadata from '../models/BookMetadata';
import Book from '../models/Book';

export const reviewResolvers = {
  Query: {
    reviews: async (_: any, { bookId, page = 1, limit = 10 }: { bookId: number; page?: number; limit?: number }) => {
      try {
        const skip = (page - 1) * limit;
        
        // Get total count
        const totalItems = await Review.countDocuments({ bookId });
        
        // Get reviews with pagination
        const reviews = await Review.find({ bookId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);

        // Calculate pagination info
        const totalPages = Math.ceil(totalItems / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
          reviews,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            hasNextPage,
            hasPrevPage,
          },
        };
      } catch (error) {
        throw new GraphQLError(`Failed to fetch reviews: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  },

  Mutation: {
    createReview: async (_: any, { input }: { input: any }) => {
      try {
        // Verify book exists
        const book = await Book.findByPk(input.bookId);
        if (!book) {
          throw new GraphQLError('Book not found');
        }

        const review = new Review(input);
        await review.save();

        // Update book metadata
        await updateBookRatingStats(input.bookId);

        return review;
      } catch (error) {
        throw new GraphQLError(`Failed to create review: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    updateReview: async (_: any, { id, rating, comment }: { id: string; rating?: number; comment?: string }) => {
      try {
        const review = await Review.findById(id);
        if (!review) {
          throw new GraphQLError('Review not found');
        }

        const updateData: any = {};
        if (rating !== undefined) updateData.rating = rating;
        if (comment !== undefined) updateData.comment = comment;

        await Review.findByIdAndUpdate(id, updateData, { new: true });

        // Update book metadata if rating changed
        if (rating !== undefined) {
          await updateBookRatingStats(review.bookId);
        }

        return await Review.findById(id);
      } catch (error) {
        throw new GraphQLError(`Failed to update review: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    deleteReview: async (_: any, { id }: { id: string }) => {
      try {
        const review = await Review.findById(id);
        if (!review) {
          throw new GraphQLError('Review not found');
        }

        const bookId = review.bookId;
        await Review.findByIdAndDelete(id);

        // Update book metadata
        await updateBookRatingStats(bookId);

        return true;
      } catch (error) {
        throw new GraphQLError(`Failed to delete review: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    markReviewHelpful: async (_: any, { id }: { id: string }) => {
      try {
        const review = await Review.findByIdAndUpdate(
          id,
          { $inc: { helpful: 1 } },
          { new: true }
        );

        if (!review) {
          throw new GraphQLError('Review not found');
        }

        return review;
      } catch (error) {
        throw new GraphQLError(`Failed to mark review as helpful: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    updateBookMetadata: async (_: any, { bookId, input }: { bookId: number; input: any }) => {
      try {
        // Verify book exists
        const book = await Book.findByPk(bookId);
        if (!book) {
          throw new GraphQLError('Book not found');
        }

        const metadata = await BookMetadata.findOneAndUpdate(
          { bookId },
          { $set: input },
          { new: true, upsert: true }
        );

        return metadata;
      } catch (error) {
        throw new GraphQLError(`Failed to update book metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  },
};

// Helper function to update book rating statistics
async function updateBookRatingStats(bookId: number) {
  try {
    const reviews = await Review.find({ bookId });
    const totalReviews = reviews.length;
    const totalRatings = reviews.filter(r => r.rating).length;

    if (totalRatings > 0) {
      // If there are ratings, calculate and set average
      const averageRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalRatings;
      await BookMetadata.findOneAndUpdate(
        { bookId },
        {
          $set: {
            totalReviews,
            totalRatings,
            averageRating: Math.round(averageRating * 10) / 10,
          },
        },
        { upsert: true }
      );
    } else {
      // If no ratings, explicitly remove the averageRating field
      await BookMetadata.findOneAndUpdate(
        { bookId },
        {
          $set: {
            totalReviews,
            totalRatings,
          },
          $unset: {
            averageRating: "",
          },
        },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error('Error updating book rating stats:', error);
  }
}
