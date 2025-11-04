import { getToolMatcher } from "./tool-matcher"

// ============================================================================
// Phase 2: Comprehensive Dependency File Detection
// ============================================================================

// Map of languages to their dependency files
const LANGUAGE_DEPENDENCY_FILES: Record<string, string[]> = {
  // JavaScript/TypeScript
  "JavaScript": [
    "package.json",
    "package-lock.json",
    "yarn.lock",
    ".yarnrc.yml",
    "pnpm-lock.yaml",
    "bun.lockb",
    "deno.json",
    "deno.jsonc",
  ],
  "TypeScript": [
    "package.json",
    "package-lock.json",
    "yarn.lock",
    ".yarnrc.yml",
    "pnpm-lock.yaml",
    "bun.lockb",
    "tsconfig.json", // Can indicate TypeScript usage
  ],
  
  // Python
  "Python": [
    "requirements.txt",
    "requirements.in",
    "Pipfile",
    "Pipfile.lock",
    "pyproject.toml",
    "poetry.lock",
    "setup.py",
    "setup.cfg",
    "environment.yml", // Conda
    "conda.yml",
  ],
  
  // Java/JVM
  "Java": [
    "pom.xml",
    "build.gradle",
    "build.gradle.kts",
    "settings.gradle",
    "gradle.properties",
    "ivy.xml",
    "build.xml",
  ],
  "Kotlin": [
    "build.gradle.kts",
    "build.gradle",
    "settings.gradle",
  ],
  "Scala": [
    "build.sbt",
    "project/build.properties",
  ],
  "Clojure": [
    "project.clj",
    "deps.edn",
  ],
  
  // Rust
  "Rust": [
    "Cargo.toml",
    "Cargo.lock",
  ],
  
  // Go
  "Go": [
    "go.mod",
    "go.sum",
    "Gopkg.toml",
    "Gopkg.lock",
    "vendor/manifest", // Old vendor system
  ],
  
  // Ruby
  "Ruby": [
    "Gemfile",
    "Gemfile.lock",
    ".ruby-version",
  ],
  
  // PHP
  "PHP": [
    "composer.json",
    "composer.lock",
  ],
  
  // C/C++
  "C": [
    "CMakeLists.txt",
    "Makefile",
    "meson.build",
    "vcpkg.json",
    "conanfile.txt",
    "conanfile.py",
  ],
  "C++": [
    "CMakeLists.txt",
    "Makefile",
    "meson.build",
    "vcpkg.json",
    "conanfile.txt",
    "conanfile.py",
    "WORKSPACE", // Bazel
    "BUILD", // Bazel
  ],
  
  // Swift/Objective-C
  "Swift": [
    "Package.swift",
    "Package.resolved",
    "Podfile",
    "Podfile.lock",
    "Cartfile",
    "Cartfile.resolved",
  ],
  "Objective-C": [
    "Podfile",
    "Podfile.lock",
    "Cartfile",
    "Cartfile.resolved",
  ],
  
  // .NET/C#
  "C#": [
    "*.csproj",
    "*.fsproj",
    "*.vbproj",
    "*.sln",
    "packages.config",
    "project.json",
    "Directory.Build.props",
  ],
  "F#": [
    "*.fsproj",
    "*.sln",
  ],
  
  // Dart/Flutter
  "Dart": [
    "pubspec.yaml",
    "pubspec.lock",
  ],
  
  // Perl
  "Perl": [
    "cpanfile",
    "cpanfile.snapshot",
    "Makefile.PL",
  ],
  
  // Elixir/Erlang
  "Elixir": [
    "mix.exs",
    "mix.lock",
  ],
  
  // Haskell
  "Haskell": [
    "*.cabal",
    "cabal.project",
    "stack.yaml",
    "package.yaml",
  ],
  
  // R
  "R": [
    "DESCRIPTION",
    "renv.lock",
    "packrat.lock",
  ],
  
  // Julia
  "Julia": [
    "Project.toml",
    "Manifest.toml",
  ],
  
  // Shell/DevOps
  "Shell": [
    "Dockerfile",
    "docker-compose.yml",
    ".terraform.lock.hcl",
    "requirements.yml", // Ansible
    "Berksfile", // Chef
  ],
}

