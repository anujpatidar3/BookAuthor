import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  headers: {
    'apollo-require-preflight': 'true',
  },
});

const client = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          books: {
            merge(_, incoming: { books: unknown[]; pagination: unknown }) {
              return incoming;
            },
          },
          authors: {
            merge(_, incoming: { authors: unknown[]; pagination: unknown }) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

export default client;
