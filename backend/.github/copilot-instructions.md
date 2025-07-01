<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# BookAuthor Backend - Copilot Instructions

This is a Node.js/TypeScript GraphQL API backend for a book and author management system.

## Architecture
- **GraphQL API** using Apollo Server v4
- **PostgreSQL** with Sequelize ORM for core data (books, authors)
- **MongoDB** with Mongoose ODM for metadata (reviews, ratings, etc.)
- **TypeScript** for type safety
- **Express.js** as the web framework

## Code Style & Conventions
- Use TypeScript interfaces for type definitions
- Follow async/await pattern for database operations
- Use proper error handling with GraphQLError
- Include proper type annotations and return types
- Use Sequelize associations for PostgreSQL relationships
- Use Mongoose schemas with proper validation

## Database Models
- **Author**: PostgreSQL model with id, name, biography, born_date
- **Book**: PostgreSQL model with id, title, description, published_date, author_id
- **BookMetadata**: MongoDB model for additional book data (genres, ratings, etc.)
- **AuthorMetadata**: MongoDB model for additional author data
- **Review**: MongoDB model for user reviews and ratings

## GraphQL Patterns
- Use proper input types for mutations
- Include pagination in list queries
- Provide comprehensive error messages
- Use resolvers to populate related data
- Follow GraphQL best practices for query optimization

## Security & Performance
- Always validate input data
- Use proper error handling to avoid exposing sensitive information
- Implement rate limiting for API protection
- Use proper CORS configuration
- Include authentication context in resolvers when needed

## Testing
- Write unit tests for resolvers
- Test database operations with proper mocking
- Include integration tests for GraphQL operations
- Test error scenarios and edge cases
