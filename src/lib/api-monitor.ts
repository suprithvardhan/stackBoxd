"use client"

// Client-side API call tracking
interface ApiCall {
  url: string
  method: string
  timestamp: number
  duration?: number
  cached?: boolean
}

class ApiMonitor {
  private calls: ApiCall[] = []
  private sessionStartTime: number = Date.now()
  private sessionId: string

  constructor() {
    // Generate session ID
    this.sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Persist to localStorage for page reloads
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('api-monitor-session')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          this.sessionId = parsed.sessionId
          this.sessionStartTime = parsed.startTime
        } catch {}
      }
      
      // Save session info
      localStorage.setItem('api-monitor-session', JSON.stringify({
        sessionId: this.sessionId,
        startTime: this.sessionStartTime
      }))
    }
  }

  trackCall(url: string, method: string, duration: number, cached: boolean = false) {
    this.calls.push({
      url,
      method,
      timestamp: Date.now(),
      duration,
      cached
    })

    // Keep only last 200 calls
    if (this.calls.length > 200) {
      this.calls = this.calls.slice(-200)
    }

    // Send stats to server periodically (every 10 calls)
    if (this.calls.length % 10 === 0) {
      this.sendStatsToServer()
    }
  }

  getStats() {
    const duration = Date.now() - this.sessionStartTime
    const callsByEndpoint = new Map<string, number>()
    const callsByMethod = new Map<string, number>()
    let totalDuration = 0
    let cachedCount = 0

    this.calls.forEach(call => {
      // Count by endpoint (strip query params)
      const endpoint = call.url.split('?')[0]
      callsByEndpoint.set(endpoint, (callsByEndpoint.get(endpoint) || 0) + 1)
      
      // Count by method
      callsByMethod.set(call.method, (callsByMethod.get(call.method) || 0) + 1)
      
      if (call.duration) totalDuration += call.duration
      if (call.cached) cachedCount++
    })

    return {
      sessionId: this.sessionId,
      totalCalls: this.calls.length,
      cachedCalls: cachedCount,
      cacheHitRate: this.calls.length > 0 ? ((cachedCount / this.calls.length) * 100).toFixed(1) : '0',
      duration,
      averageDuration: this.calls.length > 0 ? (totalDuration / this.calls.length).toFixed(2) : '0',
      callsPerSecond: duration > 0 ? ((this.calls.length / (duration / 1000))).toFixed(2) : '0',
      callsByEndpoint: Object.fromEntries(callsByEndpoint),
      callsByMethod: Object.fromEntries(callsByMethod),
      recentCalls: this.calls.slice(-20) // Last 20 calls
    }
  }

  private async sendStatsToServer() {
    try {
      const stats = this.getStats()
      // Send to analytics endpoint (non-blocking)
      fetch('/api/analytics/session-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats),
      }).catch(() => {}) // Silent fail
    } catch (error) {
      // Silent fail
    }
  }

  // Expose stats for debugging
  getStatsForDisplay() {
    return this.getStats()
  }
}

// Singleton instance
let monitorInstance: ApiMonitor | null = null

export function getApiMonitor(): ApiMonitor {
  if (!monitorInstance) {
    monitorInstance = new ApiMonitor()
  }
  return monitorInstance
}

// Hook to access stats in React components
export function useApiStats() {
  if (typeof window === 'undefined') {
    return null
  }
  
  const monitor = getApiMonitor()
  return monitor.getStatsForDisplay()
}

