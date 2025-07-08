import { gql } from "@apollo/client";

// Author Fragments
export const AUTHOR_BASIC_FRAGMENT = gql`
  fragment AuthorBasic on Author {
    id
    name
    biography
    born_date
    createdAt
  }
`;

export const AUTHOR_METADATA_FRAGMENT = gql`
  fragment AuthorMetadata on AuthorMetadata {
    totalBooks
    averageRating
    profileImageUrl
    followers
    awards
    socialMedia {
      twitter
      facebook
      website
    }
  }
`;

export const AUTHOR_FULL_FRAGMENT = gql`
  fragment AuthorFull on Author {
    ...AuthorBasic
    metadata {
      ...AuthorMetadata
    }
    updatedAt
  }
  ${AUTHOR_BASIC_FRAGMENT}
  ${AUTHOR_METADATA_FRAGMENT}
`;

export const AUTHOR_CARD_FRAGMENT = gql`
  fragment AuthorCard on Author {
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
`;

// Book Fragments
export const BOOK_BASIC_FRAGMENT = gql`
  fragment BookBasic on Book {
    id
    title
    description
    published_date
    createdAt
  }
`;

export const BOOK_METADATA_FRAGMENT = gql`
  fragment BookMetadata on BookMetadata {
    averageRating
    totalReviews
    totalRatings
    genres
    tags
    isbn
    pageCount
    language
    coverImageUrl
  }
`;

export const BOOK_AUTHOR_FRAGMENT = gql`
  fragment BookAuthor on Author {
    id
    name
    biography
  }
`;

export const BOOK_CARD_FRAGMENT = gql`
  fragment BookCard on Book {
    ...BookBasic
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
  }
  ${BOOK_BASIC_FRAGMENT}
`;

export const BOOK_FULL_FRAGMENT = gql`
  fragment BookFull on Book {
    ...BookBasic
    author {
      ...BookAuthor
    }
    metadata {
      ...BookMetadata
    }
    updatedAt
  }
  ${BOOK_BASIC_FRAGMENT}
  ${BOOK_AUTHOR_FRAGMENT}
  ${BOOK_METADATA_FRAGMENT}
`;

// Review Fragments
export const REVIEW_FRAGMENT = gql`
  fragment Review on Review {
    id
    rating
    comment
    reviewerName
    helpful
    createdAt
    updatedAt
  }
`;

// Pagination Fragment
export const PAGINATION_FRAGMENT = gql`
  fragment Pagination on PaginationInfo {
    currentPage
    totalPages
    totalItems
    hasNextPage
    hasPrevPage
  }
`;

// Search Result Fragments
export const SEARCH_BOOK_FRAGMENT = gql`
  fragment SearchBook on Book {
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
`;

export const SEARCH_AUTHOR_FRAGMENT = gql`
  fragment SearchAuthor on Author {
    id
    name
    biography
    metadata {
      totalBooks
      profileImageUrl
    }
  }
`;
