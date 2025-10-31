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
    create: (data: any) =>
      apiRequest<any>("/api/tools", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  projects: {
    list: (params?: { authorId?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams()
      if (params?.authorId) query.append("authorId", params.authorId)
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
    list: (params?: { userId?: string; toolId?: string; projectId?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams()
      if (params?.userId) query.append("userId", params.userId)
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
    list: (params?: { userId?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams()
      if (params?.userId) query.append("userId", params.userId)
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
}

