'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BookCard } from '@/components/BookCard';
import { LoadingSpinner } from '@/components/Loading';
import { ImageUpload } from '@/components/ImageUpload';
import { TextInput } from '@/components/TextInput';
import { TextArea } from '@/components/TextArea';
import { DateInput } from '@/components/DateInput';
import { GET_AUTHOR, GET_BOOKS } from '@/lib/queries';
import { DELETE_AUTHOR, UPDATE_AUTHOR } from '@/lib/mutations';
import { Author, Book } from '@/types';
import { User, Calendar, BookOpen, Edit, Trash2, Save, X } from 'lucide-react';

export default function AuthorDetail() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authorId = params.id as string;
  
  // Check if we should start in edit mode
  const editMode = searchParams.get('edit') === 'true';

  // State for view/edit mode
  const [isEditMode, setIsEditMode] = useState(editMode);
  
  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form state for edit mode
  const [formData, setFormData] = useState({
    name: '',
    biography: '',
    bornDate: '',
    profileImageUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mutations
  const [deleteAuthor] = useMutation(DELETE_AUTHOR, {
    onCompleted: () => {
      router.push('/authors');
    },
    onError: (error) => {
      console.error('Error deleting author:', error);
      alert(error.message);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    },
  });

  const [updateAuthor, { loading: updating }] = useMutation(UPDATE_AUTHOR, {
    onCompleted: () => {
      setIsEditMode(false);
      setErrors({});
      // Update URL to remove edit parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('edit');
      window.history.replaceState({}, '', url.toString());
    },
    onError: (error) => {
      console.error('Error updating author:', error);
      setErrors({ general: 'Failed to update author. Please try again.' });
    }
  });

  // Delete handler
  const handleDeleteAuthor = async () => {
    setIsDeleting(true);
    try {
      await deleteAuthor({
        variables: { id: authorId },
      });
    } catch {
      // Error handling is done in the mutation's onError callback
    }
  };

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

  // Populate form when author data is loaded or when entering edit mode
  useEffect(() => {
    if (authorData?.author) {
      const author = authorData.author;
      setFormData({
        name: author.name || '',
        biography: author.biography || '',
        bornDate: author.born_date 
          ? new Date(author.born_date).toISOString().split('T')[0] 
          : '',
        profileImageUrl: author.metadata?.profileImageUrl || ''
      });
    }
  }, [authorData, isEditMode]);

  // Form handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updateAuthor({
        variables: {
          id: authorId,
          input: {
            name: formData.name.trim(),
            biography: formData.biography.trim() || null,
            born_date: formData.bornDate ? new Date(formData.bornDate).getTime() : null,
            profileImageUrl: formData.profileImageUrl || null
          }
        }
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit - reset form data
      if (authorData?.author) {
        const author = authorData.author;
        setFormData({
          name: author.name || '',
          biography: author.biography || '',
          bornDate: author.born_date 
            ? new Date(author.born_date).toISOString().split('T')[0] 
            : '',
          profileImageUrl: author.metadata?.profileImageUrl || ''
        });
      }
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

  if (authorLoading) {
    return (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
    );
  }

  if (authorError || !authorData?.author) {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Author Not Found</h1>
            <p className="text-gray-600 mb-6">The author you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link
              href="/authors"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Authors
            </Link>
          </div>
        </div>
    );
  }

  const author: Author = authorData.author;
  const books: Book[] = booksData?.books?.books || [];

  return (
    <div className="min-h-screen bg-gray-50">      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Author Header */}
        <div className="bg-white shadow rounded-lg mb-8">
          {isEditMode ? (
            // Edit Form
            <form onSubmit={handleSubmit} className="px-6 py-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Edit Author</h1>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    disabled={updating}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              <div className="space-y-6">
                <TextInput
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  required
                  error={errors.name}
                />

                <TextArea
                  label="Biography"
                  name="biography"
                  value={formData.biography}
                  onChange={handleChange}
                  placeholder="Enter author biography"
                  rows={6}
                />

                <div>
                  <ImageUpload
                    type="author"
                    label="Profile Image"
                    value={formData.profileImageUrl}
                    onChange={(url) => setFormData(prev => ({ ...prev, profileImageUrl: url || '' }))}
                    disabled={updating}
                  />
                </div>

                <DateInput
                  label="Born Date"
                  name="bornDate"
                  value={formData.bornDate}
                  onChange={handleChange}
                />
              </div>
            </form>
          ) : (
            // View Mode
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
                  <div className="flex space-x-3">
                    <button
                      onClick={handleEditToggle}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Author
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? 'Deleting...' : 'Delete Author'}
                    </button>
                  </div>
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
          )}
        </div>

        {/* Books Section - Only show in view mode */}
        {!isEditMode && (
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
                    {author.name} hasn&apos;t published any books in our collection yet.
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
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-2">Delete Author</h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete <strong>{author.name}</strong>? This action cannot be undone.
                    {books.length > 0 && (
                      <span className="block mt-2 text-red-600 font-medium">
                        Note: This author has {books.length} book{books.length !== 1 ? 's' : ''} associated. 
                        Please delete or reassign the books first.
                      </span>
                    )}
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAuthor}
                      className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                      disabled={isDeleting || books.length > 0}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
