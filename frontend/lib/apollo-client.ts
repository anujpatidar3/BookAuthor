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
            merge(_existing = { books: [], pagination: {} }, incoming: any) {
              return incoming;
            },
          },
          authors: {
            merge(_existing = { authors: [], pagination: {} }, incoming: any) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

export default client;
