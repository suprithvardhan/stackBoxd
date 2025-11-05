import { Prisma } from '@prisma/client'

// Prisma query logging types
interface PrismaQueryEvent {
  model?: string;
  action?: string;
  query?: string;
  duration?: number;
}

// Session-based query tracking
const sessionQueries = new Map<string, { count: number; queries: string[]; startTime: number }>()

// Generate session ID from request
export function getSessionId(request: Request | any): string {
  // Try to get from headers or generate based on IP/user agent
  const headers = request?.headers || {}
  const forwarded = headers['x-forwarded-for'] || headers['x-real-ip'] || ''
  const userAgent = headers['user-agent'] || ''
  const sessionId = request?.headers?.get?.('x-session-id') || 
                   `${forwarded}-${userAgent}`.slice(0, 100)
  
  return sessionId
}

// Track query for session
export function trackQuery(sessionId: string, query: string, duration: number) {
  if (!sessionQueries.has(sessionId)) {
    sessionQueries.set(sessionId, { 
      count: 0, 
      queries: [], 
      startTime: Date.now() 
    })
  }
  
  const session = sessionQueries.get(sessionId)!
  session.count++
  
  // Only store query string (not full data) to save memory
  if (session.queries.length < 50) { // Limit to last 50 queries
    session.queries.push(`${query} (${duration}ms)`)
  }
}

// Get session stats
export function getSessionStats(sessionId: string) {
  const session = sessionQueries.get(sessionId)
  if (!session) return null
  
  const duration = Date.now() - session.startTime
  return {
    sessionId,
    queryCount: session.count,
    queries: session.queries,
    duration,
    queriesPerSecond: duration > 0 ? (session.count / (duration / 1000)).toFixed(2) : '0'
  }
}

// Get all active sessions
export function getAllSessions() {
  return Array.from(sessionQueries.entries()).map(([id, data]) => ({
    sessionId: id,
    queryCount: data.count,
    duration: Date.now() - data.startTime,
    queriesPerSecond: (Date.now() - data.startTime) > 0 
      ? (data.count / ((Date.now() - data.startTime) / 1000)).toFixed(2) 
      : '0'
  }))
}

// Clean up old sessions (older than 10 minutes)
export function cleanupOldSessions() {
  const tenMinutesAgo = Date.now() - (10 * 60 * 1000)
  for (const [id, data] of sessionQueries.entries()) {
    if (data.startTime < tenMinutesAgo) {
      sessionQueries.delete(id)
    }
  }
}

// Enable Prisma query logging for a Prisma client instance
export function enablePrismaQueryLogging(prisma: any) {
  // Use Prisma's $on event listener for query events
  prisma.$on('query' as any, (event: PrismaQueryEvent) => {
    const sessionId = 'server' // Default session ID for server-side queries
    const model = event.model || 'unknown'
    const action = event.action || 'query'
    const query = `${model}.${action}`
    const duration = event.duration || 0
    
    trackQuery(sessionId, query, duration)
    
    // Log slow queries (>100ms) in development
    if (process.env.NODE_ENV === 'development' && duration > 100) {
      console.warn(`[Slow Query] ${query} took ${duration}ms`)
    }
  })
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupOldSessions, 5 * 60 * 1000)
}

