'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { Navigation } from '@/components/Navigation';
import { ImageUpload } from '@/components/ImageUpload';
import { LoadingState } from '@/components/Loading';
import { UPDATE_BOOK } from '@/lib/mutations';
import { GET_BOOK, GET_AUTHORS } from '@/lib/queries';
import { Author } from '@/types';

export default function EditBook() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    publishedDate: '',
    authorId: '',
    coverImageUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: bookData, loading: bookLoading, error: bookError } = useQuery(GET_BOOK, {
    variables: { id: bookId }
  });

  const { data: authorsData, loading: authorsLoading } = useQuery(GET_AUTHORS, {
    variables: { page: 1, limit: 100 }
  });

  const [updateBook, { loading: updating }] = useMutation(UPDATE_BOOK, {
    onCompleted: () => {
      router.push(`/books/${bookId}`);
    },
    onError: (error) => {
      console.error('Error updating book:', error);
      setErrors({ general: 'Failed to update book. Please try again.' });
    }
  });

  // Populate form when book data is loaded
  useEffect(() => {
    if (bookData?.book) {
      const book = bookData.book;
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
  }, [bookData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.authorId) newErrors.authorId = 'Author is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (bookLoading) return <LoadingState />;
  
  if (bookError || !bookData?.book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h1>
            <p className="text-gray-600 mb-4">The book you're looking for doesn't exist.</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Book</h1>
            <p className="mt-1 text-sm text-gray-600">
              Update the book details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.title ? 'border-red-300' : ''
                }`}
                placeholder="Enter book title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="authorId" className="block text-sm font-medium text-gray-700">
                Author *
              </label>
              <select
                id="authorId"
                name="authorId"
                value={formData.authorId}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.authorId ? 'border-red-300' : ''
                }`}
                disabled={authorsLoading}
              >
                <option value="">Select an author</option>
                {authorsData?.authors?.authors?.map((author: Author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
              {errors.authorId && (
                <p className="mt-1 text-sm text-red-600">{errors.authorId}</p>
              )}
              {authorsLoading && (
                <p className="mt-1 text-sm text-gray-500">Loading authors...</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter book description"
              />
            </div>

            <div>
              <ImageUpload
                type="book"
                label="Book Cover"
                value={formData.coverImageUrl}
                onChange={(url) => setFormData(prev => ({ ...prev, coverImageUrl: url || '' }))}
                disabled={updating}
              />
            </div>

            <div>
              <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700">
                Published Date
              </label>
              <input
                type="date"
                id="publishedDate"
                name="publishedDate"
                value={formData.publishedDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Update Book'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
