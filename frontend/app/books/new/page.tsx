'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { BookForm, BookFormData } from '@/components/BookForm';
import { CREATE_BOOK } from '@/lib/mutations';
import { GET_AUTHOR_NAMES } from '@/lib/queries';
import { LoadingSpinner } from '@/components/Loading';

function NewBookForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Get initial author ID from URL params (if navigated from author page)
  const initialAuthorId = searchParams.get('authorId') || '';
  
  const initialData: BookFormData = {
    title: '',
    description: '',
    publishedDate: '',
    authorId: initialAuthorId,
    coverImageUrl: ''
  };

  const { data: authorsData, loading: authorsLoading } = useQuery(GET_AUTHOR_NAMES, {
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
      setErrors({ general: 'Failed to create book. Please try again.' });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BookForm
          mode="create"
          initialData={initialData}
          authors={authorsData?.authors?.authors || []}
          authorsLoading={authorsLoading}
          loading={creating}
          errors={errors}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </main>
  );
}

export default function NewBook() {
  return (
    <Suspense fallback={
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </main>
    }>
      <NewBookForm />
    </Suspense>
  );
}
