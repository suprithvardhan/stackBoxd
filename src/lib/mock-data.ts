export type User = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  languages: string[];
  avatarUrl: string;
  githubUrl: string;
  websiteUrl?: string;
  twitterUrl?: string;
  stats: { toolsLogged: number; projects: number; lists: number; followers: number };
};

export type Tool = {
  slug: string;
  name: string;
  icon: string; // iconify id e.g., simple-icons:nextdotjs
  site?: string;
  category: string;
  avgRating: number;
  ratingsCount: number;
  usedByCount: number;
  color?: string; // brand hex
};

export type Project = {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  team?: string[];
  author?: string;
  coverImage: string;
  tools: string[]; // iconify ids
  repoUrl: string;
  stars: number;
  reflection: string;
  tagline?: string;
  about?: string;
  demoUrl?: string;
  highlights?: string[];
};

export type LogItem = {
  id: string;
  user: string;
  tool: { slug: string; name: string; icon: string };
  rating: number;
  review: string;
  tags: string[];
  project: { id: string; name: string } | null;
  createdAt: string;
  reactions: number;
  comments: number;
};

export const mockUser: User = {
  id: "usr_01h9a7",
  username: "suprithv",
  displayName: "Suprith V",
  bio: "Tech enthusiast, OSS builder—forever debugging life and code. Sharing lightweight infra and clean frontend joy.",
  languages: ["Go", "TypeScript", "Python"],
  avatarUrl: "https://avatars.githubusercontent.com/u/4625458?v=4",
  githubUrl: "https://github.com/suprithv",
  websiteUrl: "https://suprith.dev",
  twitterUrl: "https://twitter.com/suprithv",
  stats: { toolsLogged: 24, projects: 6, lists: 5, followers: 142 },
};

