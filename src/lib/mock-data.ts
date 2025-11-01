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
  username: "VeltCipher",
  displayName: "Velt Cipher",
  bio: "Tech enthusiast, OSS builder—forever debugging life and code. Sharing lightweight infra and clean frontend joy.",
  languages: ["Go", "TypeScript", "Python"],
  avatarUrl: "https://avatars.githubusercontent.com/u/4625458?v=4",
  githubUrl: "https://github.com/suprithv",
  websiteUrl: "https://suprith.dev",
  twitterUrl: "https://twitter.com/suprithv",
  stats: { toolsLogged: 24, projects: 6, lists: 5, followers: 142 },
};

export const mockTools: Tool[] = [
  // Frontend Frameworks
  { slug: "nextjs", name: "Next.js", icon: "simple-icons:nextdotjs", site: "https://nextjs.org", category: "frontend", avgRating: 4.8, ratingsCount: 4123, usedByCount: 20112, color: "#0070F3" },
  { slug: "react", name: "React", icon: "simple-icons:react", site: "https://react.dev", category: "frontend", avgRating: 4.7, ratingsCount: 10000, usedByCount: 800000, color: "#61DAFB" },
  { slug: "vuejs", name: "Vue.js", icon: "logos:vue", site: "https://vuejs.org", category: "frontend", avgRating: 4.6, ratingsCount: 2700, usedByCount: 170000, color: "#42b883" },
  { slug: "svelte", name: "Svelte", icon: "simple-icons:svelte", site: "https://svelte.dev", category: "frontend", avgRating: 4.5, ratingsCount: 1950, usedByCount: 83000, color: "#FF3E00" },
  { slug: "angular", name: "Angular", icon: "simple-icons:angular", site: "https://angular.io", category: "frontend", avgRating: 4.4, ratingsCount: 8500, usedByCount: 280000, color: "#DD0031" },
  { slug: "nuxt", name: "Nuxt", icon: "simple-icons:nuxtdotjs", site: "https://nuxt.com", category: "frontend", avgRating: 4.7, ratingsCount: 3200, usedByCount: 89000, color: "#00DC82" },
  { slug: "remix", name: "Remix", icon: "simple-icons:remix", site: "https://remix.run", category: "frontend", avgRating: 4.6, ratingsCount: 1800, usedByCount: 45000, color: "#F7F7F7" },
  { slug: "astro", name: "Astro", icon: "simple-icons:astro", site: "https://astro.build", category: "frontend", avgRating: 4.8, ratingsCount: 2400, usedByCount: 67000, color: "#FF5D01" },
  
  // Build Tools
  { slug: "vite", name: "Vite", icon: "simple-icons:vite", site: "https://vitejs.dev", category: "frontend", avgRating: 4.7, ratingsCount: 4500, usedByCount: 118200, color: "#646CFF" },
  { slug: "webpack", name: "Webpack", icon: "simple-icons:webpack", site: "https://webpack.js.org", category: "frontend", avgRating: 4.3, ratingsCount: 7800, usedByCount: 450000, color: "#8DD6F9" },
  { slug: "rollup", name: "Rollup", icon: "simple-icons:rollupdotjs", site: "https://rollupjs.org", category: "frontend", avgRating: 4.5, ratingsCount: 2100, usedByCount: 89000, color: "#EC4A3F" },
  { slug: "turbopack", name: "Turbopack", icon: "simple-icons:turborepo", site: "https://turbo.build", category: "frontend", avgRating: 4.6, ratingsCount: 800, usedByCount: 12000, color: "#EF4444" },
  
  // Styling
  { slug: "tailwindcss", name: "Tailwind CSS", icon: "simple-icons:tailwindcss", site: "https://tailwindcss.com", category: "frontend", avgRating: 4.9, ratingsCount: 2100, usedByCount: 90000, color: "#06B6D4" },
  { slug: "styled-components", name: "Styled Components", icon: "simple-icons:styledcomponents", site: "https://styled-components.com", category: "frontend", avgRating: 4.6, ratingsCount: 4200, usedByCount: 145000, color: "#DB7093" },
  { slug: "sass", name: "Sass", icon: "simple-icons:sass", site: "https://sass-lang.com", category: "frontend", avgRating: 4.5, ratingsCount: 8900, usedByCount: 320000, color: "#CC6699" },
  { slug: "css-modules", name: "CSS Modules", icon: "simple-icons:css3", site: "https://github.com/css-modules/css-modules", category: "frontend", avgRating: 4.4, ratingsCount: 3100, usedByCount: 98000, color: "#1572B6" },
  { slug: "emotion", name: "Emotion", icon: "mdi:emoticon", site: "https://emotion.sh", category: "frontend", avgRating: 4.5, ratingsCount: 1800, usedByCount: 56000, color: "#D36AC2" },
  
  // State Management
  { slug: "tanstack-query", name: "TanStack Query", icon: "simple-icons:reactquery", site: "https://tanstack.com/query", category: "frontend", avgRating: 4.8, ratingsCount: 2700, usedByCount: 122200, color: "#FF4154" },
  { slug: "redux", name: "Redux", icon: "simple-icons:redux", site: "https://redux.js.org", category: "frontend", avgRating: 4.5, ratingsCount: 12000, usedByCount: 450000, color: "#764ABC" },
  { slug: "zustand", name: "Zustand", icon: "simple-icons:zustand", site: "https://zustand-demo.pmnd.rs", category: "frontend", avgRating: 4.7, ratingsCount: 1500, usedByCount: 34000, color: "#443C3C" },
  { slug: "jotai", name: "Jotai", icon: "simple-icons:jotai", site: "https://jotai.org", category: "frontend", avgRating: 4.6, ratingsCount: 900, usedByCount: 18000, color: "#333333" },
  { slug: "recoil", name: "Recoil", icon: "simple-icons:recoil", site: "https://recoiljs.org", category: "frontend", avgRating: 4.4, ratingsCount: 1200, usedByCount: 29000, color: "#007AF4" },
  
  // Languages
  { slug: "typescript", name: "TypeScript", icon: "simple-icons:typescript", site: "https://www.typescriptlang.org", category: "language", avgRating: 4.9, ratingsCount: 9200, usedByCount: 530000, color: "#3178c6" },
  { slug: "javascript", name: "JavaScript", icon: "simple-icons:javascript", site: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", category: "language", avgRating: 4.6, ratingsCount: 50000, usedByCount: 12000000, color: "#F7DF1E" },
  { slug: "python", name: "Python", icon: "simple-icons:python", site: "https://python.org", category: "language", avgRating: 4.8, ratingsCount: 12000, usedByCount: 420000, color: "#3776AB" },
  { slug: "golang", name: "Go", icon: "simple-icons:go", site: "https://go.dev", category: "language", avgRating: 4.7, ratingsCount: 3511, usedByCount: 210000, color: "#00ADD8" },
  { slug: "rust", name: "Rust", icon: "simple-icons:rust", site: "https://www.rust-lang.org", category: "language", avgRating: 4.9, ratingsCount: 6800, usedByCount: 156000, color: "#CE422B" },
  { slug: "java", name: "Java", icon: "logos:java", site: "https://www.java.com", category: "language", avgRating: 4.4, ratingsCount: 25000, usedByCount: 850000, color: "#ED8B00" },
  { slug: "csharp", name: "C#", icon: "simple-icons:csharp", site: "https://dotnet.microsoft.com", category: "language", avgRating: 4.5, ratingsCount: 18000, usedByCount: 420000, color: "#239120" },
  { slug: "php", name: "PHP", icon: "simple-icons:php", site: "https://www.php.net", category: "language", avgRating: 4.2, ratingsCount: 22000, usedByCount: 780000, color: "#777BB4" },
  { slug: "ruby", name: "Ruby", icon: "simple-icons:ruby", site: "https://www.ruby-lang.org", category: "language", avgRating: 4.5, ratingsCount: 9800, usedByCount: 180000, color: "#CC342D" },
  { slug: "kotlin", name: "Kotlin", icon: "simple-icons:kotlin", site: "https://kotlinlang.org", category: "language", avgRating: 4.6, ratingsCount: 5600, usedByCount: 89000, color: "#7F52FF" },
  { slug: "swift", name: "Swift", icon: "simple-icons:swift", site: "https://swift.org", category: "language", avgRating: 4.7, ratingsCount: 7200, usedByCount: 145000, color: "#FA7343" },
  { slug: "dart", name: "Dart", icon: "simple-icons:dart", site: "https://dart.dev", category: "language", avgRating: 4.5, ratingsCount: 3400, usedByCount: 67000, color: "#0175C2" },
  { slug: "c", name: "C", icon: "simple-icons:c", site: "https://en.cppreference.com/w/c", category: "language", avgRating: 4.6, ratingsCount: 28000, usedByCount: 1200000, color: "#A8B9CC" },
  { slug: "cpp", name: "C++", icon: "simple-icons:cplusplus", site: "https://isocpp.org", category: "language", avgRating: 4.5, ratingsCount: 32000, usedByCount: 890000, color: "#00599C" },
  { slug: "csharp", name: "C#", icon: "simple-icons:csharp", site: "https://dotnet.microsoft.com", category: "language", avgRating: 4.5, ratingsCount: 18000, usedByCount: 420000, color: "#239120" },
  { slug: "haskell", name: "Haskell", icon: "simple-icons:haskell", site: "https://www.haskell.org", category: "language", avgRating: 4.6, ratingsCount: 4200, usedByCount: 56000, color: "#5D4F85" },
  { slug: "elixir", name: "Elixir", icon: "simple-icons:elixir", site: "https://elixir-lang.org", category: "language", avgRating: 4.7, ratingsCount: 3800, usedByCount: 67000, color: "#4B275F" },
  { slug: "erlang", name: "Erlang", icon: "simple-icons:erlang", site: "https://www.erlang.org", category: "language", avgRating: 4.4, ratingsCount: 2100, usedByCount: 34000, color: "#A90533" },
  { slug: "scala", name: "Scala", icon: "simple-icons:scala", site: "https://www.scala-lang.org", category: "language", avgRating: 4.5, ratingsCount: 4800, usedByCount: 78000, color: "#DC322F" },
  { slug: "clojure", name: "Clojure", icon: "simple-icons:clojure", site: "https://clojure.org", category: "language", avgRating: 4.4, ratingsCount: 2400, usedByCount: 45000, color: "#5881D8" },
  { slug: "r", name: "R", icon: "simple-icons:r", site: "https://www.r-project.org", category: "language", avgRating: 4.3, ratingsCount: 6800, usedByCount: 145000, color: "#276DC3" },
  { slug: "lua", name: "Lua", icon: "simple-icons:lua", site: "https://www.lua.org", category: "language", avgRating: 4.5, ratingsCount: 3200, usedByCount: 89000, color: "#2C2D72" },
  { slug: "perl", name: "Perl", icon: "simple-icons:perl", site: "https://www.perl.org", category: "language", avgRating: 4.2, ratingsCount: 5600, usedByCount: 123000, color: "#39457E" },
  { slug: "shell", name: "Shell", icon: "simple-icons:gnubash", site: "https://www.gnu.org/software/bash", category: "language", avgRating: 4.4, ratingsCount: 12400, usedByCount: 890000, color: "#4EAA25" },
  { slug: "powershell", name: "PowerShell", icon: "simple-icons:powershell", site: "https://learn.microsoft.com/powershell", category: "language", avgRating: 4.5, ratingsCount: 4200, usedByCount: 98000, color: "#5391FE" },
  { slug: "objective-c", name: "Objective-C", icon: "simple-icons:apple", site: "https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC", category: "language", avgRating: 4.1, ratingsCount: 3400, usedByCount: 67000, color: "#3C9CD7" },
  { slug: "assembly", name: "Assembly", icon: "simple-icons:assemblyscript", site: "https://www.assemblyscript.org", category: "language", avgRating: 4.3, ratingsCount: 1800, usedByCount: 23000, color: "#007AAC" },
  { slug: "julia", name: "Julia", icon: "simple-icons:julia", site: "https://julialang.org", category: "language", avgRating: 4.7, ratingsCount: 2800, usedByCount: 45000, color: "#9558B2" },
  { slug: "fsharp", name: "F#", icon: "simple-icons:fsharp", site: "https://fsharp.org", category: "language", avgRating: 4.5, ratingsCount: 2100, usedByCount: 34000, color: "#378BBA" },
  { slug: "ocaml", name: "OCaml", icon: "simple-icons:ocaml", site: "https://ocaml.org", category: "language", avgRating: 4.4, ratingsCount: 1200, usedByCount: 18000, color: "#EC6813" },
  { slug: "zig", name: "Zig", icon: "simple-icons:zig", site: "https://ziglang.org", category: "language", avgRating: 4.6, ratingsCount: 1800, usedByCount: 28000, color: "#F7A41D" },
  { slug: "nim", name: "Nim", icon: "simple-icons:nim", site: "https://nim-lang.org", category: "language", avgRating: 4.5, ratingsCount: 1400, usedByCount: 21000, color: "#FFE953" },
  { slug: "crystal", name: "Crystal", icon: "simple-icons:crystal", site: "https://crystal-lang.org", category: "language", avgRating: 4.5, ratingsCount: 1600, usedByCount: 24000, color: "#000100" },
  { slug: "elm", name: "Elm", icon: "simple-icons:elm", site: "https://elm-lang.org", category: "language", avgRating: 4.6, ratingsCount: 1900, usedByCount: 29000, color: "#1293D8" },
  { slug: "reason", name: "Reason", icon: "simple-icons:reason", site: "https://reasonml.github.io", category: "language", avgRating: 4.4, ratingsCount: 800, usedByCount: 12000, color: "#DD4B39" },
  { slug: "ocaml", name: "OCaml", icon: "simple-icons:ocaml", site: "https://ocaml.org", category: "language", avgRating: 4.4, ratingsCount: 1200, usedByCount: 18000, color: "#EC6813" },
  { slug: "tcl", name: "Tcl", icon: "simple-icons:tcl", site: "https://www.tcl.tk", category: "language", avgRating: 4.1, ratingsCount: 900, usedByCount: 15000, color: "#E8CC3C" },
  { slug: "matlab", name: "MATLAB", icon: "simple-icons:mathworks", site: "https://www.mathworks.com/products/matlab.html", category: "language", avgRating: 4.4, ratingsCount: 6800, usedByCount: 145000, color: "#0076A8" },
  { slug: "fortran", name: "Fortran", icon: "simple-icons:fortran", site: "https://fortran-lang.org", category: "language", avgRating: 4.2, ratingsCount: 2100, usedByCount: 34000, color: "#734F96" },
  { slug: "cobol", name: "COBOL", icon: "simple-icons:cobol", site: "https://www.microfocus.com/en-us/products/cobol", category: "language", avgRating: 4.0, ratingsCount: 1800, usedByCount: 28000, color: "#004E98" },
  { slug: "vbnet", name: "VB.NET", icon: "simple-icons:dotnet", site: "https://dotnet.microsoft.com/languages/vb", category: "language", avgRating: 4.2, ratingsCount: 3200, usedByCount: 67000, color: "#512BD4" },
  { slug: "delphi", name: "Delphi", icon: "simple-icons:delphi", site: "https://www.embarcadero.com/products/delphi", category: "language", avgRating: 4.3, ratingsCount: 2400, usedByCount: 45000, color: "#EE1F35" },
  
  // Backend Frameworks
  { slug: "fastapi", name: "FastAPI", icon: "simple-icons:fastapi", site: "https://fastapi.tiangolo.com", category: "backend", avgRating: 4.4, ratingsCount: 1183, usedByCount: 5632, color: "#009688" },
  { slug: "nodedotjs", name: "Node.js", icon: "simple-icons:nodedotjs", site: "https://nodejs.org", category: "backend", avgRating: 4.5, ratingsCount: 6100, usedByCount: 590000, color: "#3C873A" },
  { slug: "express", name: "Express", icon: "simple-icons:express", site: "https://expressjs.com", category: "backend", avgRating: 4.4, ratingsCount: 18500, usedByCount: 560000, color: "#FFFFFF" },
  { slug: "nestjs", name: "NestJS", icon: "simple-icons:nestjs", site: "https://nestjs.com", category: "backend", avgRating: 4.7, ratingsCount: 4200, usedByCount: 89000, color: "#E0234E" },
  { slug: "django", name: "Django", icon: "simple-icons:django", site: "https://www.djangoproject.com", category: "backend", avgRating: 4.6, ratingsCount: 9800, usedByCount: 145000, color: "#44B78B" },
  { slug: "flask", name: "Flask", icon: "simple-icons:flask", site: "https://flask.palletsprojects.com", category: "backend", avgRating: 4.5, ratingsCount: 7200, usedByCount: 98000, color: "#3776AB" },
  { slug: "rails", name: "Ruby on Rails", icon: "simple-icons:rubyonrails", site: "https://rubyonrails.org", category: "backend", avgRating: 4.6, ratingsCount: 8600, usedByCount: 112000, color: "#CC0000" },
  { slug: "spring", name: "Spring Boot", icon: "simple-icons:springboot", site: "https://spring.io/projects/spring-boot", category: "backend", avgRating: 4.5, ratingsCount: 12400, usedByCount: 280000, color: "#6DB33F" },
  { slug: "aspnet", name: "ASP.NET", icon: "simple-icons:dotnet", site: "https://dotnet.microsoft.com", category: "backend", avgRating: 4.5, ratingsCount: 9500, usedByCount: 167000, color: "#512BD4" },
  { slug: "gin", name: "Gin", icon: "simple-icons:go", site: "https://gin-gonic.com", category: "backend", avgRating: 4.6, ratingsCount: 2100, usedByCount: 34000, color: "#00ADD8" },
  { slug: "echo", name: "Echo", icon: "simple-icons:go", site: "https://echo.labstack.com", category: "backend", avgRating: 4.5, ratingsCount: 1800, usedByCount: 28000, color: "#00ADD8" },
  { slug: "actix", name: "Actix", icon: "simple-icons:rust", site: "https://actix.rs", category: "backend", avgRating: 4.7, ratingsCount: 1200, usedByCount: 18000, color: "#CE422B" },
  
  // Databases
  { slug: "postgresql", name: "PostgreSQL", icon: "simple-icons:postgresql", site: "https://postgresql.org", category: "database", avgRating: 4.7, ratingsCount: 12500, usedByCount: 223000, color: "#336791" },
  { slug: "mysql", name: "MySQL", icon: "simple-icons:mysql", site: "https://www.mysql.com", category: "database", avgRating: 4.5, ratingsCount: 18500, usedByCount: 450000, color: "#4479A1" },
  { slug: "mongodb", name: "MongoDB", icon: "simple-icons:mongodb", site: "https://www.mongodb.com", category: "database", avgRating: 4.6, ratingsCount: 15200, usedByCount: 380000, color: "#47A248" },
  { slug: "redis", name: "Redis", icon: "simple-icons:redis", site: "https://redis.io", category: "database", avgRating: 4.7, ratingsCount: 3140, usedByCount: 120300, color: "#DC382D" },
  { slug: "prisma", name: "Prisma", icon: "simple-icons:prisma", site: "https://www.prisma.io", category: "database", avgRating: 4.6, ratingsCount: 1200, usedByCount: 18000, color: "#2D3748" },
  { slug: "supabase", name: "Supabase", icon: "simple-icons:supabase", site: "https://supabase.io", category: "database", avgRating: 4.6, ratingsCount: 3200, usedByCount: 31000, color: "#3ECF8E" },
  { slug: "firebase", name: "Firebase", icon: "simple-icons:firebase", site: "https://firebase.google.com", category: "backend", avgRating: 4.5, ratingsCount: 9000, usedByCount: 168000, color: "#FFCA28" },
  { slug: "cassandra", name: "Cassandra", icon: "simple-icons:apachecassandra", site: "https://cassandra.apache.org", category: "database", avgRating: 4.4, ratingsCount: 2100, usedByCount: 34000, color: "#1287B1" },
  { slug: "elasticsearch", name: "Elasticsearch", icon: "simple-icons:elasticsearch", site: "https://www.elastic.co", category: "database", avgRating: 4.6, ratingsCount: 4800, usedByCount: 89000, color: "#005571" },
  { slug: "dynamodb", name: "DynamoDB", icon: "simple-icons:amazondynamodb", site: "https://aws.amazon.com/dynamodb", category: "database", avgRating: 4.5, ratingsCount: 3600, usedByCount: 78000, color: "#4053D6" },
  { slug: "sqlite", name: "SQLite", icon: "simple-icons:sqlite", site: "https://www.sqlite.org", category: "database", avgRating: 4.7, ratingsCount: 8900, usedByCount: 245000, color: "#0E7FC0" },
  { slug: "cockroachdb", name: "CockroachDB", icon: "simple-icons:cockroachlabs", site: "https://www.cockroachlabs.com", category: "database", avgRating: 4.5, ratingsCount: 800, usedByCount: 12000, color: "#6933FF" },
  { slug: "planetscale", name: "PlanetScale", icon: "simple-icons:planetscale", site: "https://planetscale.com", category: "database", avgRating: 4.6, ratingsCount: 1200, usedByCount: 18000, color: "#F2F2F2" },
  
  // DevOps & Infrastructure
  { slug: "docker", name: "Docker", icon: "simple-icons:docker", site: "https://www.docker.com", category: "devops", avgRating: 4.8, ratingsCount: 8400, usedByCount: 600000, color: "#2496ED" },
  { slug: "kubernetes", name: "Kubernetes", icon: "simple-icons:kubernetes", site: "https://kubernetes.io", category: "devops", avgRating: 4.7, ratingsCount: 9600, usedByCount: 245000, color: "#326CE5" },
  { slug: "vercel", name: "Vercel", icon: "simple-icons:vercel", site: "https://vercel.com", category: "devops", avgRating: 4.7, ratingsCount: 6000, usedByCount: 238900, color: "#FFFFFF" },
  { slug: "aws", name: "AWS", icon: "simple-icons:amazonaws", site: "https://aws.amazon.com", category: "devops", avgRating: 4.6, ratingsCount: 35000, usedByCount: 1200000, color: "#FF9900" },
  { slug: "terraform", name: "Terraform", icon: "simple-icons:terraform", site: "https://www.terraform.io", category: "devops", avgRating: 4.7, ratingsCount: 6800, usedByCount: 156000, color: "#7B42BC" },
  { slug: "ansible", name: "Ansible", icon: "simple-icons:ansible", site: "https://www.ansible.com", category: "devops", avgRating: 4.5, ratingsCount: 4200, usedByCount: 89000, color: "#EE0000" },
  { slug: "jenkins", name: "Jenkins", icon: "simple-icons:jenkins", site: "https://www.jenkins.io", category: "devops", avgRating: 4.4, ratingsCount: 7800, usedByCount: 198000, color: "#D24939" },
  { slug: "github-actions", name: "GitHub Actions", icon: "simple-icons:githubactions", site: "https://github.com/features/actions", category: "devops", avgRating: 4.7, ratingsCount: 12400, usedByCount: 380000, color: "#2088FF" },
  { slug: "gitlab", name: "GitLab CI", icon: "simple-icons:gitlab", site: "https://about.gitlab.com", category: "devops", avgRating: 4.6, ratingsCount: 6800, usedByCount: 145000, color: "#FC6D26" },
  { slug: "circleci", name: "CircleCI", icon: "simple-icons:circleci", site: "https://circleci.com", category: "devops", avgRating: 4.5, ratingsCount: 3400, usedByCount: 78000, color: "#FFF" },
  { slug: "netlify", name: "Netlify", icon: "simple-icons:netlify", site: "https://www.netlify.com", category: "devops", avgRating: 4.6, ratingsCount: 5200, usedByCount: 123000, color: "#00C7B7" },
  { slug: "railway", name: "Railway", icon: "simple-icons:railway", site: "https://railway.app", category: "devops", avgRating: 4.7, ratingsCount: 2100, usedByCount: 34000, color: "#0B0D0E" },
  { slug: "render", name: "Render", icon: "simple-icons:render", site: "https://render.com", category: "devops", avgRating: 4.6, ratingsCount: 1800, usedByCount: 28000, color: "#46E3B7" },
  { slug: "cloudflare", name: "Cloudflare", icon: "simple-icons:cloudflare", site: "https://www.cloudflare.com", category: "devops", avgRating: 4.7, ratingsCount: 9800, usedByCount: 456000, color: "#F38020" },
  { slug: "nginx", name: "Nginx", icon: "simple-icons:nginx", site: "https://www.nginx.com", category: "devops", avgRating: 4.8, ratingsCount: 15200, usedByCount: 890000, color: "#009639" },
  
  // API & GraphQL
  { slug: "graphql", name: "GraphQL", icon: "simple-icons:graphql", site: "https://graphql.org", category: "api", avgRating: 4.5, ratingsCount: 6200, usedByCount: 83000, color: "#E10098" },
  { slug: "apollo", name: "Apollo GraphQL", icon: "simple-icons:apollographql", site: "https://www.apollographql.com", category: "api", avgRating: 4.6, ratingsCount: 3400, usedByCount: 67000, color: "#311C87" },
  { slug: "tRPC", name: "tRPC", icon: "simple-icons:trpc", site: "https://trpc.io", category: "api", avgRating: 4.7, ratingsCount: 2100, usedByCount: 34000, color: "#2596BE" },
  { slug: "rest", name: "REST API", icon: "mdi:api", site: "https://restfulapi.net", category: "api", avgRating: 4.4, ratingsCount: 50000, usedByCount: 5000000, color: "#FF5733" },
  { slug: "postman", name: "Postman", icon: "simple-icons:postman", site: "https://www.postman.com", category: "api", avgRating: 4.6, ratingsCount: 12400, usedByCount: 280000, color: "#FF6C37" },
  { slug: "insomnia", name: "Insomnia", icon: "simple-icons:insomnia", site: "https://insomnia.rest", category: "api", avgRating: 4.5, ratingsCount: 2400, usedByCount: 56000, color: "#5849BE" },
  
  // Testing
  { slug: "jest", name: "Jest", icon: "simple-icons:jest", site: "https://jestjs.io", category: "testing", avgRating: 4.6, ratingsCount: 18500, usedByCount: 456000, color: "#C21325" },
  { slug: "vitest", name: "Vitest", icon: "simple-icons:vitest", site: "https://vitest.dev", category: "testing", avgRating: 4.7, ratingsCount: 3200, usedByCount: 78000, color: "#6E9F18" },
  { slug: "cypress", name: "Cypress", icon: "simple-icons:cypress", site: "https://www.cypress.io", category: "testing", avgRating: 4.7, ratingsCount: 6800, usedByCount: 123000, color: "#17202C" },
  { slug: "playwright", name: "Playwright", icon: "simple-icons:playwright", site: "https://playwright.dev", category: "testing", avgRating: 4.8, ratingsCount: 4200, usedByCount: 89000, color: "#2EAD33" },
  { slug: "testing-library", name: "Testing Library", icon: "simple-icons:testinglibrary", site: "https://testing-library.com", category: "testing", avgRating: 4.7, ratingsCount: 5600, usedByCount: 145000, color: "#E33332" },
  { slug: "pytest", name: "pytest", icon: "simple-icons:pytest", site: "https://pytest.org", category: "testing", avgRating: 4.7, ratingsCount: 9800, usedByCount: 234000, color: "#0A9EDC" },
  { slug: "mocha", name: "Mocha", icon: "simple-icons:mocha", site: "https://mochajs.org", category: "testing", avgRating: 4.5, ratingsCount: 7200, usedByCount: 167000, color: "#8D6748" },
  { slug: "selenium", name: "Selenium", icon: "simple-icons:selenium", site: "https://www.selenium.dev", category: "testing", avgRating: 4.4, ratingsCount: 12400, usedByCount: 345000, color: "#43B02A" },
  
  // Authentication & Security
  { slug: "clerk", name: "Clerk", icon: "simple-icons:clerk", site: "https://clerk.com", category: "auth", avgRating: 4.5, ratingsCount: 600, usedByCount: 12400, color: "#3B49DF" },
  { slug: "auth0", name: "Auth0", icon: "simple-icons:auth0", site: "https://auth0.com", category: "auth", avgRating: 4.6, ratingsCount: 6800, usedByCount: 145000, color: "#EB5424" },
  { slug: "nextauth", name: "NextAuth.js", icon: "simple-icons:nextdotjs", site: "https://next-auth.js.org", category: "auth", avgRating: 4.7, ratingsCount: 4200, usedByCount: 89000, color: "#0070F3" },
  { slug: "passport", name: "Passport.js", icon: "simple-icons:passport", site: "http://www.passportjs.org", category: "auth", avgRating: 4.5, ratingsCount: 5600, usedByCount: 123000, color: "#34E27A" },
  { slug: "oauth", name: "OAuth", icon: "logos:oauth", site: "https://oauth.net", category: "auth", avgRating: 4.4, ratingsCount: 15000, usedByCount: 890000, color: "#4285F4" },
  { slug: "jwt", name: "JWT", icon: "simple-icons:jsonwebtokens", site: "https://jwt.io", category: "auth", avgRating: 4.5, ratingsCount: 18600, usedByCount: 567000, color: "#F8991D" },
  
  // Payments
  { slug: "stripe", name: "Stripe", icon: "simple-icons:stripe", site: "https://stripe.com", category: "payments", avgRating: 4.8, ratingsCount: 9900, usedByCount: 204000, color: "#635BFF" },
  { slug: "paypal", name: "PayPal", icon: "simple-icons:paypal", site: "https://www.paypal.com", category: "payments", avgRating: 4.4, ratingsCount: 12400, usedByCount: 345000, color: "#00457C" },
  { slug: "paddle", name: "Paddle", icon: "simple-icons:paddle", site: "https://paddle.com", category: "payments", avgRating: 4.6, ratingsCount: 1800, usedByCount: 34000, color: "#0065FF" },
  
  // Mobile
  { slug: "react-native", name: "React Native", icon: "simple-icons:react", site: "https://reactnative.dev", category: "mobile", avgRating: 4.6, ratingsCount: 15200, usedByCount: 380000, color: "#61DAFB" },
  { slug: "flutter", name: "Flutter", icon: "simple-icons:flutter", site: "https://flutter.dev", category: "mobile", avgRating: 4.7, ratingsCount: 18600, usedByCount: 567000, color: "#02569B" },
  { slug: "expo", name: "Expo", icon: "simple-icons:expo", site: "https://expo.dev", category: "mobile", avgRating: 4.6, ratingsCount: 6800, usedByCount: 145000, color: "#4630EB" },
  { slug: "ionic", name: "Ionic", icon: "simple-icons:ionic", site: "https://ionicframework.com", category: "mobile", avgRating: 4.4, ratingsCount: 4200, usedByCount: 89000, color: "#3880FF" },
  { slug: "xamarin", name: "Xamarin", icon: "simple-icons:xamarin", site: "https://dotnet.microsoft.com/apps/xamarin", category: "mobile", avgRating: 4.3, ratingsCount: 3400, usedByCount: 78000, color: "#3498DB" },
  
  // Design & UI Tools
  { slug: "figma", name: "Figma", icon: "simple-icons:figma", site: "https://www.figma.com", category: "design", avgRating: 4.8, ratingsCount: 25000, usedByCount: 890000, color: "#F24E1E" },
  { slug: "sketch", name: "Sketch", icon: "simple-icons:sketch", site: "https://www.sketch.com", category: "design", avgRating: 4.6, ratingsCount: 9800, usedByCount: 234000, color: "#F7B500" },
  { slug: "adobe-xd", name: "Adobe XD", icon: "simple-icons:adobexd", site: "https://www.adobe.com/products/xd.html", category: "design", avgRating: 4.5, ratingsCount: 6800, usedByCount: 145000, color: "#FF61F6" },
  { slug: "framer", name: "Framer", icon: "simple-icons:framer", site: "https://www.framer.com", category: "design", avgRating: 4.7, ratingsCount: 4200, usedByCount: 89000, color: "#0055FF" },
  
  // Monitoring & Analytics
  { slug: "sentry", name: "Sentry", icon: "simple-icons:sentry", site: "https://sentry.io", category: "devops", avgRating: 4.7, ratingsCount: 8600, usedByCount: 198000, color: "#FB4226" },
  { slug: "datadog", name: "Datadog", icon: "simple-icons:datadog", site: "https://www.datadoghq.com", category: "devops", avgRating: 4.6, ratingsCount: 5200, usedByCount: 123000, color: "#632CA6" },
  { slug: "newrelic", name: "New Relic", icon: "simple-icons:newrelic", site: "https://newrelic.com", category: "devops", avgRating: 4.5, ratingsCount: 4200, usedByCount: 89000, color: "#008C99" },
  { slug: "grafana", name: "Grafana", icon: "simple-icons:grafana", site: "https://grafana.com", category: "devops", avgRating: 4.7, ratingsCount: 6800, usedByCount: 145000, color: "#F46800" },
  { slug: "prometheus", name: "Prometheus", icon: "simple-icons:prometheus", site: "https://prometheus.io", category: "devops", avgRating: 4.7, ratingsCount: 4200, usedByCount: 89000, color: "#E6522C" },
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


