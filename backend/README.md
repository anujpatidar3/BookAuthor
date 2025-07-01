# BookAuthor Backend

A comprehensive GraphQL API for managing books and authors with PostgreSQL and MongoDB integration.

## Features

- **GraphQL API** with Apollo Server v4
- **PostgreSQL** with Sequelize ORM for core data (books, authors)
- **MongoDB** with Mongoose for metadata (reviews, ratings, additional info)
- **Authentication & Authorization** (JWT-based)
- **Rate limiting** and security middleware
- **Pagination** and filtering for all queries
- **Real-time features** with GraphQL subscriptions

## Tech Stack

- **Node.js** with TypeScript
- **Apollo Server** v4 with Express integration
- **PostgreSQL** with Sequelize ORM
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Helmet** for security
- **Rate limiting** for API protection

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- MongoDB (v4.4 or higher)

### Installation

1. Clone the repository and navigate to the backend directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your database credentials and configuration

5. Start the development server:
   ```bash
   npm run dev
   ```

The GraphQL playground will be available at `http://localhost:4000/graphql`

### Environment Variables

```env
NODE_ENV=development
PORT=4000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/bookauthor_db
MONGODB_URI=mongodb://localhost:27017/bookauthor_metadata

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run type-check` - Run TypeScript type checking

## API Documentation

### Core Models

#### Author
- `id`: Unique identifier
- `name`: Author name (required)
- `biography`: Author biography (optional)
- `born_date`: Birth date (optional)

#### Book
- `id`: Unique identifier
- `title`: Book title (required)
- `description`: Book description (optional)
- `published_date`: Publication date (optional)
- `author_id`: Foreign key to Author (required)

### GraphQL Queries

#### Books
```graphql
query GetBooks($page: Int, $limit: Int, $filter: BookFilterInput) {
  books(page: $page, limit: $limit, filter: $filter) {
    books {
      id
      title
      description
      published_date
      author {
        id
        name
      }
      metadata {
        averageRating
        totalReviews
        genres
      }
    }
    pagination {
      currentPage
      totalPages
      totalItems
      hasNextPage
    }
  }
}
```

#### Authors
```graphql
query GetAuthors($page: Int, $limit: Int) {
  authors(page: $page, limit: $limit) {
    authors {
      id
      name
      biography
      born_date
      books {
        id
        title
      }
    }
    pagination {
      currentPage
      totalPages
      totalItems
    }
  }
}
```

### GraphQL Mutations

#### Create Book
```graphql
mutation CreateBook($input: BookInput!) {
  createBook(input: $input) {
    id
    title
    description
    author {
      name
    }
  }
}
```

#### Create Author
```graphql
mutation CreateAuthor($input: AuthorInput!) {
  createAuthor(input: $input) {
    id
    name
    biography
    born_date
  }
}
```

### Filtering and Pagination

All list queries support:
- **Pagination**: `page` and `limit` parameters
- **Sorting**: `sortBy` and `sortOrder` parameters
- **Filtering**: Type-specific filter objects

Example filters:
- Books: Filter by title, author name, publication date range, genres, minimum rating
- Authors: Filter by name, birth year range

## Database Schema

### PostgreSQL (Core Data)
- `authors` table with basic author information
- `books` table with basic book information and author foreign key

### MongoDB (Metadata)
- `bookmetadata` collection for additional book data (genres, ratings, etc.)
- `authormetadata` collection for additional author data (social media, awards, etc.)
- `reviews` collection for user reviews and ratings

## Security Features

- Rate limiting on GraphQL endpoint
- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- Error handling and logging

## Health Check

The API includes a health check endpoint at `/health` that returns server status and timestamp.

## Development

The project uses:
- TypeScript for type safety
- Nodemon for development hot reload
- Sequelize for PostgreSQL ORM
- Mongoose for MongoDB ODM
- Apollo Server for GraphQL implementation

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database URLs
3. Set secure JWT secret
4. Configure CORS for production frontend URL
5. Run `npm run build && npm start`
