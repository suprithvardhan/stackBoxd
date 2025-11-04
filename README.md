# StackBoxd

**Log, rate, and reflect on your developer stack.**

StackBoxd is a social platform for developers to document the tools they use, discover new technologies, and build a public portfolio of their tech stack. Think Letterboxd, but for your development tools.

![StackBoxd](https://img.shields.io/badge/status-active-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## What is StackBoxd?

Every developer has a story. The frameworks you chose, the databases you tried, the tools that changed how you work. StackBoxd lets you tell that story.

Instead of just listing technologies on your resume, you can log them with ratings, write reflections, and see how your stack evolves over time. Share your projects, discover what others are using, and build lists of your favorite tools.

![Alt text](https://github.com/user-attachments/assets/938c669c-38ef-49ec-94f6-2f9c699d3486)


### Key Features

**🔍 Smart Tool Detection**
- Connect your GitHub repos and automatically detect the tools you're using
- Our algorithm reads package.json files and matches packages to tools in our database
- No manual tagging needed—just sync and go

**📝 Log Your Stack**
- Rate tools you've used (1-5 stars)
- Write reviews and reflections
- Link tools to specific projects for context

**📊 Project Showcases**
- Sync all your GitHub repositories
- Beautiful project pages with auto-detected tech stacks
- Show off what you've built and how you built it

**👥 Social Features**
- Follow other developers
- Like and comment on tool logs
- Discover trending tools and what's popular in your network

**📚 Curated Lists**
- Create public lists of your favorite tools
- "Best React State Management Libraries"
- "My Go-To Backend Stack"
- Share your opinions with the community

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- GitHub OAuth App (for authentication and repo syncing)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/stackboxd.git
cd stackboxd

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Fill in your `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/stackboxd"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Push tools data to database (required - populates 491 tools from db-tools.json)
npm run db:push-tools
```

**Note**: The `data/db-tools.json` file contains 491 tools with metadata and package name mappings. You must run `npm run db:push-tools` to populate the database before starting the application, otherwise you won't see any tools in the app.

### GitHub OAuth Setup

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set:
   - **Application name**: StackBoxd (or whatever you like)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env` file

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Tool Detection

When you sync your GitHub repos, StackBoxd:

1. **Fetches language data** from GitHub's API to detect primary languages
2. **Detects Dependency files** to extract all dependencies
3. **Matches packages to tools** using our database of 470+ tools with package name mappings

The matching algorithm is database-driven: we maintain a `packageNames` field for each tool that contains all known package aliases. This means `framer-motion` matches to "Framer Motion", `@tanstack/react-query` matches to "TanStack Query", and so on.

### Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety throughout
- **Prisma** - Database ORM with PostgreSQL
- **NextAuth.js v5** - Authentication with GitHub OAuth
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animations
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management

## Development

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes to database
npm run db:push-tools    # Push tools data from db-tools.json to database
npm run db:seed          # Seed database with mock data
npm run db:studio        # Open Prisma Studio
```

### Database Migrations

We use Prisma's `db push` for rapid development. For production, consider using migrations:

```bash
npm run db:migrate
```

### Adding New Tools

Tools are stored in the database with package name mappings. To add a new tool or update package names:

1. Use Prisma Studio: `npm run db:studio`
2. Or create a script in `scripts/` to bulk update tools
3. The `packageNames` field is a JSON array of all known package aliases

## Contributing

We welcome contributions! Here's how you can help:

1. **Report bugs** - Found something broken? Open an issue
2. **Suggest features** - Have an idea? We'd love to hear it
3. **Submit PRs** - Fix bugs, add features, improve docs
4. **Add tools** - Help us expand our database of tools

### Adding Package Names

One of the most valuable contributions is adding package name mappings for tools. If you notice a package isn't matching correctly:

1. Check if the tool exists in the database
2. Add the missing package name to the tool's `packageNames` array
3. The matching algorithm will pick it up automatically

## Roadmap

- [ ] Support for more dependency files (Cargo.toml, requirements.txt, go.mod)
- [ ] Tool recommendations based on your stack
- [ ] Export your stack as JSON/Markdown
- [ ] API for third-party integrations
- [ ] Mobile app
- [ ] Team/organization accounts

## FAQ

**Do I need GitHub?**  
Yes, for now. We use it for auth and repo syncing. We only request read permissions.

**Is my data private?**  
Logs and projects are public by default (like Letterboxd). This is a social platform. Private logs might come later.

**How accurate is detection?**  
Very. We only match packages that are explicitly in our database. No fuzzy matching = no false positives. If something isn't matching, it's probably missing from the database—please add it!

**Can I use this without GitHub repos?**  
Not currently. Manual tool entry might come later, but the auto-detection is the killer feature.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [Letterboxd](https://letterboxd.com) - the social platform for film lovers
- Built with love by developers who wanted a better way to document their stack

---

**Built with** Next.js, TypeScript, Prisma, and a lot of coffee ☕
