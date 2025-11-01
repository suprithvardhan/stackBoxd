"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";
import { api } from "./api";

// Query keys factory for consistent cache keys
export const queryKeys = {
  tools: {
    all: ["tools"] as const,
    lists: (params?: any) => ["tools", "list", params] as const,
    detail: (slug: string) => ["tools", slug] as const,
    description: (slug: string) => ["tools", slug, "description"] as const,
  },
  logs: {
    all: ["logs"] as const,
    lists: (params?: any) => ["logs", "list", params] as const,
    detail: (id: string) => ["logs", id] as const,
  },
  projects: {
    all: ["projects"] as const,
    lists: (params?: any) => ["projects", "list", params] as const,
    detail: (id: string) => ["projects", id] as const,
  },
  lists: {
    all: ["lists"] as const,
    lists: (params?: any) => ["lists", "list", params] as const,
    detail: (id: string) => ["lists", id] as const,
  },
  users: {
    detail: (username: string) => ["users", username] as const,
  },
  search: {
    query: (query: string, limit?: number) => ["search", query, limit] as const,
  },
  comments: {
    list: (logId: string) => ["comments", "list", logId] as const,
  },
  reactions: {
    list: (logId?: string, userId?: string) => ["reactions", "list", logId, userId] as const,
  },
};

