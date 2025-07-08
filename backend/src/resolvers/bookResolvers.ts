import { GraphQLError, GraphQLResolveInfo } from "graphql";
import Book from "../models/Book";
import Author from "../models/Author";
import BookMetadata from "../models/BookMetadata";
import AuthorMetadata from "../models/AuthorMetadata";
import Review from "../models/Review";
import { calculatePagination } from "../utils/pagination";
import { buildBookWhereClause, BookFilterInput } from "../utils/filters";
import {
  deleteImageFromCloudinary,
  extractPublicIdFromUrl,
} from "../utils/imageUpload";
import { isNestedFieldRequested } from "../utils/graphqlHelpers";
import { Op } from "sequelize";

export const bookResolvers = {
  Query: {
    books: async (
      _: any,
      args: {
        page?: number;
        limit?: number;
        filter?: BookFilterInput;
        sortBy?: string;
        sortOrder?: string;
      },
      context: any,
      info: GraphQLResolveInfo
    ) => {
      try {
        const {
          page = 1,
          limit = 10,
          filter,
          sortBy = "createdAt",
          sortOrder = "DESC",
        } = args;

        const whereClause = buildBookWhereClause(filter);
        let includeClause: any[] = [];

        // Check if author field is requested in the books field
        const isAuthorRequested = isNestedFieldRequested(
          info,
          "books",
          "author"
        );

        // Handle author name filtering - only include if filtering by author OR if author data is requested
        if (filter?.author || isAuthorRequested) {
          includeClause = [
            {
              model: Author,
              as: "author",
              attributes: ["id", "name"],
              ...(filter?.author && {
                where: {
                  name: {
                    [Op.iLike]: `%${filter.author}%`,
                  },
                },
              }),
            },
          ];
        }

        // Get total count
        const totalItems = await Book.count({
          where: whereClause,
          include: includeClause,
        });

        // Calculate pagination
        const {
          offset,
          limit: realLimit,
          pagination,
        } = calculatePagination(page, limit, totalItems);

        // Get books with pagination - no eager loading of author
        const books = await Book.findAll({
          where: whereClause,
          include: includeClause,
          offset,
          limit: realLimit,
          order: [[sortBy, sortOrder.toUpperCase()]],
        });

        return {
          books,
          pagination,
        };
      } catch (error) {
        throw new GraphQLError(
          `Failed to fetch books: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },

    book: async (_: any, { id }: { id: string }) => {
      try {
        const book = await Book.findByPk(id);

        if (!book) {
          throw new GraphQLError("Book not found");
        }

        return book;
      } catch (error) {
        throw new GraphQLError(
          `Failed to fetch book: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },

    searchBooks: async (_: any, { query }: { query: string }) => {
      try {
        const books = await Book.findAll({
          where: {
            [Op.or]: [
              {
                title: {
                  [Op.iLike]: `%${query}%`,
                },
              },
              {
                description: {
                  [Op.iLike]: `%${query}%`,
                },
              },
            ],
          },
          limit: 20,
        });

        // Also search books by author name
        const booksByAuthor = await Book.findAll({
          include: [
            {
              model: Author,
              as: "author",
              where: {
                name: {
                  [Op.iLike]: `%${query}%`,
                },
              },
              attributes: [],
            },
          ],
          limit: 20,
        });

        // Combine and deduplicate results
        const allBooks = [...books, ...booksByAuthor];
        const uniqueBooks = allBooks.filter(
          (book, index, self) =>
            index === self.findIndex((b) => b.id === book.id)
        );

        return uniqueBooks.slice(0, 20);
      } catch (error) {
        throw new GraphQLError(
          `Failed to search books: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },

    search: async (
      _: any,
      { query, type = "all" }: { query: string; type?: string }
    ) => {
      try {
        let books: any[] = [];
        let authors: any[] = [];

        // Search books only if type is "all" or "books"
        if (type === "all" || type === "books") {
          const bookResults = await Book.findAll({
            where: {
              [Op.or]: [
                {
                  title: {
                    [Op.iLike]: `%${query}%`,
                  },
                },
                {
                  description: {
                    [Op.iLike]: `%${query}%`,
                  },
                },
              ],
            },
            limit: 20,
          });

          // Also search books by author name
          const booksByAuthor = await Book.findAll({
            include: [
              {
                model: Author,
                as: "author",
                where: {
                  name: {
                    [Op.iLike]: `%${query}%`,
                  },
                },
                attributes: [],
              },
            ],
            limit: 20,
          });

          // Combine and deduplicate book results
          const allBooks = [...bookResults, ...booksByAuthor];
          books = allBooks
            .filter(
              (book, index, self) =>
                index === self.findIndex((b) => b.id === book.id)
            )
            .slice(0, 20);
        }

        // Search authors only if type is "all" or "authors"
        if (type === "all" || type === "authors") {
          authors = await Author.findAll({
            where: {
              [Op.or]: [
                {
                  name: {
                    [Op.iLike]: `%${query}%`,
                  },
                },
                {
                  biography: {
                    [Op.iLike]: `%${query}%`,
                  },
                },
              ],
            },
            limit: 20,
          });
        }

        return {
          books,
          authors,
        };
      } catch (error) {
        throw new GraphQLError(
          `Failed to perform search: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  },

  Mutation: {
    createBook: async (_: any, { input }: { input: any }) => {
      try {
        const { coverImageUrl, ...bookData } = input;

        // Verify author exists
        const author = await Author.findByPk(bookData.author_id);
        if (!author) {
          throw new GraphQLError("Author not found");
        }

        const book = await Book.create(bookData);

        // Create default metadata
        await BookMetadata.create({
          bookId: book.id,
          language: "English",
          totalReviews: 0,
          totalRatings: 0,
          coverImageUrl: coverImageUrl || null,
        });

        try {
          const authorMetadata = await AuthorMetadata.findOne({
            authorId: bookData.author_id,
          });
          if (authorMetadata) {
            authorMetadata.totalBooks += 1;
            await authorMetadata.save();
          }
        } catch (error) {
          console.error("Failed to update author totalBooks count:", error);
        }

        return await Book.findByPk(book.id);
      } catch (error) {
        throw new GraphQLError(
          `Failed to create book: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },

    updateBook: async (_: any, { id, input }: { id: string; input: any }) => {
      try {
        const { coverImageUrl, ...bookData } = input;

        const book = await Book.findByPk(id);
        if (!book) {
          throw new GraphQLError("Book not found");
        }

        const oldAuthorId = book.author_id;

        // If author_id is being updated, verify new author exists and handle metadata
        if (bookData.author_id && bookData.author_id !== oldAuthorId) {
          const author = await Author.findByPk(bookData.author_id);
          if (!author) {
            throw new GraphQLError("Author not found");
          }

          try {
            const oldAuthorMetadata = await AuthorMetadata.findOne({
              authorId: oldAuthorId,
            });
            if (oldAuthorMetadata && oldAuthorMetadata.totalBooks > 0) {
              oldAuthorMetadata.totalBooks -= 1;
              await oldAuthorMetadata.save();
            }

            const newAuthorMetadata = await AuthorMetadata.findOne({
              authorId: bookData.author_id,
            });
            if (newAuthorMetadata) {
              newAuthorMetadata.totalBooks += 1;
              await newAuthorMetadata.save();
            }
          } catch (error) {
            console.error("Failed to update author totalBooks counts:", error);
          }
        }

        // Update book basic data
        await book.update(bookData);

        // Update metadata if coverImageUrl is provided
        if (coverImageUrl !== undefined) {
          const metadata = await BookMetadata.findOne({ bookId: parseInt(id) });

          // If there's an existing image and we're updating it, delete the old one
          if (
            metadata &&
            metadata.coverImageUrl &&
            coverImageUrl !== metadata.coverImageUrl
          ) {
            const oldPublicId = extractPublicIdFromUrl(metadata.coverImageUrl);
            if (oldPublicId) {
              try {
                await deleteImageFromCloudinary(oldPublicId);
              } catch (error) {
                console.error("Failed to delete old book cover image:", error);
                // Don't throw error, continue with update
              }
            }
          }

          if (metadata) {
            metadata.coverImageUrl = coverImageUrl;
            await metadata.save();
          } else {
            // Create metadata if it doesn't exist
            await BookMetadata.create({
              bookId: parseInt(id),
              language: "English",
              totalReviews: 0,
              totalRatings: 0,
              coverImageUrl,
            });
          }
        }

        return await Book.findByPk(id);
      } catch (error) {
        throw new GraphQLError(
          `Failed to update book: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  },

  Book: {
    author: async (parent: any, args: any, context: any, info: any) => {
      try {
        // Only resolve if the author field is requested
        return await Author.findByPk(parent.author_id);
      } catch (error) {
        console.error("Error fetching book author:", error);
        return null;
      }
    },

    metadata: async (parent: any, args: any, context: any, info: any) => {
      try {
        // Only resolve if the metadata field is requested
        return await BookMetadata.findOne({ bookId: parent.id });
      } catch (error) {
        console.error("Error fetching book metadata:", error);
        return null;
      }
    },

    reviews: async (parent: any, args: any, context: any, info: any) => {
      try {
        // Only resolve if the reviews field is requested
        return await Review.find({ bookId: parent.id })
          .sort({ createdAt: -1 })
          .limit(10);
      } catch (error) {
        console.error("Error fetching book reviews:", error);
        return [];
      }
    },
  },
};
