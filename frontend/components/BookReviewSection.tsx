"use client";

import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import { MessageSquare } from "lucide-react";
import { Book } from "@/types";

interface BookReviewSectionProps {
  book: Book;
  isReviewFormOpen: boolean;
  setIsReviewFormOpen: (isOpen: boolean) => void;
  handleCloseReviewForm: () => void;
  bookId: string;
  handleEditReview: (review: {
    id: string;
    rating: number;
    comment: string;
    reviewerName: string;
  }) => void;
  reviewRefreshTrigger: number;
  refetch: () => void;
  handleReviewSuccess: () => void;
  editingReview: {
    id: string;
    rating: number;
    comment: string;
    reviewerName: string;
  } | null;
}
export function BookReviewSection({
  book,
  isReviewFormOpen,
  setIsReviewFormOpen,
  handleCloseReviewForm,
  bookId,
  handleEditReview,
  reviewRefreshTrigger,
  refetch,
  handleReviewSuccess,
  editingReview,
}: BookReviewSectionProps) {
  return (
    <>
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Reviews ({book.metadata?.totalReviews || 0})
            </h2>
            <button
              onClick={() => setIsReviewFormOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              Write a Review
            </button>
          </div>
        </div>
        <div className="px-6 py-6">
          <ReviewList
            bookId={bookId}
            onEditReview={handleEditReview}
            refreshTrigger={reviewRefreshTrigger}
            bookDataRefetch={refetch}
          />
        </div>
      </div>
      <ReviewForm
        bookId={bookId}
        isOpen={isReviewFormOpen}
        onClose={handleCloseReviewForm}
        onSuccess={handleReviewSuccess}
        editingReview={editingReview}
      />
    </>
  );
}
