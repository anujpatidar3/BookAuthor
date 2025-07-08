"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Filter, SortAsc, SortDesc } from "lucide-react";
import { BookList } from "@/components/BookCard";
import { Pagination } from "@/components/Pagination";
import { LoadingState } from "@/components/Loading";
import { SearchBar } from "@/components/SearchBar";
import { SelectInput } from "@/components";
import { DateFilter } from "@/components/DateFilter";
import { FilterPanel } from "@/components/FilterPanel";
import { TextFilter } from "@/components/TextFilter";
import { GET_BOOKS } from "@/lib/queries";
import { BookConnection, BookFilterInput } from "@/types";
import { debounce } from "@/lib/utils";

export default function BooksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BookFilterInput>({});

  // Helper function to convert date strings to timestamps for GraphQL
  const processFiltersForGraphQL = (filters: BookFilterInput) => {
    // Create a copy without the date fields first
    const { published_date_from, published_date_to, ...baseFilters } = filters;

    const processedFilters: typeof baseFilters & {
      published_date_from?: number;
      published_date_to?: number;
    } = { ...baseFilters };

    // Convert date strings to timestamps
    if (published_date_from) {
      processedFilters.published_date_from = new Date(
        published_date_from
      ).getTime();
    }
    if (published_date_to) {
      processedFilters.published_date_to = new Date(
        published_date_to
      ).getTime();
    }

    return processedFilters;
  };

  const { data, loading, error, refetch } = useQuery<{ books: BookConnection }>(
    GET_BOOKS,
    {
      variables: {
        page: currentPage,
        limit: 12,
        filter: {
          ...processFiltersForGraphQL(filters),
          ...(searchTerm && { title: searchTerm }),
        },
        sortBy,
        sortOrder,
      },
      errorPolicy: "all",
    }
  );

  const handleSearch = debounce((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, 300);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(newSortBy);
      setSortOrder("DESC");
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: BookFilterInput) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Books
          </h1>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Books</h1>
        <p className="mt-2 text-gray-600">
          Discover and manage your book collection
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <SearchBar
          placeholder="Search books by title..."
          onSearch={handleSearch}
        />

        {/* Sort and Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Sort by:</span>
            <SelectInput
              name="sortBy"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              options={[
                { value: "createdAt", label: "Date Added" },
                { value: "title", label: "Title" },
                { value: "published_date", label: "Publication Date" },
              ]}
              placeholder="Sort by"
              className="min-w-[160px]"
            />
            <button
              onClick={() => setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              {sortOrder === "ASC" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          isOpen={showFilters}
          onClearAll={() => {
            setFilters({});
            setSearchTerm("");
            setCurrentPage(1);
          }}
        >
          <TextFilter
            label="Author"
            placeholder="Filter by author name"
            value={filters.author || ""}
            onChange={(value) =>
              handleFilterChange({ ...filters, author: value })
            }
          />
          <DateFilter
            label="Published From"
            value={filters.published_date_from || ""}
            onChange={(value) =>
              handleFilterChange({ ...filters, published_date_from: value })
            }
          />
          <DateFilter
            label="Published To"
            value={filters.published_date_to || ""}
            onChange={(value) =>
              handleFilterChange({ ...filters, published_date_to: value })
            }
          />
        </FilterPanel>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState message="Loading books..." />
      ) : (
        <>
          <BookList books={data?.books?.books || []} />

          {data?.books?.pagination && (
            <div className="mt-8">
              <Pagination
                pagination={data.books.pagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
}
