import { GraphQLError } from 'graphql';
import Author from '../models/Author';
import Book from '../models/Book';
import AuthorMetadata from '../models/AuthorMetadata';
import { calculatePagination } from '../utils/pagination';
import { buildAuthorWhereClause, AuthorFilterInput } from '../utils/filters';
import { Op } from 'sequelize';

export const authorResolvers = {
  Query: {
    authors: async (
      _: any,
      args: {
        page?: number;
        limit?: number;
        filter?: AuthorFilterInput;
        sortBy?: string;
        sortOrder?: string;
      }
    ) => {
      try {
        const { page = 1, limit = 10, filter, sortBy = 'createdAt', sortOrder = 'DESC' } = args;
        
        const whereClause = buildAuthorWhereClause(filter);

        // Get total count
        const totalItems = await Author.count({
          where: whereClause,
        });

        // Calculate pagination
        const { offset, limit: realLimit, pagination } = calculatePagination(page, limit, totalItems);

        // Get authors with pagination
        const authors = await Author.findAll({
          where: whereClause,
          offset,
          limit: realLimit,
          order: [[sortBy, sortOrder.toUpperCase()]],
        });

        return {
          authors,
          pagination,
        };
      } catch (error) {
        throw new GraphQLError(`Failed to fetch authors: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    author: async (_: any, { id }: { id: string }) => {
      try {
        const author = await Author.findByPk(id, {
          include: [{
            model: Book,
            as: 'books',
          }],
        });

        if (!author) {
          throw new GraphQLError('Author not found');
        }

        return author;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch author: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    searchAuthors: async (_: any, { query }: { query: string }) => {
      try {
        const authors = await Author.findAll({
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

        return authors;
      } catch (error) {
        throw new GraphQLError(`Failed to search authors: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  },

  Mutation: {
    createAuthor: async (_: any, { input }: { input: any }) => {
      try {
        const { profileImageUrl, ...authorData } = input;
        
        const author = await Author.create(authorData);
        
        // Create default metadata
        await AuthorMetadata.create({
          authorId: author.id,
          totalBooks: 0,
          followers: 0,
          awards: [],
          profileImageUrl: profileImageUrl || null,
        });

        return await Author.findByPk(author.id, {
          include: [{
            model: Book,
            as: 'books',
          }],
        });
      } catch (error) {
        throw new GraphQLError(`Failed to create author: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    updateAuthor: async (_: any, { id, input }: { id: string; input: any }) => {
      try {
        const { profileImageUrl, ...authorData } = input;
        
        const author = await Author.findByPk(id);
        if (!author) {
          throw new GraphQLError('Author not found');
        }

        // Update author basic data
        await author.update(authorData);

        // Update metadata if profileImageUrl is provided
        if (profileImageUrl !== undefined) {
          const metadata = await AuthorMetadata.findOne({ authorId: parseInt(id) });
          
          if (metadata) {
            metadata.profileImageUrl = profileImageUrl;
            await metadata.save();
          } else {
            // Create metadata if it doesn't exist
            await AuthorMetadata.create({
              authorId: parseInt(id),
              totalBooks: 0,
              followers: 0,
              awards: [],
              profileImageUrl,
            });
          }
        }

        return await Author.findByPk(id, {
          include: [{
            model: Book,
            as: 'books',
          }],
        });
      } catch (error) {
        throw new GraphQLError(`Failed to update author: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    deleteAuthor: async (_: any, { id }: { id: string }) => {
      try {
        const author = await Author.findByPk(id);
        if (!author) {
          throw new GraphQLError('Author not found');
        }

        // Check if author has books
        const bookCount = await Book.count({ where: { author_id: id } });
        if (bookCount > 0) {
          throw new GraphQLError('Cannot delete author who has books. Please delete or reassign the books first.');
        }

        // Delete associated metadata
        await AuthorMetadata.deleteOne({ authorId: parseInt(id) });

        await author.destroy();
        return true;
      } catch (error) {
        throw new GraphQLError(`Failed to delete author: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  },

  Author: {
    books: async (parent: any) => {
      try {
        return await Book.findAll({
          where: { author_id: parent.id },
          order: [['published_date', 'DESC']],
        });
      } catch (error) {
        console.error('Error fetching author books:', error);
        return [];
      }
    },

    metadata: async (parent: any) => {
      try {
        return await AuthorMetadata.findOne({ authorId: parent.id });
      } catch (error) {
        console.error('Error fetching author metadata:', error);
        return null;
      }
    },
  },
};