// Tools hooks
export function useTools(params?: { category?: string; search?: string; limit?: number; offset?: number }) {
  return useQuery({
    queryKey: queryKeys.tools.lists(params),
    queryFn: () => api.tools.list(params),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

export function useTool(slug: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.tools.detail(slug),
    queryFn: () => api.tools.get(slug),
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useToolDescription(slug: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.tools.description(slug),
    queryFn: () => api.tools.getDescription(slug),
    enabled: enabled && !!slug,
    staleTime: 60 * 60 * 1000, // 1 hour - descriptions rarely change
  });
}

// Logs hooks
export function useLogs(params?: { userId?: string; username?: string; toolId?: string; projectId?: string; limit?: number; offset?: number }) {
  return useQuery({
    queryKey: queryKeys.logs.lists(params),
    queryFn: () => api.logs.list(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useLog(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.logs.detail(id),
    queryFn: () => api.logs.get(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Projects hooks
export function useProjects(params?: { authorId?: string; username?: string; limit?: number; offset?: number }) {
  return useQuery({
    queryKey: queryKeys.projects.lists(params),
    queryFn: () => api.projects.list(params),
    staleTime: params?.authorId ? 1 * 60 * 1000 : 3 * 60 * 1000, // User projects: 1 min, all projects: 3 min
  });
}

export function useProject(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => api.projects.get(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Lists hooks
export function useLists(params?: { userId?: string; username?: string; limit?: number; offset?: number }) {
  return useQuery({
    queryKey: queryKeys.lists.lists(params),
    queryFn: () => api.lists.list(params),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

export function useList(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.lists.detail(id),
    queryFn: () => api.lists.get(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Users hooks
export function useUser(username: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.detail(username),
    queryFn: () => api.users.get(username),
    enabled: enabled && !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Search hook with debouncing handled in component
export function useSearch(query: string, limit = 10, enabled = true) {
  return useQuery({
    queryKey: queryKeys.search.query(query, limit),
    queryFn: () => api.search.search(query, limit),
    enabled: enabled && query.trim().length >= 2, // Only search if 2+ chars
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
}

// Mutations with cache invalidation
export function useCreateLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.logs.create,
    onSuccess: () => {
      // Invalidate logs queries
      queryClient.invalidateQueries({ queryKey: queryKeys.logs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tools.all });
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.projects.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.lists.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
    },
  });
}

export function useSyncGitHub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.github.sync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

// Follow hooks
export function useFollowStatus(userId: string, enabled = true) {
  return useQuery({
    queryKey: ["follows", "status", userId],
    queryFn: () => api.follows.check(userId),
    enabled: enabled && !!userId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useFollowers(userId: string, enabled = true) {
  return useQuery({
    queryKey: ["follows", "followers", userId],
    queryFn: () => api.follows.list(userId, "followers"),
    enabled: enabled && !!userId,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useFollowing(userId: string, enabled = true) {
  return useQuery({
    queryKey: ["follows", "following", userId],
    queryFn: () => api.follows.list(userId, "following"),
    enabled: enabled && !!userId,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useToggleFollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.follows.toggle,
    onMutate: async (followingId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["follows", "status", followingId] });
      await queryClient.cancelQueries({ queryKey: ["users"] });
      
      // Snapshot previous values
      const previousStatus = queryClient.getQueryData(["follows", "status", followingId]);
      
      // Optimistically update follow status
      queryClient.setQueryData(["follows", "status", followingId], (old: any) => {
        return { following: !old?.following };
      });
      
      // Optimistically update follower count for ALL user queries (by id match)
      queryClient.setQueriesData({ queryKey: ["users"] }, (old: any) => {
        if (!old || !old.id || old.id !== followingId) return old;
        const increment = !previousStatus?.following ? 1 : -1;
        return {
          ...old,
          stats: {
            ...old.stats,
            followers: Math.max(0, (old.stats?.followers || 0) + increment),
          },
        };
      });
      
      return { previousStatus };
    },
    onError: (err, followingId, context) => {
      // Rollback on error
      if (context?.previousStatus) {
        queryClient.setQueryData(["follows", "status", followingId], context.previousStatus);
      }
      // Refetch to get correct data
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onSuccess: (data, followingId) => {
      // Update with actual data from server
      queryClient.setQueryData(["follows", "status", followingId], data);
      
      // Invalidate related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["follows", "followers", followingId] });
      queryClient.invalidateQueries({ queryKey: ["follows", "following", followingId] });
      
      // CRITICAL: Invalidate ALL user queries to update follower/following counts everywhere
      // This ensures the profile page refetches with correct counts
      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      // Also refetch any active user queries immediately
      queryClient.refetchQueries({ queryKey: ["users"] });
    },
  });
}

// Comments hooks
export function useComments(logId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.comments.list(logId),
    queryFn: () => api.comments.list(logId),
    enabled: enabled && !!logId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Reactions hooks
export function useReactions(logId?: string, userId?: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.reactions.list(logId, userId),
    queryFn: () => {
      if (logId) {
        return api.reactions.list(logId, undefined);
      } else if (userId) {
        return api.reactions.list(undefined, userId);
      }
      return Promise.resolve([]);
    },
    enabled: enabled && (!!logId || !!userId),
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Prefetching utilities - call these to prefetch data before user navigates
export function usePrefetchLog() {
  const queryClient = useQueryClient();
  
  return (logId: string) => {
    // Prefetch log detail, comments, and reactions in parallel
    Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.logs.detail(logId),
        queryFn: () => api.logs.get(logId),
        staleTime: 5 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.comments.list(logId),
        queryFn: () => api.comments.list(logId),
        staleTime: 30 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.reactions.list(logId, undefined),
        queryFn: () => api.reactions.list(logId, undefined),
        staleTime: 30 * 1000,
      }),
    ]).catch(() => {
      // Silently fail prefetching - it's non-critical
    });
  };
}

// Hook to prefetch log data on mount or hover
export function useLogPrefetch(logId: string, prefetchOnMount = true, prefetchOnHover = true) {
  const prefetchLog = usePrefetchLog();
  
  useEffect(() => {
    if (prefetchOnMount && logId) {
      prefetchLog(logId);
    }
  }, [logId, prefetchOnMount, prefetchLog]);

  const handleMouseEnter = useCallback(() => {
    if (prefetchOnHover && logId) {
      prefetchLog(logId);
    }
  }, [logId, prefetchOnHover, prefetchLog]);

  return { handleMouseEnter };
}

