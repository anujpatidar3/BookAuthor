import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Eye, BookOpen } from 'lucide-react';
import { Book } from '@/types';
import { formatDateShort, getGenreColor, truncateText, renderStars } from '@/lib/utils';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const coverImage = book.metadata?.coverImageUrl || '/placeholder-book.png';
  const rating = book.metadata?.averageRating;
  const reviewCount = book.metadata?.totalReviews || 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Book Cover */}
          <div className="flex-shrink-0">
            <div className="relative w-24 h-32 bg-gray-200 rounded-md overflow-hidden">
              <Image
                src={coverImage}
                alt={`${book.title} cover`}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-book.png';
                }}
              />
            </div>
          </div>

          {/* Book Details */}
          <div className="flex-1 min-w-0">
            <div className="space-y-3">
              {/* Title and Author */}
              <div>
                <Link 
                  href={`/books/${book.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {book.title}
                </Link>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <User className="h-4 w-4 mr-1" />
                  <Link 
                    href={`/authors/${book.author.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {book.author.name}
                  </Link>
                </div>
              </div>

              {/* Description */}
              {book.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {truncateText(book.description, 150)}
                </p>
              )}

              {/* Rating and Reviews */}
              {rating && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-sm">
                      {renderStars(rating)}
                    </span>
                    <span className="ml-1 text-sm text-gray-600">
                      {rating.toFixed(1)}
                    </span>
                  </div>
                  {reviewCount > 0 && (
                    <span className="text-sm text-gray-500">
                      ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                    </span>
                  )}
                </div>
              )}

              {/* Publication Date */}
              {book.published_date && (
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Published {formatDateShort(book.published_date)}</span>
                </div>
              )}

              {/* Genres */}
              {book.metadata?.genres && book.metadata.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {book.metadata.genres.slice(0, 3).map((genre, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGenreColor(genre)}`}
                    >
                      {genre}
                    </span>
                  ))}
                  {book.metadata.genres.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{book.metadata.genres.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            <Link
              href={`/books/${book.id}`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BookListProps {
  books: Book[];
  loading?: boolean;
}

export function BookList({ books, loading }: BookListProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-4">
                <div className="w-24 h-32 bg-gray-300 rounded-md"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No books found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new book.
        </p>
        <div className="mt-6">
          <Link
            href="/books/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Book
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
