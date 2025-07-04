import { GraphQLError } from 'graphql';
import Book from '../models/Book';
import Author from '../models/Author';
import BookMetadata from '../models/BookMetadata';
import AuthorMetadata from '../models/AuthorMetadata';
import Review from '../models/Review';
import { calculatePagination } from '../utils/pagination';
import { buildBookWhereClause, BookFilterInput } from '../utils/filters';
import { deleteImageFromCloudinary, extractPublicIdFromUrl } from '../utils/imageUpload';
import { Op } from 'sequelize';

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
      }
    ) => {
      try {
        const { page = 1, limit = 10, filter, sortBy = 'createdAt', sortOrder = 'DESC' } = args;
        
        const whereClause = buildBookWhereClause(filter);
        let includeClause: any[] = [{
          model: Author,
          as: 'author',
          attributes: ['id', 'name'],
        }];

        // Handle author name filtering
        if (filter?.author) {
          includeClause[0].where = {
            name: {
              [Op.iLike]: `%${filter.author}%`,
            },
          };
        }

        // Get total count
        const totalItems = await Book.count({
          where: whereClause,
          include: includeClause,
        });

        // Calculate pagination
        const { offset, limit: realLimit, pagination } = calculatePagination(page, limit, totalItems);

        // Get books with pagination
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
        throw new GraphQLError(`Failed to fetch books: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    book: async (_: any, { id }: { id: string }) => {
      try {
        const book = await Book.findByPk(id, {
          include: [{
            model: Author,
            as: 'author',
          }],
        });

        if (!book) {
          throw new GraphQLError('Book not found');
        }

        return book;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch book: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          include: [{
            model: Author,
            as: 'author',
            where: {
              name: {
                [Op.iLike]: `%${query}%`,
              },
            },
            required: false,
          }],
          limit: 20,
        });

        return books;
      } catch (error) {
        throw new GraphQLError(`Failed to search books: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          throw new GraphQLError('Author not found');
        }

        const book = await Book.create(bookData);
        
        // Create default metadata
        await BookMetadata.create({
          bookId: book.id,
          language: 'English',
          totalReviews: 0,
          totalRatings: 0,
          coverImageUrl: coverImageUrl || null,
        });

        try {
          const authorMetadata = await AuthorMetadata.findOne({ authorId: bookData.author_id });
          if (authorMetadata) {
            authorMetadata.totalBooks += 1;
            await authorMetadata.save();
          }
        } catch (error) {
          console.error('Failed to update author totalBooks count:', error);
        }

        return await Book.findByPk(book.id, {
          include: [{
            model: Author,
            as: 'author',
          }],
        });
      } catch (error) {
        throw new GraphQLError(`Failed to create book: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    updateBook: async (_: any, { id, input }: { id: string; input: any }) => {
      try {
        const { coverImageUrl, ...bookData } = input;
        
        const book = await Book.findByPk(id);
        if (!book) {
          throw new GraphQLError('Book not found');
        }

        const oldAuthorId = book.author_id;

        // If author_id is being updated, verify new author exists and handle metadata
        if (bookData.author_id && bookData.author_id !== oldAuthorId) {
          const author = await Author.findByPk(bookData.author_id);
          if (!author) {
            throw new GraphQLError('Author not found');
          }

          try {
            const oldAuthorMetadata = await AuthorMetadata.findOne({ authorId: oldAuthorId });
            if (oldAuthorMetadata && oldAuthorMetadata.totalBooks > 0) {
              oldAuthorMetadata.totalBooks -= 1;
              await oldAuthorMetadata.save();
            }

            const newAuthorMetadata = await AuthorMetadata.findOne({ authorId: bookData.author_id });
            if (newAuthorMetadata) {
              newAuthorMetadata.totalBooks += 1;
              await newAuthorMetadata.save();
            }
          } catch (error) {
            console.error('Failed to update author totalBooks counts:', error);
          }
        }

        // Update book basic data
        await book.update(bookData);

        // Update metadata if coverImageUrl is provided
        if (coverImageUrl !== undefined) {
          const metadata = await BookMetadata.findOne({ bookId: parseInt(id) });
          
          // If there's an existing image and we're updating it, delete the old one
          if (metadata && metadata.coverImageUrl && coverImageUrl !== metadata.coverImageUrl) {
            const oldPublicId = extractPublicIdFromUrl(metadata.coverImageUrl);
            if (oldPublicId) {
              try {
                await deleteImageFromCloudinary(oldPublicId);
              } catch (error) {
                console.error('Failed to delete old book cover image:', error);
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
              language: 'English',
              totalReviews: 0,
              totalRatings: 0,
              coverImageUrl,
            });
          }
        }

        return await Book.findByPk(id, {
          include: [{
            model: Author,
            as: 'author',
          }],
        });
      } catch (error) {
        throw new GraphQLError(`Failed to update book: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  },

  Book: {
    metadata: async (parent: any) => {
      try {
        return await BookMetadata.findOne({ bookId: parent.id });
      } catch (error) {
        console.error('Error fetching book metadata:', error);
        return null;
      }
    },

    reviews: async (parent: any) => {
      try {
        return await Review.find({ bookId: parent.id })
          .sort({ createdAt: -1 })
          .limit(10);
      } catch (error) {
        console.error('Error fetching book reviews:', error);
        return [];
      }
    },
  },
};
