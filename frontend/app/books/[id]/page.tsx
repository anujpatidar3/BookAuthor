'use client';

import { useQuery } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { LoadingSpinner } from '@/components/Loading';
import { GET_BOOK } from '@/lib/queries';
import { Book } from '@/types';
import { formatDate, formatYear, renderStars } from '@/lib/utils';
import { ArrowLeft, Calendar, User, Star, MessageSquare, Edit } from 'lucide-react';
import Link from 'next/link';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const { data, loading, error } = useQuery(GET_BOOK, {
    variables: { id: bookId },
    errorPolicy: 'all',
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
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
      </div>
    );
  }

  const book: Book = data.book;
  const rating = book.metadata?.averageRating;
  const reviewCount = book.metadata?.totalReviews || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
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
          <div className="px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
              {/* Book Cover Placeholder */}
              <div className="flex-shrink-0 mb-6 lg:mb-0">
                <div className="w-48 h-72 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  {book.metadata?.coverImageUrl ? (
                    <img
                      src={book.metadata.coverImageUrl}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg"
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
                  <Link
                    href={`/books/${book.id}/edit`}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </div>

                {/* Author */}
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-lg text-gray-700">
                    by{' '}
                    <Link
                      href={`/authors/${book.author.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {book.author.name}
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
                {rating && (
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
                )}

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
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Reviews ({reviewCount})
              </h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
                Write a Review
              </button>
            </div>
          </div>
          <div className="px-6 py-8">
            <div className="text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No reviews yet. Be the first to review this book!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
