# Stackboxd - Setup Instructions

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- GitHub OAuth App credentials

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/stackboxd?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

To generate `NEXTAUTH_SECRET`, you can use:
```bash
openssl rand -base64 32
```

### 3. Set Up GitHub OAuth App

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: Stackboxd (or your choice)
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
4. Copy the Client ID and Client Secret to your `.env` file

### 4. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial tools data
npm run db:seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses Prisma with PostgreSQL and includes the following models:

- **User** - User accounts (linked to GitHub)
- **Tool** - Development tools/frameworks
- **Project** - Developer projects
- **Log** - Tool reviews/ratings
- **List** - Curated lists of tools
- **Follow** - User follow relationships
- **Reaction** - Log reactions (likes)
- **Comment** - Comments on logs

## API Routes

All API routes are under `/api`:

- `/api/auth/[...nextauth]` - NextAuth authentication
- `/api/users` - User CRUD operations
- `/api/tools` - Tool CRUD operations
- `/api/projects` - Project CRUD operations
- `/api/logs` - Log CRUD operations
- `/api/lists` - List CRUD operations

## Features

- ✅ GitHub OAuth authentication
- ✅ User profiles
- ✅ Tool logging and rating
- ✅ Project creation
- ✅ Lists for curating tools
- ✅ Feed of recent activity
- ✅ Database persistence with Prisma

## Production Deployment

For production:

1. Update `NEXTAUTH_URL` to your production domain
2. Update GitHub OAuth callback URL to production domain
3. Use a secure PostgreSQL database (e.g., Supabase, Railway, Neon)
4. Set secure `NEXTAUTH_SECRET`
5. Run `npm run build` to build the app
6. Deploy to Vercel, Railway, or your preferred platform

