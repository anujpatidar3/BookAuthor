# BookAuthor Frontend

A modern Next.js frontend application for the BookAuthor platform, built with React, TypeScript, Apollo Client, and Tailwind CSS.

## Features

- **Modern UI** with responsive design using Tailwind CSS
- **GraphQL Integration** with Apollo Client for efficient data fetching
- **Real-time Updates** and optimistic UI updates
- **Advanced Search & Filtering** with debounced input
- **Pagination** for large datasets
- **Form Management** with React Hook Form and Zod validation
- **TypeScript** for type safety and better developer experience

## Tech Stack

- **Next.js 15** with App Router
- **React 19** with modern hooks
- **TypeScript** for type safety
- **Apollo Client** for GraphQL integration
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Zod** for schema validation
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running at `http://localhost:4000/graphql`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── books/             # Books pages
│   ├── authors/           # Authors pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Apollo Client provider
├── components/            # Reusable UI components
│   ├── Navigation.tsx     # Main navigation
│   ├── BookCard.tsx       # Book display components
│   ├── AuthorCard.tsx     # Author display components
│   ├── Loading.tsx        # Loading states
│   └── Pagination.tsx     # Pagination controls
├── lib/                   # Utilities and configurations
│   ├── apollo-client.ts   # Apollo Client setup
│   ├── queries.ts         # GraphQL queries
│   ├── mutations.ts       # GraphQL mutations
│   └── utils.ts           # Utility functions
├── types/                 # TypeScript type definitions
│   └── index.ts           # Shared types
└── public/               # Static assets
```

## Key Features

### 🏠 Home Page
- Hero section with platform overview
- Feature cards linking to main sections
- Statistics dashboard
- Modern, responsive design

### 📚 Books Management
- **List View**: Paginated book list with search and filtering
- **Search**: Real-time search by title, author, and description
- **Filters**: Publication date range, author, genre, rating
- **Sorting**: By date added, title, publication date

### 👥 Authors Management
- **List View**: Paginated author list with search and filtering
- **Search**: Real-time search by name and biography
- **Filters**: Birth year range
- **Sorting**: By date added, name, birth date

### 🔍 Advanced Features
- **Pagination**: Efficient pagination with page numbers
- **Loading States**: Skeleton screens and loading spinners
- **Error Handling**: Graceful error states with retry options
- **Responsive Design**: Mobile-first responsive layout
- **Performance**: Optimized queries and caching

## GraphQL Integration

The frontend uses Apollo Client for GraphQL integration with features like:

- **Automatic Caching**: Intelligent caching with cache policies
- **Optimistic Updates**: Immediate UI updates for better UX
- **Error Handling**: Comprehensive error handling
- **Loading States**: Built-in loading state management

## Styling with Tailwind CSS

The application uses Tailwind CSS for styling with:

- **Responsive Design**: Mobile-first approach
- **Design System**: Consistent spacing, colors, and typography
- **Custom Components**: Reusable styled components

## Deployment

The frontend can be deployed to Vercel, Netlify, or any other platform that supports Next.js.

## Environment Variables

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

Make sure the backend is running before starting the frontend development server.
