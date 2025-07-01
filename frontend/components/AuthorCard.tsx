import Link from 'next/link';
import Image from 'next/image';
import { User, Calendar, BookOpen, Star, Eye } from 'lucide-react';
import { Author } from '@/types';
import { formatYear, truncateText } from '@/lib/utils';

interface AuthorCardProps {
  author: Author;
}

export function AuthorCard({ author }: AuthorCardProps) {
  const profileImage = author.metadata?.profileImageUrl || '/placeholder-avatar.png';
  const bookCount = author.metadata?.totalBooks || author.books?.length || 0;
  const averageRating = author.metadata?.averageRating;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Author Photo */}
          <div className="flex-shrink-0">
            <div className="relative w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
              <Image
                src={profileImage}
                alt={`${author.name} photo`}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-avatar.png';
                }}
              />
            </div>
          </div>

          {/* Author Details */}
          <div className="flex-1 min-w-0">
            <div className="space-y-3">
              {/* Name */}
              <div>
                <Link 
                  href={`/authors/${author.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {author.name}
                </Link>
              </div>

              {/* Birth Date */}
              {author.born_date && (
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Born {formatYear(author.born_date)}</span>
                </div>
              )}

              {/* Biography */}
              {author.biography && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {truncateText(author.biography, 150)}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{bookCount} book{bookCount !== 1 ? 's' : ''}</span>
                </div>
                {averageRating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    <span>{averageRating.toFixed(1)} avg rating</span>
                  </div>
                )}
              </div>

              {/* Awards */}
              {author.metadata?.awards && author.metadata.awards.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {author.metadata.awards.slice(0, 2).map((award, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                    >
                      🏆 {award}
                    </span>
                  ))}
                  {author.metadata.awards.length > 2 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{author.metadata.awards.length - 2} more awards
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            <Link
              href={`/authors/${author.id}`}
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

interface AuthorListProps {
  authors: Author[];
  loading?: boolean;
}

export function AuthorList({ authors, loading }: AuthorListProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (authors.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No authors found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding a new author.
        </p>
        <div className="mt-6">
          <Link
            href="/authors/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add Author
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {authors.map((author) => (
        <AuthorCard key={author.id} author={author} />
      ))}
    </div>
  );
}