// Config files that indicate framework/tool usage (Phase 4)
// Note: We don't include tsconfig.json here because TypeScript is already detected from language
// Config files should indicate tools that aren't in package.json (like build tools, deployment, etc.)
const FRAMEWORK_CONFIG_FILES: Record<string, string[]> = {
  // Frontend frameworks (these might have packages, but config confirms usage)
  "next.config.js": ["nextdotjs"],
  "next.config.ts": ["nextdotjs"],
  "next.config.mjs": ["nextdotjs"],
  "vite.config.js": ["vite"],
  "vite.config.ts": ["vite"],
  "webpack.config.js": ["webpack"],
  "webpack.config.ts": ["webpack"],
  "rollup.config.js": ["rollupdotjs"],
  "tailwind.config.js": ["tailwindcss"],
  "tailwind.config.ts": ["tailwindcss"],
  
  // Testing (config files indicate usage even if not in dependencies)
  "jest.config.js": ["jest"],
  "jest.config.ts": ["jest"],
  "vitest.config.ts": ["vitest"],
  "cypress.config.js": ["cypress"],
  "playwright.config.ts": ["playwright"],
  
  // Build tools
  "turbo.json": ["turborepo"],
  
  // DevOps (these don't have packages, so we detect from files)
  ".github/workflows": ["githubactions"],
  "Dockerfile": ["docker"],
  "docker-compose.yml": ["docker"],
  
  // Solana/Anchor (these have dependencies in the file itself)
  "Anchor.toml": ["anchor", "solana"],
  "anchor.toml": ["anchor", "solana"],
}

// ============================================================================
// Parsers for dependency files
// ============================================================================

// Parse package.json
function parsePackageJson(content: string): string[] {
  try {
    const pkg = JSON.parse(content)
    const deps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies,
      ...pkg.optionalDependencies,
    }
    return Object.keys(deps)
  } catch (e) {
    return []
  }
}

// Parse requirements.txt (Python)
function parseRequirementsTxt(content: string): string[] {
  const packages: string[] = []
  const lines = content.split('\n')
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('--')) continue
    
    const match = trimmed.match(/^([a-zA-Z0-9_-]+[a-zA-Z0-9._-]*)/)
    if (match) {
      packages.push(match[1].toLowerCase())
    }
  }
  
  return packages
}