export const mockTools: Tool[] = [
  { slug: "fastapi", name: "FastAPI", icon: "simple-icons:fastapi", site: "https://fastapi.tiangolo.com", category: "backend", avgRating: 4.4, ratingsCount: 1183, usedByCount: 5632, color: "#009688" },
  { slug: "nextjs", name: "Next.js", icon: "simple-icons:nextdotjs", site: "https://nextjs.org", category: "frontend", avgRating: 4.8, ratingsCount: 4123, usedByCount: 20112, color: "#000000" },
  { slug: "react", name: "React", icon: "simple-icons:react", site: "https://react.dev", category: "frontend", avgRating: 4.7, ratingsCount: 10000, usedByCount: 800000, color: "#61DAFB" },
  { slug: "typescript", name: "TypeScript", icon: "simple-icons:typescript", site: "https://www.typescriptlang.org", category: "language", avgRating: 4.9, ratingsCount: 9200, usedByCount: 530000, color: "#3178c6" },
  { slug: "golang", name: "Go", icon: "simple-icons:go", site: "https://go.dev", category: "language", avgRating: 4.7, ratingsCount: 3511, usedByCount: 210000, color: "#00ADD8" },
  { slug: "python", name: "Python", icon: "simple-icons:python", site: "https://python.org", category: "language", avgRating: 4.8, ratingsCount: 12000, usedByCount: 420000, color: "#3776AB" },
  { slug: "vuejs", name: "Vue.js", icon: "simple-icons:vuejs", site: "https://vuejs.org", category: "frontend", avgRating: 4.6, ratingsCount: 2700, usedByCount: 170000, color: "#42b883" },
  { slug: "svelte", name: "Svelte", icon: "simple-icons:svelte", site: "https://svelte.dev", category: "frontend", avgRating: 4.5, ratingsCount: 1950, usedByCount: 83000, color: "#FF3E00" },
  { slug: "tailwindcss", name: "Tailwind CSS", icon: "simple-icons:tailwindcss", site: "https://tailwindcss.com", category: "frontend", avgRating: 4.9, ratingsCount: 2100, usedByCount: 90000, color: "#06B6D4" },
  { slug: "nodedotjs", name: "Node.js", icon: "simple-icons:nodedotjs", site: "https://nodejs.org", category: "backend", avgRating: 4.5, ratingsCount: 6100, usedByCount: 590000, color: "#3C873A" },
  { slug: "redis", name: "Redis", icon: "simple-icons:redis", site: "https://redis.io", category: "database", avgRating: 4.7, ratingsCount: 3140, usedByCount: 120300, color: "#DC382D" },
  { slug: "docker", name: "Docker", icon: "simple-icons:docker", site: "https://www.docker.com", category: "devops", avgRating: 4.8, ratingsCount: 8400, usedByCount: 600000, color: "#2496ED" },
  { slug: "prisma", name: "Prisma", icon: "simple-icons:prisma", site: "https://www.prisma.io", category: "database", avgRating: 4.6, ratingsCount: 1200, usedByCount: 18000, color: "#2D3748" },
  { slug: "vercel", name: "Vercel", icon: "simple-icons:vercel", site: "https://vercel.com", category: "devops", avgRating: 4.7, ratingsCount: 6000, usedByCount: 238900, color: "#000000" },
  { slug: "vite", name: "Vite", icon: "simple-icons:vite", site: "https://vitejs.dev", category: "frontend", avgRating: 4.7, ratingsCount: 4500, usedByCount: 118200, color: "#646CFF" },
  { slug: "tanstack-query", name: "TanStack Query", icon: "simple-icons:reactquery", site: "https://tanstack.com/query", category: "frontend", avgRating: 4.8, ratingsCount: 2700, usedByCount: 122200, color: "#FF4154" },
  { slug: "firebase", name: "Firebase", icon: "simple-icons:firebase", site: "https://firebase.google.com", category: "backend", avgRating: 4.5, ratingsCount: 9000, usedByCount: 168000, color: "#FFCA28" },
  { slug: "postgresql", name: "PostgreSQL", icon: "simple-icons:postgresql", site: "https://postgresql.org", category: "database", avgRating: 4.7, ratingsCount: 12500, usedByCount: 223000, color: "#336791" },
  { slug: "graphql", name: "GraphQL", icon: "simple-icons:graphql", site: "https://graphql.org", category: "api", avgRating: 4.5, ratingsCount: 6200, usedByCount: 83000, color: "#E10098" },
  { slug: "supabase", name: "Supabase", icon: "simple-icons:supabase", site: "https://supabase.io", category: "database", avgRating: 4.6, ratingsCount: 3200, usedByCount: 31000, color: "#3ECF8E" },
  { slug: "stripe", name: "Stripe", icon: "simple-icons:stripe", site: "https://stripe.com", category: "payments", avgRating: 4.8, ratingsCount: 9900, usedByCount: 204000, color: "#635BFF" },
  { slug: "clerk", name: "Clerk", icon: "simple-icons:clerk", site: "https://clerk.com", category: "auth", avgRating: 4.5, ratingsCount: 600, usedByCount: 12400, color: "#3B49DF" },
  // ... add others as needed ...
];

