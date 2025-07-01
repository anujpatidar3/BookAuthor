'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { Navigation } from '@/components/Navigation';
import { ImageUpload } from '@/components/ImageUpload';
import { CREATE_AUTHOR } from '@/lib/mutations';

export default function NewAuthor() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    biography: '',
    bornDate: '',
    profileImageUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createAuthor, { loading: creating }] = useMutation(CREATE_AUTHOR, {
    onCompleted: (data) => {
      router.push(`/authors/${data.createAuthor.id}`);
    },
    onError: (error) => {
      console.error('Error creating author:', error);
      setErrors({ general: 'Failed to create author. Please try again.' });
    }
  });

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
      await createAuthor({
        variables: {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Add New Author</h1>
            <p className="mt-1 text-sm text-gray-600">
              Fill in the details below to add a new author to the collection.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.name ? 'border-red-300' : ''
                }`}
                placeholder="Enter author name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="biography" className="block text-sm font-medium text-gray-700">
                Biography
              </label>
              <textarea
                id="biography"
                name="biography"
                rows={6}
                value={formData.biography}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter author biography"
              />
            </div>

            <div>
              <ImageUpload
                type="author"
                label="Profile Image"
                value={formData.profileImageUrl}
                onChange={(url) => setFormData(prev => ({ ...prev, profileImageUrl: url || '' }))}
                disabled={creating}
              />
            </div>

            <div>
              <label htmlFor="bornDate" className="block text-sm font-medium text-gray-700">
                Born Date
              </label>
              <input
                type="date"
                id="bornDate"
                name="bornDate"
                value={formData.bornDate}
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
                disabled={creating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Create Author'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
