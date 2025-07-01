import { gql } from '@apollo/client';

// Book Queries
export const GET_BOOKS = gql`
  query GetBooks(
    $page: Int
    $limit: Int
    $filter: BookFilterInput
    $sortBy: String
    $sortOrder: String
  ) {
    books(
      page: $page
      limit: $limit
      filter: $filter
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
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
          coverImageUrl
        }
        createdAt
      }
      pagination {
        currentPage
        totalPages
        totalItems
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

export const GET_BOOK = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      id
      title
      description
      published_date
      author {
        id
        name
        biography
      }
      metadata {
        genres
        tags
        isbn
        pageCount
        language
        coverImageUrl
        averageRating
        totalReviews
        totalRatings
      }
      reviews {
        id
        rating
        comment
        reviewerName
        helpful
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

// Author Queries
export const GET_AUTHORS = gql`
  query GetAuthors(
    $page: Int
    $limit: Int
    $filter: AuthorFilterInput
    $sortBy: String
    $sortOrder: String
  ) {
    authors(
      page: $page
      limit: $limit
      filter: $filter
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      authors {
        id
        name
        biography
        born_date
        metadata {
          totalBooks
          averageRating
          profileImageUrl
        }
        createdAt
      }
      pagination {
        currentPage
        totalPages
        totalItems
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

export const GET_AUTHOR = gql`
  query GetAuthor($id: ID!) {
    author(id: $id) {
      id
      name
      biography
      born_date
      books {
        id
        title
        description
        published_date
        metadata {
          averageRating
          totalReviews
          coverImageUrl
        }
      }
      metadata {
        socialMedia {
          twitter
          facebook
          website
        }
        profileImageUrl
        awards
        totalBooks
        averageRating
        followers
      }
      createdAt
      updatedAt
    }
  }
`;

// Search Queries
export const SEARCH_BOOKS = gql`
  query SearchBooks($query: String!) {
    searchBooks(query: $query) {
      id
      title
      description
      author {
        id
        name
      }
      metadata {
        averageRating
        coverImageUrl
      }
    }
  }
`;

export const SEARCH_AUTHORS = gql`
  query SearchAuthors($query: String!) {
    searchAuthors(query: $query) {
      id
      name
      biography
      metadata {
        totalBooks
        profileImageUrl
      }
    }
  }
`;

// Reviews Query
export const GET_REVIEWS = gql`
  query GetReviews($bookId: Int!, $page: Int, $limit: Int) {
    reviews(bookId: $bookId, page: $page, limit: $limit) {
      id
      rating
      comment
      reviewerName
      helpful
      createdAt
    }
  }
`;
