"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { StructuredData, generateToolStructuredData } from "@/components/structured-data";
import { useTool, useToolDescription, useLogs, useProjects } from "@/lib/api-hooks";

function shortAgo(date: string) {
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60 * 60) return `${Math.round(diff / 60)}m ago`;
  if (diff < 48 * 3600) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}

// Rating Distribution Histogram Chart Component (Letterboxd-style)
function RatingDistributionHistogram({ 
  distribution, 
  totalRatings, 
  toolColor,
  avgRating 
}: { 
  distribution: Record<number, number>; 
  totalRatings: number;
  toolColor?: string;
  avgRating?: number;
}) {
  const maxCount = Math.max(...Object.values(distribution), 1);
  const chartHeight = 200; // Fixed height for the histogram
  
  // Group by full stars for display
  const groupedBars: { [key: number]: { count: number; height: number } } = {};
  [1, 2, 3, 4, 5].forEach((star) => {
    const count = distribution[star] || 0;
    groupedBars[star] = {
      count,
      height: maxCount > 0 ? (count / maxCount) * chartHeight : 0,
    };
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Ratings</span>
          <div className="h-px flex-1 bg-[var(--border)]"></div>
        </div>
        <span className="text-xs text-[var(--text-muted)]">{totalRatings} FANS</span>
      </div>

      {/* Histogram Bars */}
      <div className="flex items-end justify-between gap-1 h-[200px] px-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const { count, height } = groupedBars[star];
          const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
          const barColor = toolColor || '#00FF8F';
          
          return (
            <div
              key={star}
              className="group flex-1 flex flex-col items-center justify-end relative"
              style={{ height: `${chartHeight}px` }}
            >
              {/* Bar */}
              <div
                className="w-full rounded-t transition-all duration-300 hover:brightness-125 cursor-pointer relative"
                style={{
                  height: `${Math.max(height, count > 0 ? 4 : 0)}px`,
                  backgroundColor: barColor,
                  minHeight: count > 0 ? '4px' : '0',
                }}
                title={`${star} star${star !== 1 ? 's' : ''}: ${count} rating${count !== 1 ? 's' : ''} (${percentage.toFixed(1)}%)`}
              >
                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                    {count} ({percentage.toFixed(0)}%)
                  </div>
                </div>
              </div>
              
              {/* Star indicator below bar */}
              <div className="mt-2 flex items-center justify-center">
                <Icon icon="mdi:star" width={14} height={14} className="text-yellow-400 fill-current" />
              </div>
              
              {/* Star number */}
              <span className="text-xs text-[var(--text-muted)] mt-1 font-medium">{star}</span>
            </div>
          );
        })}
      </div>

      {/* Average Rating Display */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <div className="text-right">
          <div className="text-3xl font-bold text-[var(--text)]">{avgRating?.toFixed(1) || '0.0'}</div>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                icon="mdi:star"
                width={16}
                height={16}
                className={i < Math.floor(avgRating || 0) ? "text-yellow-400 fill-current" : "text-[var(--text-muted)]/30"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToolPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: session } = useSession();
  const [tool, setTool] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [description, setDescription] = useState<{ description: string | null; source: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Track tool view after tool is loaded
    if (tool?.slug && !loading) {
      // Import trackFeature for consistent tracking
      import("@/lib/analytics").then(({ trackFeature }) => {
        trackFeature("tool_view", "view", { toolSlug: tool.slug, toolId: tool.id });
      }).catch(() => {});
    }
  }, [tool?.slug, tool?.id, loading])

  // OPTIMIZED: Use React Query hooks for caching
  const { data: toolData, isLoading: toolLoading } = useTool(slug, !!slug);
  const { data: descData } = useToolDescription(slug, !!slug);
  // OPTIMIZED: Filter server-side using toolId instead of fetching all logs
  // Only fetch logs when we have tool data
  const { data: allLogs = [], isLoading: logsLoading } = useLogs({ 
    toolId: toolData?.id, 
    limit: 50 
  });
  // Only fetch user projects if logged in
  const { data: userProjects = [], isLoading: projectsLoading } = useProjects(
    session?.user?.id ? { authorId: session.user.id, limit: 50 } : undefined
  );

  useEffect(() => {
    if (toolData) {
      setTool(toolData);
      // Logs are already filtered server-side by toolId
      setLogs(allLogs);
      
      // Filter user's projects that use this tool
      const toolProjects = userProjects.filter((p: any) => 
        p.tools?.includes(toolData.icon)
      );
      setProjects(toolProjects.slice(0, 12));
    }
    if (descData) {
      setDescription(descData);
    }
    setLoading(toolLoading || logsLoading || projectsLoading);
  }, [toolData, descData, allLogs, userProjects, toolLoading, logsLoading, projectsLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--text-muted)]">Tool not found</div>
      </div>
    );
  }

  const ratingDistribution: Record<number, number> = tool.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const totalRatings = (Object.values(ratingDistribution) as number[]).reduce((a, b) => a + b, 0) || tool.ratingsCount || 0;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://stackboxd.vercel.app";

  return (
    <>
      {tool && (
        <StructuredData data={generateToolStructuredData(tool, baseUrl)} />
      )}
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 px-4 sm:px-6">
      {/* Hero Section - Mobile optimized */}
      <section className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--border)] shadow-xl">
        {/* Background gradient */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            background: `linear-gradient(135deg, ${tool.color || '#00FF8F'}20 0%, transparent 100%)`
          }}
        />
        
        <div className="relative p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6 md:gap-8">
            {/* Tool Icon - Mobile: Smaller, Desktop: Larger */}
            <div 
              className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-2xl sm:rounded-3xl border-2 flex items-center justify-center shadow-2xl transition-all hover:scale-105 hover:shadow-[var(--primary)]/20"
              style={{ 
                background: `${tool.color || '#888'}15`,
                borderColor: `${tool.color || '#888'}40`,
                boxShadow: `0 20px 40px ${tool.color || '#888'}20`,
              }}
            >
              <Icon 
                icon={tool.icon} 
                width={48} 
                height={48} 
                className="sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
                style={{ color: tool.color }} 
              />
            </div>

            {/* Tool Info */}
            <div className="flex-1 min-w-0 space-y-3 sm:space-y-4 text-center lg:text-left w-full">
              <div>
                <h1 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold tracking-tight mb-2"
                  style={{ color: tool.color }}
                >
                  {tool.name}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-xs sm:text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    {tool.category}
                  </span>
                  {tool.site && (
                    <a 
                      href={tool.site} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/50 transition-all"
                    >
                      <Icon icon="mdi:link" width={12} height={12} className="sm:w-[14px] sm:h-[14px]" />
                      <span className="truncate max-w-[200px] sm:max-w-xs">{tool.site.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Stats Grid - Mobile: Stack, Desktop: Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 max-w-lg mx-auto lg:mx-0">
                <div className="flex flex-col p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                  <span className="text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1 sm:mb-2">Average</span>
                  <div className="flex items-baseline gap-1 sm:gap-2 justify-center">
                    <span 
                      className="text-xl sm:text-2xl md:text-3xl font-extrabold"
                      style={{ color: tool.color }}
                    >
                      {tool.avgRating?.toFixed(1) || '0.0'}
                    </span>
                    <Icon icon="mdi:star" width={14} height={14} className="sm:w-5 sm:h-5 text-yellow-400" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-[var(--text-muted)] mt-0.5 sm:mt-1 text-center">
                    {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
                  </span>
                </div>
                <div className="flex flex-col p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                  <span className="text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1 sm:mb-2">Developers</span>
                  <span 
                    className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center"
                    style={{ color: tool.color }}
                  >
                    {tool.usedByCount?.toLocaleString() || '0'}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[var(--text-muted)] mt-0.5 sm:mt-1 text-center">
                    have logged
                  </span>
                </div>
                <div className="flex flex-col p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                  <span className="text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1 sm:mb-2">Reviews</span>
                  <span 
                    className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center"
                    style={{ color: tool.color }}
                  >
                    {logs.length}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[var(--text-muted)] mt-0.5 sm:mt-1 text-center">
                    experiences
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button - Mobile: Full width, Desktop: Auto */}
            {session && (
              <div className="flex-shrink-0 w-full lg:w-auto lg:self-start">
                <Link
                  href={`/log/new?tool=${tool.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-4 sm:px-6 py-2.5 sm:py-3.5 text-black font-bold shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,0,0,0.6)] hover:opacity-90 transition-all hover:scale-105 w-full lg:w-auto text-sm sm:text-base min-h-[44px] sm:min-h-0"
                >
                  <Icon icon="mdi:plus-circle" width={18} height={18} className="sm:w-5 sm:h-5" />
                  <span>Log Tool</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section - Mobile optimized */}
      {description && description.description && (
        <section className="rounded-lg sm:rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 md:p-6 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">About {tool.name}</h2>
            {description.source && (
              <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] uppercase tracking-wide">
                Source: {description.source}
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-3xl">{description.description}</p>
        </section>
      )}

      {/* Rating Distribution Histogram - Mobile optimized */}
      {totalRatings > 0 && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 rounded-lg sm:rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 md:p-6">
            <RatingDistributionHistogram 
              distribution={ratingDistribution} 
              totalRatings={totalRatings}
              toolColor={tool.color}
              avgRating={tool.avgRating}
            />
          </div>
          
          {/* Additional Stats Card - Mobile optimized */}
          <div className="rounded-lg sm:rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 md:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--text-muted)]">Total Ratings</span>
                <span className="text-lg font-bold">{totalRatings}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--text-muted)]">Average Rating</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold">{tool.avgRating?.toFixed(2) || '0.00'}</span>
                  <Icon icon="mdi:star" width={18} height={18} className="text-yellow-400" />
                </div>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--text-muted)]">Unique Users</span>
                <span className="text-lg font-bold">{tool.usedByCount?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">Total Reviews</span>
                <span className="text-lg font-bold">{logs.length}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Popular Logs - Mobile optimized */}
      {logs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold">Recent Reviews</h2>
            <span className="text-xs sm:text-sm text-[var(--text-muted)]">{logs.length} {logs.length === 1 ? 'review' : 'reviews'}</span>
          </div>
          {/* Mobile: 1 column, Desktop: 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {logs.slice(0, 8).map((log) => (
              <Link
                key={log.id}
                href={`/logs/${log.id}`}
                className="group rounded-lg sm:rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 hover:border-[var(--primary)]/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Link
                    href={`/profile/${log.userData?.username || log.user}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-shrink-0"
                  >
                    {log.userData?.avatarUrl ? (
                      <img
                        src={log.userData.avatarUrl}
                        alt={log.userData.username}
                        className="w-10 h-10 rounded-full border-2 border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[var(--bg)] border-2 border-[var(--border)] flex items-center justify-center text-sm font-semibold">
                        {(log.userData?.username || log.user || 'U')[0].toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/profile/${log.userData?.username || log.user}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-[var(--text)] hover:text-[var(--primary)] transition-colors truncate"
                      >
                        {log.userData?.displayName || `@${log.userData?.username || log.user || 'user'}`}
                      </Link>
                      <span className="flex items-center gap-0.5 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            icon="mdi:star"
                            width={12}
                            height={12}
                            className={i < (log.rating || 0) ? "text-yellow-400" : "text-[var(--text-muted)]/30"}
                          />
                        ))}
                      </span>
                      <span className="ml-auto text-xs text-[var(--text-muted)]">
                        {shortAgo(log.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] line-clamp-3 group-hover:text-[var(--text)] transition-colors">
                      {log.review}
                    </p>
                    {(log.reactions || log.comments) && (
                      <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-muted)]">
                        {log.reactions > 0 && (
                          <span className="flex items-center gap-1">
                            <Icon icon="mdi:heart" width={14} height={14} />
                            {log.reactions}
                          </span>
                        )}
                        {log.comments > 0 && (
                          <span className="flex items-center gap-1">
                            <Icon icon="mdi:comment" width={14} height={14} />
                            {log.comments}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Used In Projects */}
      {projects.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Used In Your Projects</h2>
              {session && (
                <p className="text-sm text-[var(--text-muted)] mt-1">Your projects that use this tool</p>
              )}
            </div>
            <span className="text-sm text-[var(--text-muted)]">{projects.length} {projects.length === 1 ? 'project' : 'projects'}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden hover:border-[var(--primary)]/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {project.coverImage ? (
                  <div
                    className="aspect-[4/3] w-full bg-center bg-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${project.coverImage})` }}
                  >
                    <div className="w-full h-full bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] w-full bg-gradient-to-br from-black via-zinc-900 to-[#00FF8F10] flex items-center justify-center">
                    <Icon icon="mdi:code-tags" width={32} height={32} className="text-[var(--text-muted)] opacity-50" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                    {project.displayName || project.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    {project.tools?.slice(0, 3).map((icon: string, idx: number) => {
                      const isCurrentTool = icon === tool.icon;
                      return (
                        <div
                          key={idx}
                          className="w-5 h-5 rounded border border-[var(--border)] flex items-center justify-center"
                          style={{ 
                            background: isCurrentTool ? `${tool.color}15` : 'var(--bg)',
                            borderColor: isCurrentTool ? `${tool.color}30` : 'var(--border)'
                          }}
                        >
                          <Icon 
                            icon={icon} 
                            width={12} 
                            height={12} 
                            style={{ color: isCurrentTool ? tool.color : 'var(--text-muted)' }}
                          />
                        </div>
                      );
                    })}
                    {project.tools && project.tools.length > 3 && (
                      <span className="text-xs text-[var(--text-muted)]">+{project.tools.length - 3}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty States */}
      {logs.length === 0 && projects.length === 0 && (
        <div className="text-center py-16 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <Icon icon="mdi:file-document-outline" width={64} height={64} className="mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
          <p className="text-lg text-[var(--text-muted)] mb-2">No reviews or projects yet</p>
          {session && (
            <Link
              href={`/log/new?tool=${tool.slug}`}
              className="inline-block mt-4 text-[var(--primary)] hover:underline text-sm font-medium"
            >
              Be the first to review {tool.name} →
            </Link>
          )}
        </div>
      )}
    </div>
    </>
  );
}