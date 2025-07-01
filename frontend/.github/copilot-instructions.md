<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# BookAuthor Frontend - Copilot Instructions

This is a Next.js 15 frontend application for a book and author management system.

## Architecture
- **Next.js 15** with App Router
- **React 19** with modern hooks and TypeScript
- **Apollo Client** for GraphQL data fetching
- **Tailwind CSS** for styling
- **React Hook Form** with Zod validation for forms

## Code Style & Conventions
- Use TypeScript with strict typing
- Prefer functional components with hooks over class components
- Use 'use client' directive for client-side components that need interactivity
- Follow Next.js App Router conventions for file organization
- Use Tailwind CSS classes for styling (avoid inline styles)
- Implement proper error boundaries and loading states

## Component Patterns
- Create reusable UI components in the `components/` directory
- Use proper TypeScript interfaces for all props
- Implement loading states with skeleton screens
- Handle errors gracefully with user-friendly messages
- Use React.memo() for performance optimization when needed

## GraphQL & Apollo Client
- Use Apollo Client hooks (useQuery, useMutation, etc.)
- Implement proper error handling with errorPolicy
- Use TypeScript for query variables and response types
- Implement optimistic updates for better UX
- Use proper cache policies for data consistency

## Styling Guidelines
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design principles
- Use consistent spacing and color schemes
- Implement hover and focus states for interactive elements
- Use Lucide React for icons

## Form Handling
- Use React Hook Form for form management
- Implement Zod schemas for validation
- Provide real-time validation feedback
- Handle form submission with proper loading and error states

## Performance Best Practices
- Use Next.js Image component for optimized images
- Implement proper loading states to avoid layout shift
- Use debounced inputs for search functionality
- Implement pagination for large data sets
- Use React.Suspense for code splitting when appropriate

## Accessibility
- Use semantic HTML elements
- Include proper ARIA labels and roles
- Ensure keyboard navigation works properly
- Use sufficient color contrast
- Provide alternative text for images
