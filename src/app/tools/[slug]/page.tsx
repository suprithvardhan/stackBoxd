"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import { Icon } from "@iconify/react";
import Link from "next/link";

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

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load tool data and description in parallel
        const [toolData, descData] = await Promise.all([
          api.tools.get(slug),
          api.tools.getDescription(slug).catch(() => ({ description: null, source: null })),
        ]);
        
        setTool(toolData);
        setDescription(descData);
        
        // Load logs and projects in parallel
        // Only load user's projects if logged in, otherwise show empty
        const loadPromises: Promise<any>[] = [
          api.logs.list({ limit: 50 }),
        ];
        
        // Only load user projects if logged in
        if (session?.user?.id) {
          loadPromises.push(api.projects.list({ authorId: session.user.id, limit: 50 }));
        } else {
          loadPromises.push(Promise.resolve([]));
        }
        
        const [logsData, projectsData] = await Promise.all(loadPromises);
        
        // Filter logs for this tool
        const toolLogs = logsData.filter((log: any) => log.tool?.slug === slug);
        setLogs(toolLogs);
        
        // Filter user's projects that use this tool
        const toolProjects = projectsData.filter((p: any) => 
          p.tools?.includes(toolData.icon)
        );
        setProjects(toolProjects.slice(0, 12));
      } catch (error) {
        console.error("Failed to load tool:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      loadData();
    }
  }, [slug, session?.user?.id]);

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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section - Redesigned */}
      <section className="relative rounded-2xl overflow-hidden border border-[var(--border)] shadow-xl">
        {/* Background gradient */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            background: `linear-gradient(135deg, ${tool.color || '#00FF8F'}20 0%, transparent 100%)`
          }}
        />
        
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Tool Icon - Larger and more prominent */}
            <div 
              className="flex-shrink-0 w-36 h-36 md:w-44 md:h-44 rounded-3xl border-2 flex items-center justify-center shadow-2xl transition-all hover:scale-105 hover:shadow-[var(--primary)]/20"
              style={{ 
                background: `${tool.color || '#888'}15`,
                borderColor: `${tool.color || '#888'}40`,
                boxShadow: `0 20px 40px ${tool.color || '#888'}20`,
              }}
            >
              <Icon 
                icon={tool.icon} 
                width={80} 
                height={80} 
                style={{ color: tool.color }} 
                className="md:w-28 md:h-28"
              />
            </div>

            {/* Tool Info */}
            <div className="flex-1 min-w-0 space-y-4">
              <div>
                <h1 
                  className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2"
                  style={{ color: tool.color }}
                >
                  {tool.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    {tool.category}
                  </span>
                  {tool.site && (
                    <a 
                      href={tool.site} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/50 transition-all"
                    >
                      <Icon icon="mdi:link" width={14} height={14} />
                      <span className="truncate max-w-xs">{tool.site.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Stats Grid - Enhanced */}
              <div className="grid grid-cols-3 gap-6 max-w-lg">
                <div className="flex flex-col p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Average</span>
                  <div className="flex items-baseline gap-2">
                    <span 
                      className="text-3xl font-extrabold"
                      style={{ color: tool.color }}
                    >
                      {tool.avgRating?.toFixed(1) || '0.0'}
                    </span>
                    <Icon icon="mdi:star" width={20} height={20} className="text-yellow-400" />
                  </div>
                  <span className="text-xs text-[var(--text-muted)] mt-1">
                    {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
                  </span>
                </div>
                <div className="flex flex-col p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Developers</span>
                  <span 
                    className="text-3xl font-extrabold"
                    style={{ color: tool.color }}
                  >
                    {tool.usedByCount?.toLocaleString() || '0'}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] mt-1">
                    have logged
                  </span>
                </div>
                <div className="flex flex-col p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Reviews</span>
                  <span 
                    className="text-3xl font-extrabold"
                    style={{ color: tool.color }}
                  >
                    {logs.length}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] mt-1">
                    experiences shared
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            {session && (
              <div className="flex-shrink-0 lg:self-start">
                <Link
                  href={`/log/new?tool=${tool.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3.5 text-black font-bold shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,0,0,0.6)] hover:opacity-90 transition-all hover:scale-105"
                >
                  <Icon icon="mdi:plus-circle" width={20} height={20} />
                  Log Tool
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      {description && description.description && (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">About {tool.name}</h2>
            {description.source && (
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] uppercase tracking-wide">
                Source: {description.source}
              </span>
            )}
          </div>
          <p className="text-[var(--text-muted)] leading-relaxed max-w-3xl">{description.description}</p>
        </section>
      )}

      {/* Rating Distribution Histogram - Letterboxd Style */}
      {totalRatings > 0 && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <RatingDistributionHistogram 
              distribution={ratingDistribution} 
              totalRatings={totalRatings}
              toolColor={tool.color}
              avgRating={tool.avgRating}
            />
          </div>
          
          {/* Additional Stats Card */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold mb-6">Statistics</h2>
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

      {/* Popular Logs */}
      {logs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Reviews</h2>
            <span className="text-sm text-[var(--text-muted)]">{logs.length} {logs.length === 1 ? 'review' : 'reviews'}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {logs.slice(0, 8).map((log) => (
              <Link
                key={log.id}
                href={`/logs/${log.id}`}
                className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--primary)]/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
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
  );
}