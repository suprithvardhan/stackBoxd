# StackBoxd - Vercel Deployment Guide

## Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **PostgreSQL Database**: Set up a cloud database (Supabase, Neon, Railway, etc.)
4. **GitHub OAuth App**: Create OAuth app with production URLs

## Step 1: Set Up Cloud Database

### Option A: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to Settings > Database
3. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres`)
4. This is your `DATABASE_URL`

### Option B: Neon
1. Go to [neon.tech](https://neon.tech) and create a project
2. Copy the connection string from the dashboard
3. This is your `DATABASE_URL`

### Option C: Railway
1. Go to [railway.app](https://railway.app) and create a PostgreSQL service
2. Copy the connection string from the service variables
3. This is your `DATABASE_URL`

## Step 2: Set Up Database Schema

After creating your database, you need to push the schema:

**Option 1: Using Prisma Studio (Local)**
```bash
# Set DATABASE_URL in your local .env
DATABASE_URL="your-production-database-url"

# Push schema
npm run db:push

# Push tools data
npm run db:push-tools
```

**Option 2: Using Vercel CLI (After first deploy)**
```bash
# Set environment variable temporarily
export DATABASE_URL="your-production-database-url"

# Push schema
npx prisma db push

# Push tools data
npm run db:push-tools
```

## Step 3: Update GitHub OAuth App

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Edit your OAuth App or create a new one
3. Update:
   - **Homepage URL**: `https://your-app.vercel.app`
   - **Authorization callback URL**: `https://your-app.vercel.app/api/auth/callback/github`
4. Copy the **Client ID** and **Client Secret**

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. **Import Project**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

3. **Set Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-generated-secret-here
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

   **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add GITHUB_CLIENT_ID
   vercel env add GITHUB_CLIENT_SECRET
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Step 5: Initialize Database (After First Deploy)

After your first deployment, you need to set up the database:

1. **Connect to your database** using your preferred method (Prisma Studio, CLI, etc.)
2. **Push the schema:**
   ```bash
   DATABASE_URL="your-production-url" npx prisma db push
   ```
3. **Push tools data:**
   ```bash
   DATABASE_URL="your-production-url" npm run db:push-tools
   ```

**Or use Vercel CLI:**
```bash
# Get production DATABASE_URL from Vercel
vercel env pull .env.production

# Use the production DATABASE_URL
export DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2-)"

# Push schema and data
npx prisma db push
npm run db:push-tools
```

## Step 6: Verify Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Test GitHub OAuth login
3. Test tool detection
4. Check that tools are visible (should see 491 tools)

## Troubleshooting

### Build Fails with Prisma Error
- Make sure `postinstall` script is in `package.json`
- Check that `DATABASE_URL` is set correctly in Vercel

### Database Connection Issues
- Verify `DATABASE_URL` format is correct
- Check if your database allows connections from Vercel IPs
- For Supabase: Check connection pooling settings

### OAuth Not Working
- Verify `NEXTAUTH_URL` matches your Vercel domain exactly
- Check GitHub OAuth callback URL matches
- Ensure `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct

### Tools Not Showing
- Run `npm run db:push-tools` with production `DATABASE_URL`
- Verify tools were imported successfully

## Environment Variables Summary

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | Your app URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Random secret for sessions | Generated with `openssl rand -base64 32` |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | From GitHub OAuth App |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | From GitHub OAuth App |

## Next Steps

- Set up custom domain in Vercel
- Enable Vercel Analytics
- Set up monitoring and alerts
- Configure automatic deployments from main branch

