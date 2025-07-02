'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { Navigation } from '@/components/Navigation';
import { ImageUpload } from '@/components/ImageUpload';
import { TextInput } from '@/components/TextInput';
import { TextArea } from '@/components/TextArea';
import { SelectInput } from '@/components/SelectInput';
import { DateInput } from '@/components/DateInput';
import { CREATE_BOOK } from '@/lib/mutations';
import { GET_AUTHORS } from '@/lib/queries';
import { Author } from '@/types';

export default function NewBook() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    publishedDate: '',
    authorId: '',
    coverImageUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: authorsData, loading: authorsLoading } = useQuery(GET_AUTHORS, {
    variables: { page: 1, limit: 100 }
  });

  const [createBook, { loading: creating }] = useMutation(CREATE_BOOK, {
    onCompleted: (data) => {
      router.push(`/books/${data.createBook.id}`);
    },
    onError: (error) => {
      console.error('Error creating book:', error);
      setErrors({ general: 'Failed to create book. Please try again.' });
    }
  });

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
      await createBook({
        variables: {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Add New Book</h1>
            <p className="mt-1 text-sm text-gray-600">
              Fill in the details below to add a new book to the collection.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <TextInput
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              required
              error={errors.title}
            />

            <SelectInput
              label="Author"
              name="authorId"
              value={formData.authorId}
              onChange={handleChange}
              options={authorsData?.authors?.authors?.map((author: Author) => ({
                value: author.id.toString(),
                label: author.name
              })) || []}
              placeholder="Select an author"
              required
              error={errors.authorId}
              loading={authorsLoading}
              loadingText="Loading authors..."
            />

            <TextArea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter book description"
              rows={4}
            />

            <div>
              <ImageUpload
                type="book"
                label="Book Cover"
                value={formData.coverImageUrl}
                onChange={(url) => setFormData(prev => ({ ...prev, coverImageUrl: url || '' }))}
                disabled={creating}
              />
            </div>

            <DateInput
              label="Published Date"
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />

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
                disabled={creating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Create Book'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
