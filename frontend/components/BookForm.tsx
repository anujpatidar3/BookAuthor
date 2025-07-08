'use client';

import { useState, useEffect } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { TextInput } from '@/components/TextInput';
import { TextArea } from '@/components/TextArea';
import { SelectInput } from '@/components/SelectInput';
import { DateInput } from '@/components/DateInput';
import { Save, X } from 'lucide-react';
import { Author } from '@/types';

export interface BookFormData {
  title: string;
  description: string;
  publishedDate: string;
  authorId: string;
  coverImageUrl: string;
}

interface BookFormProps {
  mode: 'create' | 'edit';
  initialData?: BookFormData;
  authors?: Author[];
  authorsLoading?: boolean;
  loading?: boolean;
  errors?: Record<string, string>;
  onSubmit: (data: BookFormData) => void;
  onCancel: () => void;
}

export function BookForm({
  mode,
  initialData,
  authors = [],
  authorsLoading = false,
  loading = false,
  errors = {},
  onSubmit,
  onCancel
}: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>(
    initialData || {
      title: '',
      description: '',
      publishedDate: '',
      authorId: '',
      coverImageUrl: ''
    }
  );

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isCreate = mode === 'create';
  const title = isCreate ? 'Add New Book' : 'Edit Book';
  const submitText = isCreate ? 'Create Book' : 'Save Changes';
  const loadingText = isCreate ? 'Creating...' : 'Saving...';

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {isCreate && (
              <p className="mt-1 text-sm text-gray-600">
                Fill in the details below to add a new book to the collection.
              </p>
            )}
          </div>
          {!isCreate && (
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
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
          options={authors.map((author: Author) => ({
            value: author.id.toString(),
            label: author.name
          }))}
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
            disabled={loading}
          />
        </div>

        <DateInput
          label="Published Date"
          name="publishedDate"
          value={formData.publishedDate}
          onChange={handleChange}
          max={new Date().toISOString().split('T')[0]}
        />

        <div className={`flex ${isCreate ? 'justify-end' : 'justify-start'} space-x-3 pt-6 border-t border-gray-200`}>
          {isCreate && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isCreate && <Save className="h-4 w-4 mr-2" />}
            {loading ? loadingText : submitText}
          </button>
        </div>
      </form>
    </div>
  );
}
