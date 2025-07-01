import Link from 'next/link';
import { BookOpen, Users, Plus, TrendingUp } from 'lucide-react';
import { Navigation } from '../components/Navigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            BookAuthor
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            A comprehensive platform for managing books and authors with reviews and ratings.
            Discover, organize, and share your literary world.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/books"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Browse Books
            </Link>
            <Link
              href="/authors"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
            >
              Explore Authors <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/books"
              className="group relative rounded-lg border border-gray-300 bg-white p-6 hover:shadow-lg transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                  <BookOpen className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                  Manage Books
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Add, edit, and organize your book collection with detailed information and metadata.
                </p>
              </div>
            </Link>

            <Link
              href="/authors"
              className="group relative rounded-lg border border-gray-300 bg-white p-6 hover:shadow-lg transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600 group-hover:bg-green-100">
                  <Users className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600">
                  Author Profiles
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Create comprehensive author profiles with biographies, awards, and social links.
                </p>
              </div>
            </Link>

            <Link
              href="/books/new"
              className="group relative rounded-lg border border-gray-300 bg-white p-6 hover:shadow-lg transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-600 group-hover:bg-purple-100">
                  <Plus className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-600">
                  Add Content
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Quickly add new books and authors to expand your literary database.
                </p>
              </div>
            </Link>

            <Link
              href="/search"
              className="group relative rounded-lg border border-gray-300 bg-white p-6 hover:shadow-lg transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-orange-50 text-orange-600 group-hover:bg-orange-100">
                  <TrendingUp className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-orange-600">
                  Discover & Search
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Find books and authors with powerful search and filtering capabilities.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className="bg-white rounded-lg shadow px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Platform Overview
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">📚</div>
                <div className="mt-2 text-lg font-medium text-gray-900">Books</div>
                <div className="text-sm text-gray-500">
                  Comprehensive book management with metadata, reviews, and ratings
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">👥</div>
                <div className="mt-2 text-lg font-medium text-gray-900">Authors</div>
                <div className="text-sm text-gray-500">
                  Detailed author profiles with biographies and social information
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">⭐</div>
                <div className="mt-2 text-lg font-medium text-gray-900">Reviews</div>
                <div className="text-sm text-gray-500">
                  User reviews and ratings system for community engagement
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
