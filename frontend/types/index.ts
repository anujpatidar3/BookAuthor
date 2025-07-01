export interface Author {
  id: string;
  name: string;
  biography?: string;
  born_date?: string;
  books?: Book[];
  metadata?: AuthorMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
  description?: string;
  published_date?: string;
  author_id: number;
  author: Author;
  metadata?: BookMetadata;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface BookMetadata {
  id: string;
  bookId: number;
  genres: string[];
  tags: string[];
  isbn?: string;
  pageCount?: number;
  language: string;
  coverImageUrl?: string;
  averageRating?: number;
  totalReviews: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorMetadata {
  id: string;
  authorId: number;
  socialMedia?: SocialMedia;
  profileImageUrl?: string;
  awards: string[];
  totalBooks: number;
  averageRating?: number;
  followers: number;
  createdAt: string;
  updatedAt: string;
}

export interface SocialMedia {
  twitter?: string;
  facebook?: string;
  website?: string;
}

export interface Review {
  id: string;
  bookId: number;
  userId?: string;
  rating: number;
  comment?: string;
  reviewerName: string;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BookConnection {
  books: Book[];
  pagination: PaginationInfo;
}

export interface AuthorConnection {
  authors: Author[];
  pagination: PaginationInfo;
}

// Input Types
export interface BookInput {
  title: string;
  description?: string;
  published_date?: string;
  author_id: number;
}

export interface BookUpdateInput {
  title?: string;
  description?: string;
  published_date?: string;
  author_id?: number;
}

export interface AuthorInput {
  name: string;
  biography?: string;
  born_date?: string;
}

export interface AuthorUpdateInput {
  name?: string;
  biography?: string;
  born_date?: string;
}

export interface BookFilterInput {
  title?: string;
  author?: string;
  author_id?: number;
  published_date_from?: string;
  published_date_to?: string;
  genres?: string[];
  rating_min?: number;
}

export interface AuthorFilterInput {
  name?: string;
  born_year_from?: number;
  born_year_to?: number;
}

export interface ReviewInput {
  bookId: number;
  rating: number;
  comment?: string;
  reviewerName: string;
}
