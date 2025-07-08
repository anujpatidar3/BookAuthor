import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar Date
  scalar Upload

  type ImageUploadResponse {
    url: String!
    publicId: String!
  }

  type Author {
    id: ID!
    name: String!
    biography: String
    born_date: Date
    books: [Book!]!
    metadata: AuthorMetadata
    createdAt: Date!
    updatedAt: Date!
  }

  type Book {
    id: ID!
    title: String!
    description: String
    published_date: Date
    author_id: Int!
    author: Author!
    metadata: BookMetadata
    reviews: [Review!]!
    createdAt: Date!
    updatedAt: Date!
  }

  type BookMetadata {
    id: ID!
    bookId: Int!
    genres: [String!]!
    tags: [String!]!
    isbn: String
    pageCount: Int
    language: String!
    coverImageUrl: String
    averageRating: Float
    totalReviews: Int!
    totalRatings: Int!
    createdAt: Date!
    updatedAt: Date!
  }

  type AuthorMetadata {
    id: ID!
    authorId: Int!
    socialMedia: SocialMedia
    profileImageUrl: String
    awards: [String!]!
    totalBooks: Int!
    averageRating: Float
    followers: Int!
    createdAt: Date!
    updatedAt: Date!
  }

  type SocialMedia {
    twitter: String
    facebook: String
    website: String
  }

  type Review {
    id: ID!
    bookId: Int!
    userId: String
    rating: Int!
    comment: String
    reviewerName: String!
    helpful: Int!
    createdAt: Date!
    updatedAt: Date!
  }

  type PaginationInfo {
    currentPage: Int!
    totalPages: Int!
    totalItems: Int!
    hasNextPage: Boolean!
    hasPrevPage: Boolean!
  }

  type BookConnection {
    books: [Book!]!
    pagination: PaginationInfo!
  }

  type AuthorConnection {
    authors: [Author!]!
    pagination: PaginationInfo!
  }

  type ReviewConnection {
    reviews: [Review!]!
    pagination: PaginationInfo!
  }

  type SearchResults {
    books: [Book!]!
    authors: [Author!]!
  }

  input BookInput {
    title: String!
    description: String
    published_date: Date
    author_id: Int!
    coverImageUrl: String
  }

  input BookUpdateInput {
    title: String
    description: String
    published_date: Date
    author_id: Int
    coverImageUrl: String
  }

  input AuthorInput {
    name: String!
    biography: String
    born_date: Date
    profileImageUrl: String
  }

  input AuthorUpdateInput {
    name: String
    biography: String
    born_date: Date
    profileImageUrl: String
  }

  input BookMetadataInput {
    genres: [String!]
    tags: [String!]
    isbn: String
    pageCount: Int
    language: String
    coverImageUrl: String
  }

  input ReviewInput {
    bookId: Int!
    rating: Int!
    comment: String
    reviewerName: String!
  }

  input BookFilterInput {
    title: String
    author: String
    author_id: Int
    published_date_from: Date
    published_date_to: Date
    genres: [String!]
    rating_min: Float
  }

  input AuthorFilterInput {
    name: String
    born_year_from: Int
    born_year_to: Int
  }

  type Query {
    # Book queries
    books(
      page: Int = 1
      limit: Int = 10
      filter: BookFilterInput
      sortBy: String = "createdAt"
      sortOrder: String = "DESC"
    ): BookConnection!

    book(id: ID!): Book

    # Author queries
    authors(
      page: Int = 1
      limit: Int = 10
      filter: AuthorFilterInput
      sortBy: String = "createdAt"
      sortOrder: String = "DESC"
    ): AuthorConnection!

    author(id: ID!): Author

    # Review queries
    reviews(bookId: Int!, page: Int = 1, limit: Int = 10): ReviewConnection!

    # Search
    searchBooks(query: String!): [Book!]!
    searchAuthors(query: String!): [Author!]!
    search(query: String!, type: String = "all"): SearchResults!
  }

  type Mutation {
    # Image upload
    uploadImage(file: Upload!, type: String = "general"): ImageUploadResponse!

    # Book mutations
    createBook(input: BookInput!): Book!
    updateBook(id: ID!, input: BookUpdateInput!): Book!
    deleteBook(id: ID!): Boolean!

    # Author mutations
    createAuthor(input: AuthorInput!): Author!
    updateAuthor(id: ID!, input: AuthorUpdateInput!): Author!
    deleteAuthor(id: ID!): Boolean!

    # Book metadata mutations
    updateBookMetadata(bookId: Int!, input: BookMetadataInput!): BookMetadata!

    # Review mutations
    createReview(input: ReviewInput!): Review!
    updateReview(id: ID!, rating: Int, comment: String): Review!
    deleteReview(id: ID!): Boolean!
    markReviewHelpful(id: ID!): Review!
  }

  type Subscription {
    reviewAdded(bookId: Int!): Review!
  }
`;
