'use client';

import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from '@/components/Navigation';
import { BookCard } from '@/components/BookCard';
import { LoadingSpinner } from '@/components/Loading';
import { GET_AUTHOR, GET_BOOKS } from '@/lib/queries';
import { Author, Book } from '@/types';
import { User, Calendar, BookOpen, Edit } from 'lucide-react';

export default function AuthorDetail() {
  const params = useParams();
  const authorId = params.id as string;

  const { data: authorData, loading: authorLoading, error: authorError } = useQuery(GET_AUTHOR, {
    variables: { id: authorId }
  });

  const { data: booksData, loading: booksLoading } = useQuery(GET_BOOKS, {
    variables: {
      page: 1,
      limit: 20,
      filter: { author_id: parseInt(authorId) }
    }
  });

  if (authorLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (authorError || !authorData?.author) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Author Not Found</h1>
            <p className="text-gray-600 mb-6">The author you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/authors"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Authors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const author: Author = authorData.author;
  const books: Book[] = booksData?.books?.books || [];
  console.log('Author Data:', authorData);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Author Header */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-8">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {author.metadata?.profileImageUrl ? (
                        <Image
                          src={author.metadata.profileImageUrl}
                          alt={`${author.name} profile`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <User className="h-10 w-10 text-gray-400" />
                      )}
                      <User className="h-10 w-10 text-gray-400 hidden" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h1 className="text-3xl font-bold text-gray-900">{author.name}</h1>
                    {author.born_date && (
                      <div className="flex items-center mt-2 text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Born: {new Date(author.born_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href={`/authors/${author.id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Author
                </Link>
              </div>
            </div>

            {author.biography && (
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-3">Biography</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {author.biography}
                </p>
              </div>
            )}

            {/* Metadata */}
            {author.metadata && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Total Books</p>
                      <p className="text-lg font-bold text-blue-600">
                        {author.metadata.totalBooks || books.length}
                      </p>
                    </div>
                  </div>
                </div>
                {author.metadata.averageRating && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-2">⭐</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Average Rating</p>
                        <p className="text-lg font-bold text-yellow-600">
                          {author.metadata.averageRating.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Member Since</p>
                    <p className="text-lg font-bold text-gray-600">
                      {new Date(author.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Books Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Books by {author.name}
              </h2>
              <Link
                href={`/books/new?authorId=${author.id}`}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Book
              </Link>
            </div>
          </div>

          <div className="p-6">
            {booksLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : books.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book: Book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Books Yet</h3>
                <p className="text-gray-500 mb-4">
                  {author.name} hasn't published any books in our collection yet.
                </p>
                <Link
                  href={`/books/new?authorId=${author.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add First Book
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