export const mockProjects: Project[] = [
  {
    id: "proj_01",
    name: "Realtime Chat",
    displayName: "Realtime Chat App",
    tagline: "Fast, modern group chat – sockets at scale.",
    description: "A modern full-stack chat experience with presence indicators, group messaging, and direct DMs—built to demo Node.js and real-world scaling.",
    about: "Built with React for the frontend, Node.js for websockets/api, and Redis for messaging backplane. Features include instant presence, typing indicators, rich markdown, invite links, and emoji reactions.",
    team: ["suprithv"],
    author: "suprithv",
    coverImage: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1200&auto=format&fit=crop",
    tools: ["simple-icons:react", "simple-icons:nodedotjs", "simple-icons:redis"],
    repoUrl: "https://github.com/you/realtime-chat",
    demoUrl: "https://demo-chat.example.com/",
    stars: 184,
    reflection: "Scaling sockets in Node required Redis PubSub and various backpressure strategies! Smart batching let us support 1K+ users in a single room.",
    highlights: ["Node.js Sockets","Redis PubSub","~2K Live Users","Markdown Support","Presence"],
  },
  {
    id: "proj_02",
    name: "AI Blog Generator",
    displayName: "AI Blog Generator (Next.js)",
    tagline: "SEO posts for every topic, in seconds.",
    description: "Generate fully written, SEO-friendly blog posts from a topic and outline—powered by OpenAI and Next.js 13's SSR support.",
    about: "Users input a topic, the app expands headline/outline and drafts a whole post using OpenAI's API. Deployed on Vercel for fast edge SSR, styled with Tailwind, and supports TypeScript types from front-to-back. Auto-publishes to a Ghost CMS.",
    team: ["suprithv", "jamie__macdev"],
    author: "suprithv",
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    tools: ["simple-icons:nextdotjs", "simple-icons:typescript", "simple-icons:tailwindcss"],
    repoUrl: "https://github.com/you/ai-blog-generator",
    demoUrl: "https://aiblog-demo.example.com/",
    stars: 321,
    reflection: "Combining SSR with OpenAI API—deployment on Vercel was seamless. Learning: caching is key for cost efficiency!",
    highlights: ["OpenAI GPT-4","SSR (Next.js)","Auto-Publish to Ghost","Topic Clustering"],
  },
  {
    id: "proj_03",
    name: "Micro SaaS Billing",
    displayName: "Micro SaaS Billing Platform",
    tagline: "Subscription management for indie SaaS projects.",
    description: "A compact, scalable billing platform. Handles user sign-up, recurring payments, tiered plans, usage metering, Stripe/webhooks, and email invoicing.",
    about: "Stack: Prisma ORM (Postgres), Dockerized microservices, TypeScript everywhere. Live Stripe integration, admin dashboard, secure webhooks, invoice PDFs, and metered billing support for SaaS use cases.",
    team: ["suprithv", "dockerhero"],
    author: "dockerhero",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
    tools: ["simple-icons:prisma", "simple-icons:docker", "simple-icons:postgresql", "simple-icons:stripe"],
    repoUrl: "https://github.com/you/micro-saas-billing",
    demoUrl: "https://billing-demo.example.com/",
    stars: 88,
    reflection: "Prisma migrations were effortless, Docker Compose saved weeks. Stripe webhook troubleshooting tips!",
    highlights: ["Docker Compose","Stripe Billing","Metered Usage","PDF Invoices","Prisma ORM"],
  },
  {
    id: "proj_04",
    name: "Vue Svelte Portfolio",
    displayName: "Svelte + Vue Portfolio",
    tagline: "A lively blog/portfolio hybrid, Svelte and Vue combined!",
    description: "Personal static portfolio & blog, built for speed and flexibility. SvelteKit and Vue combine for the best of both: Svelte’s SSR, Vue’s interactivity.",
    about: "Designer/dev demo that explores hybrid SvelteKit (SSR) and client-side Vue widgets. Custom markdown renderer for blog content, uses Tailwind CSS, and auto-deploys via GitHub Actions.",
    team: ["sveltefan","sarahvue"],
    author: "sarahvue",
    coverImage: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=1200&auto=format&fit=crop",
    tools: ["simple-icons:vuejs", "simple-icons:svelte", "simple-icons:tailwindcss"],
    repoUrl: "https://github.com/you/portfolio",
    demoUrl: "https://sveltevue.example.com/",
    stars: 117,
    reflection: "Chose Svelte for markdown/blog, Vue for interactivity. Tailwind for prototyping and styling everywhere! Learned hybrid deployment.",
    highlights: ["SvelteKit SSR","Vue Widgets","Tailwind CSS","GitHub Actions"],
  }
];

