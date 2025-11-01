"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ListDetailPage() {
  const params = useParams();
  const listId = params.id as string;
  const { data: session } = useSession();
  const [list, setList] = useState<any>(null);
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [listData, toolsData] = await Promise.all([
          api.lists.get(listId),
          api.tools.list({ limit: 200 }),
        ]);
        setList(listData);
        setTools(toolsData);
        
        if (listData.author) {
          try {
            const authorData = await api.users.get(listData.author);
            setAuthor(authorData);
          } catch (error) {
            console.error("Failed to load author:", error);
          }
        }
      } catch (error) {
        console.error("Failed to load list:", error);
      } finally {
        setLoading(false);
      }
    };
    if (listId) {
      loadData();
    }
  }, [listId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--text-muted)]">List not found</div>
      </div>
    );
  }

  function getTool(slug: string) {
    return tools.find((t) => t.slug === slug);
  }

  const isOwner = session?.user?.id === list.userId;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Header */}
      <section className="relative rounded-2xl overflow-hidden border border-[var(--border)] shadow-lg">
        {list.cover ? (
          <div className="relative h-64 w-full">
            <img 
              src={list.cover} 
              alt={list.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </div>
        ) : (
          <div className="h-64 w-full bg-gradient-to-br from-[var(--primary)]/20 via-[var(--secondary)]/10 to-transparent flex items-center justify-center">
            <Icon icon="mdi:format-list-bulleted-square" width={64} height={64} className="text-[var(--primary)] opacity-50" />
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg">{list.title}</h1>
                {list.visibility === "private" && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-xs text-white">
                    <Icon icon="mdi:lock" width={14} height={14} />
                    Private
                  </span>
                )}
              </div>
              {list.description && (
                <p className="text-white/90 text-base mb-4 max-w-2xl drop-shadow">{list.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-white/80">
                <Link 
                  href={`/profile/${list.author}`}
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  {author?.avatarUrl ? (
                    <img 
                      src={author.avatarUrl} 
                      alt={author.username} 
                      className="w-6 h-6 rounded-full border-2 border-white/30 group-hover:border-white/60 transition-colors"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">
                      {list.author[0]?.toUpperCase()}
                    </div>
                  )}
                  <span>@{list.author}</span>
                </Link>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Icon icon="mdi:package-variant" width={16} height={16} />
                  {list.count || 0} tools
                </span>
              </div>
            </div>
            {!isOwner && (
              <button className="rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition-all flex items-center gap-2">
                <Icon icon="mdi:heart-outline" width={16} height={16} />
                Follow
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      {list.tools && list.tools.length > 0 ? (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text)]">Tools in this list</h2>
            <span className="text-sm text-[var(--text-muted)]">{list.tools.length} items</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.tools.map((slug: string, index: number) => {
              const tool = getTool(slug);
              if (!tool) {
                return (
                  <div 
                    key={slug} 
                    className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--border)]/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center">
                        <Icon icon="mdi:package-variant" width={24} height={24} className="text-[var(--text-muted)]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-[var(--text)]">{slug}</div>
                        <div className="text-xs text-[var(--text-muted)] mt-0.5">Unknown tool</div>
                      </div>
                    </div>
                  </div>
                );
              }
              
              return (
                <Link
                  key={slug}
                  href={`/tools/${slug}`}
                  className="group relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--primary)]/50 hover:shadow-lg hover:shadow-[var(--primary)]/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Background gradient on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, ${tool.color || '#888'}08 0%, transparent 100%)`
                    }}
                  />
                  
                  <div className="relative z-10 flex items-start gap-4">
                    {/* Icon */}
                    <div 
                      className="flex-shrink-0 w-14 h-14 rounded-xl border border-[var(--border)] flex items-center justify-center transition-transform group-hover:scale-110 group-hover:shadow-lg"
                      style={{ 
                        background: `${tool.color || '#888'}15`,
                        borderColor: `${tool.color || '#888'}30`
                      }}
                    >
                      <Icon 
                        icon={tool.icon} 
                        width={28} 
                        height={28} 
                        style={{ color: tool.color }} 
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 
                          className="font-bold text-lg tracking-tight group-hover:underline truncate"
                          style={{ color: tool.color }}
                        >
                          {tool.name}
                        </h3>
                        <span className="flex-shrink-0 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg)] px-2 py-0.5 rounded border border-[var(--border)]">
                          #{index + 1}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-muted)] capitalize mb-3">{tool.category}</p>
                      
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                          <Icon icon="mdi:star" width={14} height={14} />
                          {tool.avgRating?.toFixed(1) || '0.0'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon icon="mdi:account-group" width={14} height={14} />
                          {tool.usedByCount?.toLocaleString() || '0'} users
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative accent */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ 
                      background: `linear-gradient(90deg, ${tool.color || '#888'} 0%, transparent 100%)`
                    }}
                  />
                </Link>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="text-center py-16 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <Icon icon="mdi:package-variant" width={64} height={64} className="mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
          <p className="text-lg text-[var(--text-muted)] mb-2">No tools in this list yet</p>
          {isOwner && (
            <Link
              href={`/lists/${listId}/edit`}
              className="inline-block mt-4 text-[var(--primary)] hover:underline text-sm font-medium"
            >
              Add tools to this list →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
