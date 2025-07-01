import { DateScalar } from '../utils/pagination';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { bookResolvers } from './bookResolvers';
import { authorResolvers } from './authorResolvers';
import { reviewResolvers } from './reviewResolvers';
import { imageResolvers } from './imageResolvers';

export const resolvers = {
  Date: DateScalar,
  Upload: GraphQLUpload,

  Query: {
    ...bookResolvers.Query,
    ...authorResolvers.Query,
    ...reviewResolvers.Query,
  },

  Mutation: {
    ...bookResolvers.Mutation,
    ...authorResolvers.Mutation,
    ...reviewResolvers.Mutation,
    ...imageResolvers.Mutation,
  },

  Book: bookResolvers.Book,
  Author: authorResolvers.Author,
};
