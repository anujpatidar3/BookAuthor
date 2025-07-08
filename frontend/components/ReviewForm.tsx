"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Star, X } from "lucide-react";
import { CREATE_REVIEW, UPDATE_REVIEW } from "../lib/mutations";

interface ReviewFormProps {
  bookId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editingReview?: {
    id: string;
    rating: number;
    comment: string;
    reviewerName: string;
  } | null;
}

export default function ReviewForm({
  bookId,
  isOpen,
  onClose,
  onSuccess,
  editingReview,
}: ReviewFormProps) {
  const [rating, setRating] = useState(editingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(editingReview?.comment || "");
  const [reviewerName, setReviewerName] = useState(
    editingReview?.reviewerName || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createReview] = useMutation(CREATE_REVIEW);
  const [updateReview] = useMutation(UPDATE_REVIEW);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a comment");
      return;
    }

    if (!reviewerName.trim()) {
      alert("Please enter your name");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingReview) {
        // Update existing review
        await updateReview({
          variables: {
            id: editingReview.id,
            rating,
            comment: comment.trim(),
          },
        });
      } else {
        // Create new review
        await createReview({
          variables: {
            input: {
              bookId: parseInt(bookId),
              rating,
              comment: comment.trim(),
              reviewerName: reviewerName.trim(),
            },
          },
        });
      }

      // Reset form
      setRating(0);
      setComment("");
      setReviewerName("");
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-700">
            {editingReview ? "Edit Review" : "Write a Review"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="text-2xl focus:outline-none"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {rating} star{rating !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Reviewer Name */}
          {!editingReview && (
            <div>
              <label
                htmlFor="reviewerName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Name *
              </label>
              <input
                type="text"
                id="reviewerName"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          {/* Comment */}
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Review *
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Write your review here..."
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : editingReview
                ? "Update Review"
                : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
