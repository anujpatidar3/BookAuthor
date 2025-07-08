import { gql } from "@apollo/client";
import {
  BOOK_CARD_FRAGMENT,
  BOOK_FULL_FRAGMENT,
  AUTHOR_CARD_FRAGMENT,
  AUTHOR_FULL_FRAGMENT,
  REVIEW_FRAGMENT,
  PAGINATION_FRAGMENT,
  SEARCH_BOOK_FRAGMENT,
  SEARCH_AUTHOR_FRAGMENT,
} from "./fragments";

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
        ...BookCard
      }
      pagination {
        ...Pagination
      }
    }
  }
  ${BOOK_CARD_FRAGMENT}
  ${PAGINATION_FRAGMENT}
`;

export const GET_BOOK = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      ...BookFull
      reviews {
        ...Review
      }
    }
  }
  ${BOOK_FULL_FRAGMENT}
  ${REVIEW_FRAGMENT}
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
        ...AuthorCard
      }
      pagination {
        ...Pagination
      }
    }
  }
  ${AUTHOR_CARD_FRAGMENT}
  ${PAGINATION_FRAGMENT}
`;

// Optimized query for authors without books (for performance)
export const GET_AUTHORS_BASIC = gql`
  query GetAuthorsBasic(
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
        ...AuthorCard
      }
      pagination {
        ...Pagination
      }
    }
  }
  ${AUTHOR_CARD_FRAGMENT}
  ${PAGINATION_FRAGMENT}
`;

// Query to get only author names (for dropdown)
export const GET_AUTHOR_NAMES = gql`
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
      }
    }
  }
`;

// Query for author without books (for performance when books aren't needed)
export const GET_AUTHOR_BASIC = gql`
  query GetAuthorBasic($id: ID!) {
    author(id: $id) {
      ...AuthorFull
    }
  }
  ${AUTHOR_FULL_FRAGMENT}
`;

// Separate query for getting books by author (can be used independently)
export const GET_BOOKS_BY_AUTHOR = gql`
  query GetBooksByAuthor(
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
        ...BookCard
      }
      pagination {
        ...Pagination
      }
    }
  }
  ${BOOK_CARD_FRAGMENT}
  ${PAGINATION_FRAGMENT}
`;

// Search Queries
export const SEARCH_BOOKS = gql`
  query SearchBooks($query: String!) {
    searchBooks(query: $query) {
      ...SearchBook
    }
  }
  ${SEARCH_BOOK_FRAGMENT}
`;

export const SEARCH_AUTHORS = gql`
  query SearchAuthors($query: String!) {
    searchAuthors(query: $query) {
      ...SearchAuthor
    }
  }
  ${SEARCH_AUTHOR_FRAGMENT}
`;

export const SEARCH = gql`
  query Search($query: String!, $type: String = "all") {
    search(query: $query, type: $type) {
      books {
        ...SearchBook
      }
      authors {
        ...SearchAuthor
      }
    }
  }
  ${SEARCH_BOOK_FRAGMENT}
  ${SEARCH_AUTHOR_FRAGMENT}
`;

// Reviews Query
export const GET_REVIEWS = gql`
  query GetReviews($bookId: Int!, $page: Int, $limit: Int) {
    reviews(bookId: $bookId, page: $page, limit: $limit) {
      reviews {
        ...Review
      }
      pagination {
        ...Pagination
      }
    }
  }
  ${REVIEW_FRAGMENT}
  ${PAGINATION_FRAGMENT}
`;