export const mockLogs: LogItem[] = [
  {
    id: "log_01",
    user: "arunCodes",
    tool: { slug: "fastapi", name: "FastAPI", icon: "simple-icons:fastapi" },
    rating: 4,
    review:
      "Super lightweight and async-friendly, but docs on middleware need more depth.",
    tags: ["backend", "python"],
    project: { id: "proj_09", name: "URL Shortener API" },
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    reactions: 24,
    comments: 4,
  },
  {
    id: "log_02",
    user: "suprithv",
    tool: { slug: "nextjs", name: "Next.js", icon: "simple-icons:nextdotjs" },
    rating: 5,
    review: "Outstanding DX. File-based routing with RSC makes SSR a breeze.",
    tags: ["frontend", "react"],
    project: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    reactions: 73,
    comments: 12,
  },
  {
    id: "log_03",
    user: "benutzer",
    tool: { slug: "typescript", name: "TypeScript", icon: "simple-icons:typescript" },
    rating: 5,
    review: "Type safety saves the day. Never going back!",
    tags: ["language", "frontend"],
    project: { id: "proj_02", name: "AI Blog Generator" },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    reactions: 12,
    comments: 2,
  },
  {
    id: "log_04",
    user: "eve_go",
    tool: { slug: "golang", name: "Go", icon: "simple-icons:go" },
    rating: 5,
    review: "Blazing fast and easy concurrency. The best choice for infra!",
    tags: ["backend", "language"],
    project: { id: "proj_03", name: "Micro SaaS Billing" },
    createdAt: new Date(Date.now() - 6.5 * 60 * 60 * 1000).toISOString(),
    reactions: 30,
    comments: 8,
  },
  {
    id: "log_05",
    user: "anita.js",
    tool: { slug: "vuejs", name: "Vue.js", icon: "simple-icons:vuejs" },
    rating: 4,
    review: "Simple to learn, powerful ecosystem. Nuxt rocks!",
    tags: ["frontend", "javascript"],
    project: { id: "proj_04", name: "Vue Svelte Portfolio" },
    createdAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
    reactions: 19,
    comments: 3,
  },
  {
    id: "log_06",
    user: "sveltefan",
    tool: { slug: "svelte", name: "Svelte", icon: "simple-icons:svelte" },
    rating: 5,
    review: "Vanishing reactivity, small bundle, ultra-smooth animations.",
    tags: ["frontend", "javascript"],
    project: { id: "proj_04", name: "Vue Svelte Portfolio" },
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    reactions: 10,
    comments: 1,
  },
  {
    id: "log_07",
    user: "prismanaut",
    tool: { slug: "prisma", name: "Prisma", icon: "simple-icons:prisma" },
    rating: 5,
    review: "Schema-first DB design finally feels right.",
    tags: ["database", "orm"],
    project: { id: "proj_03", name: "Micro SaaS Billing" },
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    reactions: 25,
    comments: 5,
  },
  {
    id: "log_08",
    user: "twind",
    tool: { slug: "tailwindcss", name: "Tailwind CSS", icon: "simple-icons:tailwindcss" },
    rating: 5,
    review: "Design system in minutes, never fight CSS again.",
    tags: ["frontend", "css"],
    project: { id: "proj_02", name: "AI Blog Generator" },
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    reactions: 44,
    comments: 6,
  },
  {
    id: "log_09",
    user: "dockerhero",
    tool: { slug: "docker", name: "Docker", icon: "simple-icons:docker" },
    rating: 5,
    review: "Local-to-cloud parity finally possible. Containers win everything.",
    tags: ["devops", "infra"],
    project: { id: "proj_03", name: "Micro SaaS Billing" },
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    reactions: 16,
    comments: 2,
  },
  {
    id: "log_10",
    user: "aliaksei",
    tool: { slug: "nodedotjs", name: "Node.js", icon: "simple-icons:nodedotjs" },
    rating: 4,
    review: "Async for the masses and npm universe is wild.",
    tags: ["backend", "infra"],
    project: { id: "proj_01", name: "Realtime Chat" },
    createdAt: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
    reactions: 12,
    comments: 1,
  },
  {
    id: 'log_11',
    user: "suprithv",
    tool: { slug: "postgresql", name: "PostgreSQL", icon: "simple-icons:postgresql" },
    rating: 4,
    review: "Robust open source database, great reliability. Used JSONB and indices.",
    tags: ["database", "sql"],
    project: { id: "proj_02", name: "AI Blog Generator" },
    createdAt: new Date(Date.now() - 66 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: 34,
    comments: 6,
  },
  {
    id: 'log_12',
    user: "suprithv",
    tool: { slug: "firebase", name: "Firebase", icon: "simple-icons:firebase" },
    rating: 5,
    review: "Realtime sync is smooth, perfect for MVP—love the hosted auth.",
    tags: ["backend", "realtime"],
    project: { id: "proj_01", name: "Realtime Chat" },
    createdAt: new Date(Date.now() - 51 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: 28,
    comments: 8,
  },
  {
    id: 'log_13',
    user: "suprithv",
    tool: { slug: "vercel", name: "Vercel", icon: "simple-icons:vercel" },
    rating: 5,
    review: "CI/CD is frictionless. Perfect for Next.js, zero config deploys!",
    tags: ["infra", "hosting"],
    project: null,
    createdAt: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: 22,
    comments: 5,
  },
  {
    id: 'log_14',
    user: "suprithv",
    tool: { slug: "graphql", name: "GraphQL", icon: "simple-icons:graphql" },
    rating: 4,
    review: "Schema-driven API was fun to explore, better docs would help new users!",
    tags: ["api", "frontend"],
    project: null,
    createdAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: 18,
    comments: 2,
  },
  {
    id: 'log_15',
    user: "suprithv",
    tool: { slug: "svelte", name: "Svelte", icon: "simple-icons:svelte" },
    rating: 5,
    review: "Lightweight—transitions & reactivity are beautiful. Tried for a hobby blog.",
    tags: ["frontend", "js"],
    project: null,
    createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: 11,
    comments: 3,
  },
];

export const mockUsers: User[] = [
  mockUser,
  {
    id: "usr_arunCodes",
    username: "arunCodes",
    displayName: "Arun K.",
    bio: "API explorer, Pythonista.",
    languages: ["Python", "TypeScript"],
    avatarUrl: "https://i.pravatar.cc/150?u=arunCodes",
    githubUrl: "https://github.com/arunCodes",
    stats: { toolsLogged: 12, projects: 3, lists: 1, followers: 32 },
  },
  {
    id: "usr_benutzer",
    username: "benutzer",
    displayName: "Ben U.",
    bio: "Static-typed everything.",
    languages: ["TypeScript", "Go"],
    avatarUrl: "https://i.pravatar.cc/150?u=benutzer",
    githubUrl: "https://github.com/benutzer",
    stats: { toolsLogged: 19, projects: 2, lists: 1, followers: 28 },
  },
  {
    id: "usr_sveltefan",
    username: "sveltefan",
    displayName: "Svelte Fan",
    bio: "Frontend minimalist.",
    languages: ["JavaScript", "Svelte"],
    avatarUrl: "https://i.pravatar.cc/150?u=sveltefan",
    githubUrl: "https://github.com/sveltefan",
    stats: { toolsLogged: 6, projects: 1, lists: 2, followers: 50 },
  },
  {
    id: "usr_dockerhero",
    username: "dockerhero",
    displayName: "Docker H.",
    bio: "Infra ops, containers all the way.",
    languages: ["Go", "Shell"],
    avatarUrl: "https://i.pravatar.cc/150?u=dockerhero",
    githubUrl: "https://github.com/dockerhero",
    stats: { toolsLogged: 8, projects: 2, lists: 1, followers: 14 },
  },
  {
    id: "usr_anita.js",
    username: "anita.js",
    displayName: "Anita JS",
    bio: "Loves Vue/Nuxt & CSS hacks.",
    languages: ["JavaScript", "Vue"],
    avatarUrl: "https://i.pravatar.cc/150?u=anitajs",
    githubUrl: "https://github.com/anitajs",
    stats: { toolsLogged: 10, projects: 2, lists: 2, followers: 39 },
  },
  {
    id: "usr_eve_go",
    username: "eve_go",
    displayName: "Eve Go",
    bio: "Backend wizard, Go concurrency explorer.",
    languages: ["Go", "Python"],
    avatarUrl: "https://i.pravatar.cc/150?u=evego",
    githubUrl: "https://github.com/evego",
    stats: { toolsLogged: 13, projects: 1, lists: 0, followers: 9 },
  },
  {
    id: "usr_prismanaut",
    username: "prismanaut",
    displayName: "Prisma Naut",
    bio: "ORM all day.",
    languages: ["TypeScript", "SQL"],
    avatarUrl: "https://i.pravatar.cc/150?u=prismanaut",
    githubUrl: "https://github.com/prismanaut",
    stats: { toolsLogged: 4, projects: 2, lists: 0, followers: 3 },
  },
  {
    id: "usr_twind",
    username: "twind",
    displayName: "Tailwind D.",
    bio: "Designer who codes.",
    languages: ["CSS", "JS"],
    avatarUrl: "https://i.pravatar.cc/150?u=twind",
    githubUrl: "https://github.com/twindcss",
    stats: { toolsLogged: 5, projects: 1, lists: 1, followers: 21 },
  },
  {
    id: "usr_aliaksei",
    username: "aliaksei",
    displayName: "Aliaksei S.",
    bio: "Node backend.",
    languages: ["JavaScript", "Node.js"],
    avatarUrl: "https://i.pravatar.cc/150?u=aliaksei",
    githubUrl: "https://github.com/aliaksei",
    stats: { toolsLogged: 7, projects: 1, lists: 1, followers: 11 },
  },
];