// Parse pyproject.toml (Python)
function parsePyprojectToml(content: string): string[] {
  try {
    const deps: string[] = []
    
    // Try to find [project.dependencies] or [tool.poetry.dependencies]
    const projectDepsMatch = content.match(/\[project\.dependencies\]([\s\S]*?)(?=\n\[|$)/)
    const poetryDepsMatch = content.match(/\[tool\.poetry\.dependencies\]([\s\S]*?)(?=\n\[|$)/)
    
    const depsSection = projectDepsMatch?.[1] || poetryDepsMatch?.[1] || ""
    
    const packageMatches = depsSection.match(/"([^"]+)"/g) || depsSection.match(/'([^']+)'/g) || []
    packageMatches.forEach(match => {
      const pkg = match.replace(/["']/g, '')
      const nameMatch = pkg.match(/^([a-zA-Z0-9_-]+[a-zA-Z0-9._-]*)/)
      if (nameMatch) {
        deps.push(nameMatch[1].toLowerCase())
      }
    })
    
    return deps
  } catch (e) {
    return []
  }
}

// Parse Cargo.toml (Rust)
function parseCargoToml(content: string): string[] {
  try {
    const deps: string[] = []
    
    const depsMatch = content.match(/\[dependencies\]([\s\S]*?)(?=\n\[|$)/)
    if (depsMatch) {
      const depsSection = depsMatch[1]
      
      const crateMatches = depsSection.match(/^(\s*)([a-zA-Z0-9_-]+)\s*=/gm)
      if (crateMatches) {
        crateMatches.forEach(match => {
          const crateName = match.match(/([a-zA-Z0-9_-]+)\s*=/)?.[1]
          if (crateName) {
            deps.push(crateName.toLowerCase())
          }
        })
      }
    }
    
    return deps
  } catch (e) {
    return []
  }
}

// Parse Anchor.toml (Solana/Anchor)
function parseAnchorToml(content: string): string[] {
  try {
    const tools: string[] = []
    
    if (content.includes('[provider]') || content.includes('anchor')) {
      tools.push('anchor')
    }
    
    if (content.includes('solana') || content.includes('solana-program')) {
      tools.push('solana')
    }
    
    return tools
  } catch (e) {
    return []
  }
}

// Parse go.mod (Go)
function parseGoMod(content: string): string[] {
  try {
    const deps: string[] = []
    const lines = content.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      // Skip comments, empty lines, and module declarations
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('module ') || trimmed.startsWith('go ')) continue
      
      // Match require statements: require module/path v1.2.3
      // Or multi-line: require ( module/path v1.2.3 )
      const requireMatch = trimmed.match(/require\s+(.+)/)
      if (requireMatch) {
        // Handle both single-line and multi-line requires
        const requireContent = requireMatch[1].trim()
        
        // If it's just "(" on this line, it's a multi-line block - skip
        if (requireContent === '(') continue
        
        // If it's just ")" on this line, end of multi-line block - skip
        if (requireContent === ')') continue
        
        // Extract module path (everything before version)
        // Format: github.com/user/package v1.2.3
        const moduleMatch = requireContent.match(/^([^\s]+)/)
        if (moduleMatch) {
          const modulePath = moduleMatch[1]
          // Only add valid module paths (must have at least one slash, not just single letters)
          if (modulePath.includes('/') && modulePath.length > 2 && !/^[a-z]$/i.test(modulePath)) {
            // Extract last part of path as package name
            const parts = modulePath.split('/')
            const packageName = parts[parts.length - 1]
            if (packageName && packageName.length > 1 && !/^v\d+$/i.test(packageName)) {
              deps.push(modulePath.toLowerCase()) // Full path for better matching
              deps.push(packageName.toLowerCase()) // Also add last part
            }
          }
        }
      }
      
      // Also match direct require without keyword (in multi-line blocks)
      // Format: module/path v1.2.3 (no "require" keyword)
      if (!trimmed.includes('require') && !trimmed.startsWith(')') && !trimmed.startsWith('(')) {
        const directMatch = trimmed.match(/^([a-zA-Z0-9._-]+\/[a-zA-Z0-9./_-]+)\s+/)
        if (directMatch) {
          const modulePath = directMatch[1]
          if (modulePath.includes('/') && modulePath.length > 2) {
            const parts = modulePath.split('/')
            const packageName = parts[parts.length - 1]
            if (packageName && packageName.length > 1 && !/^v\d+$/i.test(packageName)) {
              deps.push(modulePath.toLowerCase())
              deps.push(packageName.toLowerCase())
            }
          }
        }
      }
    }
    
    // Filter out common false positives
    const filtered = deps.filter(pkg => {
      // Remove single letters
      if (pkg.length <= 1) return false
      // Remove version numbers
      if (/^v?\d+(\.\d+)*$/.test(pkg)) return false
      // Remove common Go keywords
      if (['go', 'module', 'require', 'replace', 'exclude'].includes(pkg)) return false
      // Remove parentheses and brackets
      if (['(', ')', '[', ']'].includes(pkg)) return false
      return true
    })
    
    return filtered
  } catch (e) {
    return []
  }
}

// Parse Gemfile (Ruby)
function parseGemfile(content: string): string[] {
  try {
    const gems: string[] = []
    const lines = content.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      
      const match = trimmed.match(/gem\s+['"]([^'"]+)['"]/)
      if (match) {
        gems.push(match[1].toLowerCase())
      }
    }
    
    return gems
  } catch (e) {
    return []
  }
}

// Parse composer.json (PHP)
function parseComposerJson(content: string): string[] {
  try {
    const pkg = JSON.parse(content)
    const deps = {
      ...pkg.require,
      ...pkg['require-dev'],
    }
    return Object.keys(deps).map(d => d.toLowerCase())
  } catch (e) {
    return []
  }
}

// Parse pom.xml (Java/Maven)
function parsePomXml(content: string): string[] {
  try {
    const deps: string[] = []
    
    const artifactIdMatches = content.match(/<artifactId>([^<]+)<\/artifactId>/g) || []
    artifactIdMatches.forEach(match => {
      const artifactId = match.replace(/<\/?artifactId>/g, '').trim()
      if (!artifactId.includes('maven-') && !artifactId.includes('plugin') && artifactId !== 'junit') {
        deps.push(artifactId.toLowerCase())
      }
    })
    
    return deps
  } catch (e) {
    return []
  }
}

// Parse build.gradle (Java/Gradle)
function parseBuildGradle(content: string): string[] {
  try {
    const deps: string[] = []
    
    // Match dependencies block
    const depsMatch = content.match(/dependencies\s*\{([\s\S]*?)\}/)
    if (depsMatch) {
      const depsSection = depsMatch[1]
      
      // Match implementation, api, compile, etc.
      const depMatches = depsSection.match(/(?:implementation|api|compile|runtime)\s+['"]([^'"]+)['"]/g) || []
      depMatches.forEach(match => {
        const dep = match.match(/['"]([^'"]+)['"]/)?.[1]
        if (dep) {
          const parts = dep.split(':')
          if (parts.length >= 2) {
            deps.push(parts[1].toLowerCase())
          }
        }
      })
    }
    
    return deps
  } catch (e) {
    return []
  }
}

// Parse pubspec.yaml (Dart/Flutter)
function parsePubspecYaml(content: string): string[] {
  try {
    const deps: string[] = []
    
    const depsMatch = content.match(/dependencies:([\s\S]*?)(?=\n\w|$)/)
    if (depsMatch) {
      const depsSection = depsMatch[1]
      
      const packageMatches = depsSection.match(/^\s+([a-zA-Z0-9_-]+):/gm)
      if (packageMatches) {
        packageMatches.forEach(match => {
          const pkg = match.match(/\s+([a-zA-Z0-9_-]+):/)?.[1]
          if (pkg) {
            deps.push(pkg.toLowerCase())
          }
        })
      }
    }
    
    return deps
  } catch (e) {
    return []
  }
}

// Parse CMakeLists.txt (C/C++)
function parseCMakeLists(content: string): string[] {
  try {
    const deps: string[] = []
    
    // Match find_package and similar commands
    const findPackageMatches = content.match(/find_package\s*\(([^)]+)\)/g) || []
    findPackageMatches.forEach(match => {
      const pkg = match.match(/find_package\s*\(([^)]+)\)/)?.[1]?.trim()
      if (pkg) {
        deps.push(pkg.toLowerCase())
      }
    })
    
    return deps
  } catch (e) {
    return []
  }
}

