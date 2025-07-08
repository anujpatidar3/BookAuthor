"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { BookCard } from "@/components/BookCard";
import { AuthorCard } from "@/components/AuthorCard";
import { LoadingSpinner } from "@/components/Loading";
import { SearchBar, SelectInput } from "@/components";
import { SEARCH } from "@/lib/queries";
import { Book, Author } from "@/types";
import { Search } from "lucide-react";
import { NoSearchResultsBanner } from "@/components/NoSearchResultsBanner";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"all" | "books" | "authors">(
    "all"
  );

  const { data, loading } = useQuery(SEARCH, {
    variables: { query: searchTerm, type: searchType },
    skip: !searchTerm,
  });

  const books = data?.search?.books || [];
  const authors = data?.search?.authors || [];
  const isLoading = loading;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Search Books & Authors
        </h1>
        <p className="text-lg text-gray-600">
          Discover your next favorite book or learn about talented authors.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search for books or authors..."
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={() => {}}
              />
            </div>
            <div>
              <SelectInput
                name="searchType"
                value={searchType}
                onChange={(e) =>
                  setSearchType(e.target.value as "all" | "books" | "authors")
                }
                options={[
                  { value: "all", label: "All" },
                  { value: "books", label: "Books Only" },
                  { value: "authors", label: "Authors Only" },
                ]}
                placeholder="Select type"
                className="min-w-[140px]"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {isLoading && <LoadingSpinner />}

      {!isLoading && searchTerm && (
        <div className="space-y-8">
          {(searchType === "all" || searchType === "books") &&
            books.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Books</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {books.map((book: Book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </div>
            )}

          {(searchType === "all" || searchType === "authors") &&
            authors.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Authors
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {authors.map((author: Author) => (
                    <AuthorCard key={author.id} author={author} />
                  ))}
                </div>
              </div>
            )}

          {searchTerm && books.length === 0 && authors.length === 0 && (
            <NoSearchResultsBanner searchTerm={searchTerm} />
          )}
        </div>
      )}

      {!searchTerm && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">
            Enter a search term to find books and authors
          </p>
        </div>
      )}
    </main>
  );
}
