import Link from 'next/link';
import { BookOpen, Users, Plus, TrendingUp } from 'lucide-react';
import { FeatureCard } from '@/components/FeatureCard';
import { StatCard } from '@/components/StatCard';

export default function Home() {
  const featureCards = [
    {
      href: '/books',
      icon: BookOpen,
      title: 'Manage Books',
      description: 'Add, edit, and organize your book collection with detailed information and metadata.',
      iconColor: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
      titleColor: 'group-hover:text-blue-600'
    },
    {
      href: '/authors',
      icon: Users,
      title: 'Author Profiles',
      description: 'Create comprehensive author profiles with biographies, awards, and social links.',
      iconColor: 'bg-green-50 text-green-600 group-hover:bg-green-100',
      titleColor: 'group-hover:text-green-600'
    },
    {
      href: '/books/new',
      icon: Plus,
      title: 'Add Content',
      description: 'Quickly add new books and authors to expand your literary database.',
      iconColor: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
      titleColor: 'group-hover:text-purple-600'
    },
    {
      href: '/search',
      icon: TrendingUp,
      title: 'Discover & Search',
      description: 'Find books and authors with powerful search and filtering capabilities.',
      iconColor: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
      titleColor: 'group-hover:text-orange-600'
    }
  ];

  const statCards = [
    {
      emoji: '📚',
      title: 'Books',
      description: 'Comprehensive book management with metadata, reviews, and ratings',
      color: 'text-blue-600'
    },
    {
      emoji: '👥',
      title: 'Authors',
      description: 'Detailed author profiles with biographies and social information',
      color: 'text-green-600'
    },
    {
      emoji: '⭐',
      title: 'Reviews',
      description: 'User reviews and ratings system for community engagement',
      color: 'text-purple-600'
    }
  ];

  return (
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
            {featureCards.map((card, index) => (
              <FeatureCard
                key={index}
                href={card.href}
                icon={card.icon}
                title={card.title}
                description={card.description}
                iconColor={card.iconColor}
                titleColor={card.titleColor}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className="bg-white rounded-lg shadow px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Platform Overview
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {statCards.map((stat, index) => (
                <StatCard
                  key={index}
                  emoji={stat.emoji}
                  title={stat.title}
                  description={stat.description}
                  color={stat.color}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
  );
}