// ============================================================================
// Phase 3: Multi-Layer Package → Tool Mapping
// ============================================================================

/**
 * Layer 1: Database lookup (exact/fuzzy match)
 * Layer 2: Known popular packages (handled by ToolMatcher)
 * Layer 3: Registry metadata lookup (future enhancement)
 * Layer 4: File-based heuristics (framework indicators)
 * Layer 5: Skip if no match (no false positives)
 */
async function mapPackagesToTools(
  packages: string[],
  toolMatcher: ReturnType<typeof getToolMatcher>
): Promise<string[]> {
  const toolIds = new Set<string>()
  
  for (const pkg of packages) {
    // Layer 1 & 2: Database lookup + known packages (via ToolMatcher)
    const toolId = toolMatcher.matchPackage(pkg)
    if (toolId) {
      toolIds.add(toolId)
      continue
    }
    
    // Layer 4: File-based heuristics for common framework indicators
    const lowerPkg = pkg.toLowerCase()
    
    // Framework indicators
    if (lowerPkg.includes('react') && !lowerPkg.includes('react-')) {
      const reactToolId = toolMatcher.slugMap.get('react')
      if (reactToolId) toolIds.add(reactToolId)
    }
    
    if (lowerPkg === 'next' || lowerPkg === '@next/core') {
      const nextToolId = toolMatcher.slugMap.get('nextdotjs')
      if (nextToolId) toolIds.add(nextToolId)
    }
    
    // Layer 5: Skip if no match (no false positives)
    // We don't add tools that don't match - better to miss than have false positives
  }
  
  return Array.from(toolIds)
}

