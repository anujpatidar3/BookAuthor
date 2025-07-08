'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { AuthorForm, AuthorFormData } from '@/components/AuthorForm';
import { CREATE_AUTHOR } from '@/lib/mutations';

export default function NewAuthor() {
  const router = useRouter();
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

  const handleSubmit = async (formData: AuthorFormData) => {
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

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
      setErrors({ general: 'Failed to create author. Please try again.' });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AuthorForm
          mode="create"
          loading={creating}
          errors={errors}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </main>
  );
}
