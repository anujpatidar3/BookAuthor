import { gql } from "@apollo/client";
import {
  BOOK_CARD_FRAGMENT,
  AUTHOR_CARD_FRAGMENT,
  AUTHOR_FULL_FRAGMENT,
  REVIEW_FRAGMENT,
} from "./fragments";

// Book Mutations
export const CREATE_BOOK = gql`
  mutation CreateBook($input: BookInput!) {
    createBook(input: $input) {
      ...BookCard
    }
  }
  ${BOOK_CARD_FRAGMENT}
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $input: BookUpdateInput!) {
    updateBook(id: $id, input: $input) {
      ...BookCard
      updatedAt
    }
  }
  ${BOOK_CARD_FRAGMENT}
`;

// Author Mutations
export const CREATE_AUTHOR = gql`
  mutation CreateAuthor($input: AuthorInput!) {
    createAuthor(input: $input) {
      ...AuthorCard
    }
  }
  ${AUTHOR_CARD_FRAGMENT}
`;

export const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor($id: ID!, $input: AuthorUpdateInput!) {
    updateAuthor(id: $id, input: $input) {
      ...AuthorFull
      updatedAt
      books {
        ...BookCard
      }
    }
  }
  ${AUTHOR_FULL_FRAGMENT}
  ${BOOK_CARD_FRAGMENT}
`;

export const DELETE_AUTHOR = gql`
  mutation DeleteAuthor($id: ID!) {
    deleteAuthor(id: $id)
  }
`;

// Review Mutations
export const CREATE_REVIEW = gql`
  mutation CreateReview($input: ReviewInput!) {
    createReview(input: $input) {
      ...Review
    }
  }
  ${REVIEW_FRAGMENT}
`;

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($id: ID!, $rating: Int, $comment: String) {
    updateReview(id: $id, rating: $rating, comment: $comment) {
      ...Review
    }
  }
  ${REVIEW_FRAGMENT}
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`;

export const MARK_REVIEW_HELPFUL = gql`
  mutation MarkReviewHelpful($id: ID!) {
    markReviewHelpful(id: $id) {
      id
      helpful
    }
  }
`;

// Book Metadata Mutations
export const UPDATE_BOOK_METADATA = gql`
  mutation UpdateBookMetadata($bookId: Int!, $input: BookMetadataInput!) {
    updateBookMetadata(bookId: $bookId, input: $input) {
      id
      genres
      tags
      isbn
      pageCount
      language
      coverImageUrl
    }
  }
`;

// Image Upload Mutation
export const UPLOAD_IMAGE = gql`
  mutation UploadImage($file: Upload!, $type: String) {
    uploadImage(file: $file, type: $type) {
      url
      publicId
    }
  }
`;
