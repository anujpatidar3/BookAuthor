"use client";

import { useState, useEffect, Suspense } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading";
import { BookForm, BookFormData } from "@/components/BookForm";
import { BookDetails, BookReviewSection } from "@/components";
import { GET_BOOK, GET_AUTHOR_NAMES } from "@/lib/queries";
import { UPDATE_BOOK } from "@/lib/mutations";
import { Book } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function BookDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = params.id as string;

  // Check if we should start in edit mode
  const editMode = searchParams.get("edit") === "true";

  // State for view/edit mode
  const [isEditMode, setIsEditMode] = useState(editMode);

  // Review modal state
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<{
    id: string;
    rating: number;
    comment: string;
    reviewerName: string;
  } | null>(null);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);

  // Form state for edit mode
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    description: "",
    publishedDate: "",
    authorId: "",
    coverImageUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data, loading, error, refetch } = useQuery(GET_BOOK, {
    variables: { id: bookId },
    errorPolicy: "all",
  });

  const { data: authorsData, loading: authorsLoading } = useQuery(
    GET_AUTHOR_NAMES,
    {
      variables: { page: 1, limit: 100 },
      skip: !isEditMode,
    }
  );

  const [updateBook, { loading: updating }] = useMutation(UPDATE_BOOK, {
    onCompleted: () => {
      setIsEditMode(false);
      setErrors({});
      const url = new URL(window.location.href);
      url.searchParams.delete("edit");
      window.history.replaceState({}, "", url.toString());
    },
    onError: (error) => {
      console.error("Error updating book:", error);
      setErrors({ general: "Failed to update book. Please try again." });
    },
  });

  // Populate form when book data is loaded or when entering edit mode
  useEffect(() => {
    if (data?.book) {
      const book = data.book;
      setFormData({
        title: book.title || "",
        description: book.description || "",
        publishedDate: book.published_date
          ? new Date(book.published_date).toISOString().split("T")[0]
          : "",
        authorId: book.author?.id?.toString() || "",
        coverImageUrl: book.metadata?.coverImageUrl || "",
      });
    }
  }, [data, isEditMode]);

  const handleReviewSuccess = () => {
    setReviewRefreshTrigger((prev) => prev + 1);
    refetch(); // Refresh book data to update review count
  };

  const handleEditReview = (review: {
    id: string;
    rating: number;
    comment: string;
    reviewerName: string;
  }) => {
    setEditingReview(review);
    setIsReviewFormOpen(true);
  };

  const handleCloseReviewForm = () => {
    setIsReviewFormOpen(false);
    setEditingReview(null);
  };

  const handleSubmit = async (formData: BookFormData) => {
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.authorId) newErrors.authorId = "Author is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    try {
      await updateBook({
        variables: {
          id: bookId,
          input: {
            title: formData.title.trim(),
            description: formData.description.trim() || null,
            published_date: formData.publishedDate
              ? new Date(formData.publishedDate).getTime()
              : null,
            author_id: parseInt(formData.authorId),
            coverImageUrl: formData.coverImageUrl || null,
          },
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ general: "Failed to update book. Please try again." });
    }
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit
      setErrors({});
      // Update URL to remove edit parameter
      const url = new URL(window.location.href);
      url.searchParams.delete("edit");
      window.history.replaceState({}, "", url.toString());
    } else {
      // Enter edit mode
      const url = new URL(window.location.href);
      url.searchParams.set("edit", "true");
      window.history.replaceState({}, "", url.toString());
    }
    setIsEditMode(!isEditMode);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !data?.book) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Book Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error?.message || "The book you are looking for does not exist."}
          </p>
          <Link
            href="/books"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  const book: Book = data.book;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {isEditMode ? (
          // Edit Form using BookForm component
          <BookForm
            mode="edit"
            initialData={formData}
            authors={authorsData?.authors?.authors || []}
            authorsLoading={authorsLoading}
            loading={updating}
            errors={errors}
            onSubmit={handleSubmit}
            onCancel={handleEditToggle}
          />
        ) : (
          // View Mode using BookDetails component
          <BookDetails
            book={book}
            onEdit={handleEditToggle}
            showEditButton={true}
          />
        )}
      </div>

      {/* Review Section */}
      {!isEditMode && (
        <BookReviewSection
          book={book}
          isReviewFormOpen={isReviewFormOpen}
          setIsReviewFormOpen={setIsReviewFormOpen}
          handleCloseReviewForm={handleCloseReviewForm}
          bookId={bookId}
          handleEditReview={handleEditReview}
          reviewRefreshTrigger={reviewRefreshTrigger}
          refetch={refetch}
          handleReviewSuccess={handleReviewSuccess}
          editingReview={editingReview}
        />
      )}
    </main>
  );
}

export default function BookDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      }
    >
      <BookDetailContent />
    </Suspense>
  );
}