// ============================================================================
// Phase 4: Framework/Technology Inference from File Structure
// ============================================================================

async function detectFromFileStructure(
  owner: string,
  repo: string,
  accessToken: string,
  toolMatcher: ReturnType<typeof getToolMatcher>
): Promise<string[]> {
  const toolIds = new Set<string>()
  
  // Check for config files that indicate framework usage
  const configFiles = Object.keys(FRAMEWORK_CONFIG_FILES)
  
  for (const configFile of configFiles) {
    try {
      // Handle wildcards (e.g., *.csproj)
      if (configFile.includes('*')) {
        // Skip wildcards for now - would need repo contents API
        continue
      }
      
      // Special case: .github/workflows
      if (configFile === '.github/workflows') {
        try {
          const workflowsResponse = await Promise.race([
            fetch(`https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows`, {
              headers: {
                Authorization: accessToken.startsWith('token ') || accessToken.startsWith('Bearer ')
                  ? accessToken
                  : `token ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
              },
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 500)),
          ]).catch(() => null) as Response | null
          
          if (workflowsResponse?.ok) {
            const workflows = await workflowsResponse.json().catch(() => [])
            if (Array.isArray(workflows) && workflows.length > 0) {
              const tools = FRAMEWORK_CONFIG_FILES[configFile]
              for (const toolSlug of tools) {
                const toolId = toolMatcher.slugMap.get(toolSlug)
                if (toolId) toolIds.add(toolId)
              }
            }
          }
        } catch (e) {
          // Silently skip
        }
        continue
      }
      
      // Regular file check
      const fileResponse = await Promise.race([
        fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${configFile}`, {
          headers: {
            Authorization: accessToken.startsWith('token ') || accessToken.startsWith('Bearer ')
              ? accessToken
              : `token ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 500)),
      ]).catch(() => null) as Response | null
      
      if (fileResponse?.ok) {
        const tools = FRAMEWORK_CONFIG_FILES[configFile]
        for (const toolSlug of tools) {
          const toolId = toolMatcher.slugMap.get(toolSlug)
          if (toolId) {
            toolIds.add(toolId)
            console.log(`Detected framework from ${configFile} → ${toolSlug}`)
          }
        }
      }
    } catch (e) {
      // Silently skip
    }
  }
  
  return Array.from(toolIds)
}

// ============================================================================
// Main Detection Function
// ============================================================================

// List of all known dependency files across ecosystems
const KNOWN_DEPENDENCY_FILES = [
  // JavaScript/TypeScript
  "package.json",
  "package-lock.json",
  "yarn.lock",
  ".yarnrc.yml",
  "pnpm-lock.yaml",
  "bun.lockb",
  "deno.json",
  "deno.jsonc",
  // Python
  "requirements.txt",
  "requirements.in",
  "Pipfile",
  "Pipfile.lock",
  "pyproject.toml",
  "poetry.lock",
  "setup.py",
  "setup.cfg",
  "environment.yml",
  "conda.yml",
  // Java/JVM
  "pom.xml",
  "build.gradle",
  "build.gradle.kts",
  "settings.gradle",
  "gradle.properties",
  "ivy.xml",
  "build.xml",
  // Rust
  "Cargo.toml",
  "Cargo.lock",
  "Anchor.toml",
  "anchor.toml",
  // Go
  "go.mod",
  "go.sum",
  "Gopkg.toml",
  "Gopkg.lock",
  // Ruby
  "Gemfile",
  "Gemfile.lock",
  ".ruby-version",
  // PHP
  "composer.json",
  "composer.lock",
  // Dart/Flutter
  "pubspec.yaml",
  "pubspec.lock",
  // C/C++
  "CMakeLists.txt",
  "Makefile",
  "meson.build",
  // Scala
  "build.sbt",
  // Clojure
  "project.clj",
  "deps.edn",
  // Elixir
  "mix.exs",
  "mix.lock",
  // Haskell
  "stack.yaml",
  "package.yaml",
  // R
  "DESCRIPTION",
  "renv.lock",
  // Julia
  "Project.toml",
  "Manifest.toml",
]

// Main function to fetch and parse dependency files from GitHub
// accessToken can be either a plain token string or a full Authorization header value
export async function detectToolsFromRepo(
  owner: string,
  repo: string,
  accessToken: string
): Promise<string[]> {
  // Handle both token string and full Authorization header
  const authHeader = accessToken.startsWith('token ') || accessToken.startsWith('Bearer ')
    ? accessToken
    : `token ${accessToken}`
  const toolIds = new Set<string>()
  const toolMatcher = getToolMatcher()
  
  try {
    // STEP 1: Get ALL repository languages from GitHub API (no filtering)
    console.log("Step 1: Fetching languages from GitHub API...")
    const languagesResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      {
        headers: {
          Authorization: authHeader,
          Accept: "application/vnd.github.v3+json",
        },
      }
    )
    
    if (!languagesResponse.ok) {
      console.error(`GitHub languages API error: ${languagesResponse.status} ${languagesResponse.statusText}`)
      const errorText = await languagesResponse.text().catch(() => "")
      console.error(`Error details: ${errorText}`)
      
      // Throw error for 401/403 to stop processing and show clear error
      if (languagesResponse.status === 401 || languagesResponse.status === 403) {
        let errorDetails: any = {}
        try {
          errorDetails = JSON.parse(errorText)
        } catch {
          errorDetails = { message: errorText || languagesResponse.statusText }
        }
        throw new Error(`GitHub authentication failed: ${errorDetails.message || "Bad credentials"}`)
      }
    }
    
    const languages: Record<string, number> = languagesResponse.ok 
      ? await languagesResponse.json().catch((e) => {
          console.error("Error parsing languages JSON:", e)
          return {}
        })
      : {}
    
    // Store ALL languages (no filtering, no percentages)
    const allLanguages = Object.keys(languages)
    console.log(`Found ${allLanguages.length} languages: ${allLanguages.join(", ")}`)
    
    if (allLanguages.length === 0 && languagesResponse.ok) {
      console.warn("Languages API returned empty object (repo might be empty or very new)")
    }
    
    // Map languages to tools (add language-based tools)
    const languageToToolMap: Record<string, string[]> = {
      "JavaScript": ["javascript", "nodedotjs"],
      "TypeScript": ["typescript", "nodedotjs"],
      "Python": ["python"],
      "Rust": ["rust"],
      "Go": ["go"],
      "Java": ["java"],
      "Kotlin": ["kotlin"],
      "Swift": ["swift"],
      "Dart": ["dart", "flutter"],
      "Ruby": ["ruby", "rubyonrails"],
      "PHP": ["php"],
      "C#": ["dotnet", "csharp"],
      "C++": ["cpp"],
      "C": ["c"],
      "Shell": ["bash"],
      "Dockerfile": ["docker"],
      "HTML": ["html5"],
      "CSS": ["css3"],
      "SCSS": ["sass"],
      "Sass": ["sass"],
      "Less": ["less"],
      "Vue": ["vuejs"],
      "Svelte": ["svelte"],
      "R": ["r"],
      "Matlab": ["matlab"],
      "Julia": ["julia"],
      "Scala": ["scala"],
      "Clojure": ["clojure"],
      "Elixir": ["elixir"],
      "Erlang": ["erlang"],
      "Haskell": ["haskell"],
      "OCaml": ["ocaml"],
      "F#": ["fsharp"],
      "Lua": ["lua"],
      "Perl": ["perl"],
      "Objective-C": ["objectivec"],
      "Objective-C++": ["objectivecpp"],
    }
    
    // Add language-based tools
    for (const lang of allLanguages) {
      const toolSlugs = languageToToolMap[lang]
      if (toolSlugs) {
        for (const slug of toolSlugs) {
          const toolId = toolMatcher.slugMap.get(slug)
          if (toolId) {
            toolIds.add(toolId)
            console.log(`Added language: ${lang} → ${slug}`)
          }
        }
      }
    }
    
    // STEP 2: Check for package.json only (other dependency files support coming later)
    console.log("Step 2: Checking for package.json...")
    
    let packageJsonUrl: string | null = null
    
    try {
      const contentsResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents`,
        {
          headers: {
            Authorization: authHeader,
            Accept: "application/vnd.github.v3+json",
          },
        }
      )
      
      if (contentsResponse.ok) {
        const contents: any[] = await contentsResponse.json().catch(() => [])
        const packageJsonFile = contents.find((item: any) => item.type === "file" && item.name === "package.json")
        
        if (packageJsonFile) {
          packageJsonUrl = packageJsonFile.download_url || `https://raw.githubusercontent.com/${owner}/${repo}/main/package.json`
          console.log("✓ Found package.json")
        } else {
          console.log("⚠ package.json not found")
        }
      } else {
        console.error(`Contents API error: ${contentsResponse.status} ${contentsResponse.statusText}`)
      }
    } catch (error) {
      console.error("Error checking for package.json:", error)
    }
    
    // STEP 3: Fetch and parse package.json only
    const allPackages: string[] = []
    
    if (packageJsonUrl) {
      try {
        console.log("Step 3: Fetching package.json content...")
        const contentResponse = await fetch(packageJsonUrl)
        
        if (!contentResponse.ok) {
          console.warn(`⚠ Failed to fetch package.json: ${contentResponse.status}`)
        } else {
          const fileContent = await contentResponse.text()
          
          // STEP 4: Parse package.json
          const packages = parsePackageJson(fileContent)
          
          if (packages.length > 0) {
            console.log(`  ✓ Parsed ${packages.length} packages from package.json`)
            if (packages.length <= 20) {
              console.log(`    Packages: ${packages.join(", ")}`)
            } else {
              console.log(`    Sample: ${packages.slice(0, 10).join(", ")}... (+${packages.length - 10} more)`)
            }
            allPackages.push(...packages)
          } else {
            console.log("  ⚠ package.json exists but contains no dependencies")
          }
        }
      } catch (e) {
        console.warn(`⚠ Error processing package.json:`, e)
      }
    }
    
    // STEP 5: Match all packages to tools using improved matching
    console.log(`Step 5: Matching ${allPackages.length} packages to tools...`)
    
    // Remove duplicates
    const uniquePackages = Array.from(new Set(allPackages.map(p => p.toLowerCase())))
    console.log(`  Unique packages: ${uniquePackages.length}`)
    
    // Match each package
    const matchedCounts = new Map<string, number>() // toolId -> count
    
    for (const pkg of uniquePackages) {
      const toolId = toolMatcher.matchPackage(pkg)
      if (toolId) {
        toolIds.add(toolId)
        matchedCounts.set(toolId, (matchedCounts.get(toolId) || 0) + 1)
      }
    }
    
    // Log matched tools
    console.log(`  Matched ${toolIds.size} tools from ${uniquePackages.length} packages:`)
    for (const [toolId, count] of matchedCounts.entries()) {
      const tool = toolMatcher.getTool(toolId)
      if (tool) {
        console.log(`    ✓ ${tool.name} (${tool.slug}) - matched from ${count} package(s)`)
      }
    }
    
    // Log unmatched packages (for debugging)
    const unmatchedPackages = uniquePackages.filter(pkg => !toolMatcher.matchPackage(pkg))
    if (unmatchedPackages.length > 0) {
      console.log(`  Unmatched packages (${unmatchedPackages.length}): ${unmatchedPackages.slice(0, 20).join(", ")}${unmatchedPackages.length > 20 ? "..." : ""}`)
    }
    
    console.log(`Total tools detected: ${toolIds.size}`)
    
    return Array.from(toolIds)
  } catch (error) {
    console.error("Error detecting tools from repo:", error)
    return []
  }
}
