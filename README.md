### Backend 

Installation and running server

1. Clone the repository and navigate to the backend directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your database credentials and configuration

5. Start the development server:
   ```bash
   npm run dev
   ```

The GraphQL playground will be available at `http://localhost:4000/graphql`


### Frontend

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running at `http://localhost:4000/graphql`

Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

