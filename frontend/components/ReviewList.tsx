import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Star, MessageSquare, Edit, Trash2, ThumbsUp } from 'lucide-react';
import { GET_REVIEWS } from '../lib/queries';
import { DELETE_REVIEW, MARK_REVIEW_HELPFUL } from '../lib/mutations';
import { formatDate } from '../lib/utils';

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

interface ReviewListProps {
  bookId: string;
  onEditReview: (review: Review) => void;
  bookDataRefetch: () => void;
  refreshTrigger?: number;
}

export default function ReviewList({ bookId, onEditReview, refreshTrigger, bookDataRefetch }: ReviewListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_REVIEWS, {
    variables: {
      bookId: parseInt(bookId),
      page: currentPage,
      limit: 10,
    },
  });

  const [deleteReview] = useMutation(DELETE_REVIEW);
  const [markReviewHelpful] = useMutation(MARK_REVIEW_HELPFUL);

  // Refetch when refreshTrigger changes
  React.useEffect(() => {
    if (refreshTrigger) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setDeletingReviewId(reviewId);
    try {
      await deleteReview({
        variables: { id: reviewId },
      });
      refetch();
      bookDataRefetch();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    } finally {
      setDeletingReviewId(null);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await markReviewHelpful({
        variables: { id: reviewId },
      });
      refetch();
    } catch (error) {
      console.error('Error marking review helpful:', error);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading reviews: {error.message}</p>
      </div>
    );
  }

  const reviews = data?.reviews?.reviews || [];
  const pagination = data?.reviews?.pagination;

  if (reviews.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No reviews yet. Be the first to review this book!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review: Review) => (
        <div
          key={review.id}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-medium text-gray-900">{review.reviewerName}</span>
                {renderStars(review.rating)}
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
                {review.updatedAt !== review.createdAt && (
                  <span className="text-xs text-gray-400">(edited)</span>
                )}
              </div>
              <p className="text-gray-700 mb-3">{review.comment}</p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleMarkHelpful(review.id)}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onEditReview(review)}
                className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-white"
                title="Edit review"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteReview(review.id)}
                disabled={deletingReviewId === review.id}
                className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-white disabled:opacity-50"
                title="Delete review"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-200"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-gray-700">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
            disabled={currentPage === pagination.totalPages}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
