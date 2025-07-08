'use client';

import { useState, useEffect, Suspense } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/Loading';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import { BookForm, BookFormData } from '@/components/BookForm';
import { GET_BOOK, GET_AUTHOR_NAMES } from '@/lib/queries';
import { UPDATE_BOOK } from '@/lib/mutations';
import { Book } from '@/types';
import { formatDate, renderStars } from '@/lib/utils';
import { ArrowLeft, Calendar, User, Star, MessageSquare, Edit } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function BookDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = params.id as string;
  
  // Check if we should start in edit mode
  const editMode = searchParams.get('edit') === 'true';

  // State for view/edit mode
  const [isEditMode, setIsEditMode] = useState(editMode);
  
  // Review modal state
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<{
    id: string;
    rating: number;
    comment: string;
    reviewerName: string;
  } | null>(null);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);

  // Form state for edit mode
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    description: '',
    publishedDate: '',
    authorId: '',
    coverImageUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data, loading, error, refetch } = useQuery(GET_BOOK, {
    variables: { id: bookId },
    errorPolicy: 'all',
  });

  const { data: authorsData, loading: authorsLoading } = useQuery(GET_AUTHOR_NAMES, {
    variables: { page: 1, limit: 100 },
    skip: !isEditMode, 
  });

  const [updateBook, { loading: updating }] = useMutation(UPDATE_BOOK, {
    onCompleted: () => {
      setIsEditMode(false);
      setErrors({});
      const url = new URL(window.location.href);
      url.searchParams.delete('edit');
      window.history.replaceState({}, '', url.toString());
    },
    onError: (error) => {
      console.error('Error updating book:', error);
      setErrors({ general: 'Failed to update book. Please try again.' });
    }
  });

  // Populate form when book data is loaded or when entering edit mode
  useEffect(() => {
    if (data?.book) {
      const book = data.book;
      setFormData({
        title: book.title || '',
        description: book.description || '',
        publishedDate: book.published_date 
          ? new Date(book.published_date).toISOString().split('T')[0] 
          : '',
        authorId: book.author?.id?.toString() || '',
        coverImageUrl: book.metadata?.coverImageUrl || ''
      });
    }
  }, [data, isEditMode]);

  const handleReviewSuccess = () => {
    setReviewRefreshTrigger(prev => prev + 1);
    refetch(); // Refresh book data to update review count
  };

  const handleEditReview = (review: {
    id: string;
    rating: number;
    comment: string;
    reviewerName: string;
  }) => {
    setEditingReview(review);
    setIsReviewFormOpen(true);
  };

  const handleCloseReviewForm = () => {
    setIsReviewFormOpen(false);
    setEditingReview(null);
  };

  const handleSubmit = async (formData: BookFormData) => {
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.authorId) newErrors.authorId = 'Author is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    try {
      await updateBook({
        variables: {
          id: bookId,
          input: {
            title: formData.title.trim(),
            description: formData.description.trim() || null,
            published_date: formData.publishedDate ? new Date(formData.publishedDate).getTime() : null,
            author_id: parseInt(formData.authorId),
            coverImageUrl: formData.coverImageUrl || null
          }
        }
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ general: 'Failed to update book. Please try again.' });
    }
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit
      setErrors({});
      // Update URL to remove edit parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('edit');
      window.history.replaceState({}, '', url.toString());
    } else {
      // Enter edit mode
      const url = new URL(window.location.href);
      url.searchParams.set('edit', 'true');
      window.history.replaceState({}, '', url.toString());
    }
    setIsEditMode(!isEditMode);
  };

  if (loading) {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
    );
  }

  if (error || !data?.book) {
    return (
     
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error?.message || 'The book you are looking for does not exist.'}
            </p>
            <Link
              href="/books"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Back to Books
            </Link>
          </div>
        </div>
    );
  }

  const book: Book = data.book;

  const rating = book.metadata?.averageRating;
  const reviewCount = book.metadata?.totalReviews || 0;

  return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {isEditMode ? (
            // Edit Form using BookForm component
            <BookForm
              mode="edit"
              initialData={formData}
              authors={authorsData?.authors?.authors || []}
              authorsLoading={authorsLoading}
              loading={updating}
              errors={errors}
              onSubmit={handleSubmit}
              onCancel={handleEditToggle}
            />
          ) : (
            // View Mode
            <div className="px-6 py-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                {/* Book Cover */}
                <div className="flex-shrink-0 mb-6 lg:mb-0">
                  <div className="w-48 h-72 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl relative">
                    {book.metadata?.coverImageUrl ? (
                      <Image
                        src={book.metadata.coverImageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover rounded-lg"
                        fill
                      />
                    ) : (
                      <span className="text-center px-4">{book.title}</span>
                    )}
                  </div>
                </div>

                {/* Book Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
                    <button
                      onClick={handleEditToggle}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                  </div>

                  {/* Author */}
                  <div className="flex items-center mb-4">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-lg text-gray-700">
                      by{' '}
                      <Link
                        href={`/authors/${book?.author?.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {book?.author?.name}
                      </Link>
                    </span>
                  </div>

                  {/* Publication Date */}
                  {book.published_date && (
                    <div className="flex items-center mb-4">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-700">
                        Published {formatDate(book.published_date)}
                      </span>
                    </div>
                  )}

                  {/* Rating */}
                  {rating && book.metadata?.totalRatings && book.metadata?.totalRatings>0 ? (
                    <div className="flex items-center mb-6">
                      <Star className="h-5 w-5 text-yellow-400 mr-2" />
                      <span className="text-yellow-400 mr-2">
                        {renderStars(rating)}
                      </span>
                      <span className="text-gray-700 mr-2">
                        {rating.toFixed(1)} average rating
                      </span>
                      {reviewCount > 0 && (
                        <span className="text-gray-500">
                          ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                        </span>
                      )}
                    </div>
                  ): <></>}

                  {/* Genres */}
                  {book.metadata?.genres && book.metadata.genres.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {book.metadata.genres.map((genre, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {book.description && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-700 leading-relaxed">{book.description}</p>
                    </div>
                  )}

                  {/* Book Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Added:</span> {formatDate(book.createdAt)}
                    </div>
                    {book.updatedAt !== book.createdAt && (
                      <div>
                        <span className="font-medium">Updated:</span> {formatDate(book.updatedAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section - Only show in view mode */}
        {!isEditMode && (
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
        )}

        {/* Review Form Modal - Only show in view mode */}
        {!isEditMode && (
          <ReviewForm
            bookId={bookId}
            isOpen={isReviewFormOpen}
            onClose={handleCloseReviewForm}
            onSuccess={handleReviewSuccess}
            editingReview={editingReview}
          />
        )}
      </main>
  );
}

export default function BookDetailPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    }>
      <BookDetailContent />
    </Suspense>
  );
}
