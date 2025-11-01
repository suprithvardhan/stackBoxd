"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useTools, useLogs } from "@/lib/api-hooks";

const ITEMS_PER_PAGE = 48; // 6 columns x 8 rows

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('category') || "all";
    }
    return "all";
  });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return parseInt(params.get('page') || '1', 10);
    }
    return 1;
  });

  // Fetch ALL tools (473) from database
  const { data: allTools = [], isLoading: toolsLoading } = useTools({ limit: 500 });
  const { data: logs = [], isLoading: logsLoading } = useLogs({ limit: 20 });

  const loading = toolsLoading || logsLoading;

  // Extract all unique categories from tools and sort them
  const categoriesWithCount = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    allTools.forEach(tool => {
      const cat = tool.category?.trim();
      if (cat) {
        const normalizedCat = cat.toLowerCase();
        categoryMap.set(normalizedCat, (categoryMap.get(normalizedCat) || 0) + 1);
      }
    });

    // Sort categories by count (most tools first), then alphabetically
    return Array.from(categoryMap.entries())
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1]; // Sort by count first
        return a[0].localeCompare(b[0]); // Then alphabetically
      })
      .map(([name, count]) => ({ name, count }));
  }, [allTools]);

  // Filter and sort tools by category
  const filteredAndSortedTools = useMemo(() => {
    let filtered = selectedCategory === "all"
      ? allTools
      : allTools.filter(t => t.category?.toLowerCase().trim() === selectedCategory.toLowerCase());

    // Sort by popularity: usedByCount > avgRating > ratingsCount
    return filtered.sort((a, b) => {
      // Primary: usedByCount (descending)
      if ((b.usedByCount || 0) !== (a.usedByCount || 0)) {
        return (b.usedByCount || 0) - (a.usedByCount || 0);
      }
      // Secondary: avgRating (descending)
      if ((b.avgRating || 0) !== (a.avgRating || 0)) {
        return (b.avgRating || 0) - (a.avgRating || 0);
      }
      // Tertiary: ratingsCount (descending)
      return (b.ratingsCount || 0) - (a.ratingsCount || 0);
    });
  }, [allTools, selectedCategory]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedTools.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTools = filteredAndSortedTools.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Update URL when category or page changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (selectedCategory === "all") {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', selectedCategory);
      }
      if (currentPage === 1) {
        url.searchParams.delete('page');
      } else {
        url.searchParams.set('page', currentPage.toString());
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, [selectedCategory, currentPage]);

  // Show first 6 categories as buttons, rest in dropdown
  const visibleCategories = categoriesWithCount.slice(0, 6);
  const hiddenCategories = categoriesWithCount.slice(6);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Discover Tools</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {selectedCategory === "all" 
                ? `All ${allTools.length} tools` 
                : `${filteredAndSortedTools.length} tools in ${selectedCategory}`}
            </p>
          </div>
        </div>

        {/* Category Filter - Buttons + Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
              selectedCategory === "all" 
                ? "bg-[var(--primary)] text-black border-[var(--primary)] shadow-sm" 
                : "border-[var(--border)] hover:bg-[var(--surface)] hover:border-[var(--primary)]/50"
            }`}
          >
            All ({allTools.length})
          </button>
          
          {/* Visible Category Buttons */}
          {visibleCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition capitalize ${
                selectedCategory === cat.name 
                  ? "bg-[var(--primary)] text-black border-[var(--primary)] shadow-sm" 
                  : "border-[var(--border)] hover:bg-[var(--surface)] hover:border-[var(--primary)]/50"
              }`}
            >
              {cat.name.replace(/\b\w/g, (l) => l.toUpperCase())} ({cat.count})
            </button>
          ))}

          {/* Dropdown for additional categories */}
          {hiddenCategories.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--surface)] hover:border-[var(--primary)]/50 transition flex items-center gap-1.5"
              >
                More Categories
                <Icon 
                  icon={showCategoryDropdown ? "mdi:chevron-up" : "mdi:chevron-down"} 
                  width={16} 
                  height={16} 
                />
              </button>

              {showCategoryDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowCategoryDropdown(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 z-20 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl max-h-[400px] overflow-y-auto min-w-[200px]">
                    {hiddenCategories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition capitalize ${
                          selectedCategory === cat.name 
                            ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium" 
                            : "hover:bg-[var(--bg)] text-[var(--text)]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{cat.name.replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                          <span className="text-xs text-[var(--text-muted)] ml-2">{cat.count}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm uppercase tracking-wide text-[var(--text-muted)] font-semibold">
            {selectedCategory === "all" ? "All Tools" : `${selectedCategory.replace(/\b\w/g, (l) => l.toUpperCase())} Tools`}
          </h2>
          <span className="text-xs text-[var(--text-muted)]">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedTools.length)} of {filteredAndSortedTools.length} {filteredAndSortedTools.length === 1 ? 'tool' : 'tools'}
          </span>
        </div>
        
        {filteredAndSortedTools.length === 0 ? (
          <div className="text-center py-16 border border-[var(--border)] rounded-xl bg-[var(--surface)]">
            <Icon icon="mdi:toolbox-outline" width={48} height={48} className="mx-auto mb-3 text-[var(--text-muted)] opacity-40" />
            <p className="text-[var(--text-muted)]">No tools found in this category.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {paginatedTools.map((t) => (
              <Link 
                key={t.slug || t.id} 
                href={`/tools/${t.slug}`}
                className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--primary)]/50 hover:shadow-lg transition-all"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--border)] transition-transform group-hover:scale-110" 
                     style={{ background: (t.color || '#888') + '15' }}>
                  <Icon icon={t.icon} width={24} height={24} style={{ color: t.color }} />
                </div>
                <div className="text-sm font-semibold mb-1 line-clamp-2 group-hover:underline" style={{ color: t.color }}>
                  {t.name}
                </div>
                <div className="text-xs text-[var(--text-muted)] space-y-0.5">
                  <div className="flex items-center gap-1">
                    <Icon icon="mdi:star" width={12} height={12} className="text-yellow-400" />
                    <span>{(t.avgRating || 0).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon icon="mdi:account-group" width={12} height={12} />
                    <span>{(t.usedByCount || 0).toLocaleString()} users</span>
                  </div>
                </div>
              </Link>
              ))}

            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-[var(--border)]">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg)] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1.5"
                >
                  <Icon icon="mdi:chevron-left" width={20} height={20} />
                  <span>Previous</span>
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg border transition min-w-[40px] ${
                          currentPage === pageNum
                            ? "bg-[var(--primary)] text-black border-[var(--primary)] font-semibold"
                            : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg)] hover:border-[var(--primary)]/50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg)] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <Icon icon="mdi:chevron-right" width={20} height={20} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wide text-[var(--text-muted)]">Recent Logs</h2>
        {logs.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <p>No logs yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {logs.map((l) => (
              <Link key={l.id} href={`/logs/${l.id}`} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:bg-white/5 transition">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-[var(--bg)]" style={{ background: (l.tool.color || '#888') + '10' }}>
                    <Icon icon={l.tool.icon} width={16} height={16} style={{ color: l.tool.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[var(--text)] font-semibold">{l.tool.name}</div>
                    <div className="text-[var(--text-muted)] text-xs line-clamp-2">{l.review.slice(0, 80)}…</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">by @{l.user}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
