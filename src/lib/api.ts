export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(error.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const api = {
  users: {
    get: (username?: string) =>
      apiRequest<any>(
        `/api/users${username ? `?username=${username}` : ""}`
      ),
    update: (data: any) =>
      apiRequest<any>("/api/users", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
  tools: {
    list: (params?: { category?: string; search?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams()
      if (params?.category) query.append("category", params.category)
      if (params?.search) query.append("search", params.search)
      if (params?.limit) query.append("limit", params.limit.toString())
      if (params?.offset) query.append("offset", params.offset.toString())
      return apiRequest<any[]>(`/api/tools?${query.toString()}`)
    },
    get: (slug: string) =>
      apiRequest<any>(`/api/tools?slug=${slug}`),
    getDescription: (slug: string) =>
      apiRequest<{ description: string | null; source: string | null }>(`/api/tools/${slug}/description`),
    create: (data: any) =>
      apiRequest<any>("/api/tools", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  projects: {
    list: (params?: { authorId?: string; username?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams()
      if (params?.authorId) query.append("authorId", params.authorId)
      if (params?.username) query.append("username", params.username)
      if (params?.limit) query.append("limit", params.limit.toString())
      if (params?.offset) query.append("offset", params.offset.toString())
      return apiRequest<any[]>(`/api/projects?${query.toString()}`)
    },
    get: (id: string) =>
      apiRequest<any>(`/api/projects?id=${id}`),
    create: (data: any) =>
      apiRequest<any>("/api/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  logs: {
    list: (params?: { userId?: string; username?: string; toolId?: string; projectId?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams()
      if (params?.userId) query.append("userId", params.userId)
      if (params?.username) query.append("username", params.username)
      if (params?.toolId) query.append("toolId", params.toolId)
      if (params?.projectId) query.append("projectId", params.projectId)
      if (params?.limit) query.append("limit", params.limit.toString())
      if (params?.offset) query.append("offset", params.offset.toString())
      return apiRequest<any[]>(`/api/logs?${query.toString()}`)
    },
    get: (id: string) =>
      apiRequest<any>(`/api/logs?id=${id}`),
    create: (data: any) =>
      apiRequest<any>("/api/logs", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  lists: {
    list: (params?: { userId?: string; username?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams()
      if (params?.userId) query.append("userId", params.userId)
      if (params?.username) query.append("username", params.username)
      if (params?.limit) query.append("limit", params.limit.toString())
      if (params?.offset) query.append("offset", params.offset.toString())
      return apiRequest<any[]>(`/api/lists?${query.toString()}`)
    },
    get: (id: string) =>
      apiRequest<any>(`/api/lists?id=${id}`),
    create: (data: any) =>
      apiRequest<any>("/api/lists", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  github: {
    sync: () =>
      apiRequest<any>("/api/github/sync", {
        method: "POST",
      }),
    analyze: (repoUrl: string) =>
      apiRequest<any>(`/api/github/sync?repoUrl=${encodeURIComponent(repoUrl)}`),
  },
  search: {
    search: (query: string, limit?: number) => {
      const params = new URLSearchParams()
      params.append("q", query)
      if (limit) params.append("limit", limit.toString())
      return apiRequest<{ tools: any[]; users: any[]; lists: any[] }>(`/api/search?${params.toString()}`)
    },
  },
  reactions: {
    toggle: (logId: string) =>
      apiRequest<{ reacted: boolean }>("/api/reactions", {
        method: "POST",
        body: JSON.stringify({ logId }),
      }),
    list: (logId?: string, userId?: string) => {
      const params = new URLSearchParams()
      if (logId) params.append("logId", logId)
      if (userId) params.append("userId", userId)
      return apiRequest<any[]>(`/api/reactions?${params.toString()}`)
    },
  },
  comments: {
    list: (logId: string) =>
      apiRequest<any[]>(`/api/comments?logId=${logId}`),
    create: (logId: string, content: string) =>
      apiRequest<any>("/api/comments", {
        method: "POST",
        body: JSON.stringify({ logId, content }),
      }),
    delete: (id: string) =>
      apiRequest<any>(`/api/comments?id=${id}`, {
        method: "DELETE",
      }),
  },
  follows: {
    toggle: (followingId: string) =>
      apiRequest<{ following: boolean }>("/api/follows", {
        method: "POST",
        body: JSON.stringify({ followingId }),
      }),
    list: (userId: string, type: "followers" | "following" = "followers") =>
      apiRequest<any[]>(`/api/follows?userId=${userId}&type=${type}`),
    check: (userId: string) =>
      apiRequest<{ following: boolean }>(`/api/follows/check?userId=${userId}`),
  },
  analytics: {
    track: (eventType: string, eventData?: any, path?: string, referrer?: string, duration?: number) =>
      apiRequest<{ success: boolean }>("/api/analytics", {
        method: "POST",
        body: JSON.stringify({ eventType, eventData, path, referrer, duration }),
      }),
    get: (params?: { startDate?: string; endDate?: string; eventType?: string }) => {
      const query = new URLSearchParams()
      if (params?.startDate) query.append("startDate", params.startDate)
      if (params?.endDate) query.append("endDate", params.endDate)
      if (params?.eventType) query.append("eventType", params.eventType)
      return apiRequest<any[]>(`/api/analytics?${query.toString()}`)
    },
  },
}

