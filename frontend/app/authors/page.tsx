'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { AuthorList } from '@/components/AuthorCard';
import { Pagination } from '@/components/Pagination';
import { LoadingState } from '@/components/Loading';
import { SearchBar } from '@/components/SearchBar';
import { DateFilter } from '@/components/DateFilter';
import { FilterPanel } from '@/components/FilterPanel';
import { GET_AUTHORS } from '@/lib/queries';
import { AuthorConnection, AuthorFilterInput } from '@/types';
import { debounce } from '@/lib/utils';

export default function AuthorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AuthorFilterInput>({});

  const { data, loading, error, refetch } = useQuery<{ authors: AuthorConnection }>(GET_AUTHORS, {
    variables: {
      page: currentPage,
      limit: 12,
      filter: {
        ...filters,
        ...(searchTerm && { name: searchTerm }),
      },
      sortBy,
      sortOrder,
    },
    errorPolicy: 'all',
  });

  const handleSearch = debounce((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, 300);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(newSortBy);
      setSortOrder('DESC');
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: AuthorFilterInput) => {
    // Validate year inputs before setting filters
    const validatedFilters = { ...newFilters };
    
    // Only include born_year_from if it's a valid 4-digit year
    if (validatedFilters.born_year_from) {
      if (validatedFilters.born_year_from < 1000 || validatedFilters.born_year_from > 2100) {
        delete validatedFilters.born_year_from;
      }
    }
    
    // Only include born_year_to if it's a valid 4-digit year
    if (validatedFilters.born_year_to) {
      if (validatedFilters.born_year_to < 1000 || validatedFilters.born_year_to > 2100) {
        delete validatedFilters.born_year_to;
      }
    }
    
    setFilters(validatedFilters);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Authors</h1>
            <p className="text-gray-600 mb-6">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Authors</h1>
          <p className="mt-2 text-gray-600">
            Explore and manage author profiles
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <SearchBar
            placeholder="Search authors by name..."
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
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="createdAt">Date Added</option>
                <option value="name">Name</option>
                <option value="born_date">Birth Date</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                {sortOrder === 'ASC' ? (
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
              setSearchTerm('');
              setCurrentPage(1);
            }}
          >
            <DateFilter
              label="Born From (Year)"
              placeholder="e.g., 1950"
              type="number"
              min={1800}
              max={new Date().getFullYear() + 1}
              value={filters.born_year_from?.toString() || '1800'}
              onChange={(value) => {
                const year = parseInt(value) || undefined;
                handleFilterChange({ ...filters, born_year_from: year });
              }}
            />
            <DateFilter
              label="Born To (Year)"
              placeholder="e.g., 1990"
              type="number"
              min={1000}
              max={new Date().getFullYear() + 1}
              value={filters.born_year_to?.toString() || '2025'}
              onChange={(value) => {
                const year = parseInt(value) || undefined;
                handleFilterChange({ ...filters, born_year_to: year });
              }}
            />
          </FilterPanel>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState message="Loading authors..." />
        ) : (
          <>
            <AuthorList authors={data?.authors?.authors || []} />
            
            {data?.authors?.pagination && (
              <div className="mt-8">
                <Pagination
                  pagination={data.authors.pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
