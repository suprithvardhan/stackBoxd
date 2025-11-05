"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Heart, MessageCircle, Share2, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useLogPrefetch, useReactions } from "@/lib/api-hooks";
import Link from "next/link";

type Props = { 
  item: {
    id: string;
    user: string;
    userData?: {
      username: string;
      displayName: string;
      avatarUrl?: string;
    };
    tool: {
      name: string;
      icon: string;
      slug: string;
      color?: string;
    };
    rating: number;
    review: string;
    reactions?: number;
    comments?: number;
    createdAt: string;
    project?: {
      id: string;
      name: string;
    };
    tags?: string[];
  };
};

export function FeedCardLog({ item }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  // OPTIMIZED: Use data already provided in item - no redundant API calls!
  // Reaction and comment counts are already in item.reactions and item.comments from API
  const [reactionCount, setReactionCount] = useState(item.reactions || 0);
  const [commentCount, setCommentCount] = useState(item.comments || 0);
  const [loading, setLoading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // OPTIMIZED: Use React Query hook - cached across all feed cards (single API call per user)
  // This checks if user has liked ANY log, cached for all cards
  const { data: userReactions = [] } = useReactions(
    undefined, 
    session?.user?.id, 
    !!session?.user?.id
  );
  const liked = session?.user?.id ? userReactions.includes(item.id) : false;
  
  // Prefetch log details, comments, and reactions for instant navigation
  const { handleMouseEnter } = useLogPrefetch(item.id, true, true);

  useEffect(() => {
    const handleClickOutside = () => {
      if (showShareMenu) {
        setShowShareMenu(false);
      }
    };
    if (showShareMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showShareMenu]);

  const handleLike = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const result = await api.reactions.toggle(item.id);
      setLiked(result.reacted);
      setReactionCount((prev) => (result.reacted ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/logs/${item.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${item.userData?.displayName || item.user}'s review of ${item.tool.name}`,
          text: item.review.substring(0, 200),
          url,
        });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareImage = () => {
    const url = `${window.location.origin}/api/og/log/${item.id}`;
    window.open(url, "_blank");
  };

  const userDisplayName = item.userData?.displayName || item.user;
  const userAvatar = item.userData?.avatarUrl;
  const toolColor = item.tool.color || "#888";

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg sm:rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <header className="mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
        <Link href={`/profile/${item.userData?.username || item.user}`} className="flex-shrink-0">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userDisplayName}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-[var(--border)] hover:border-[var(--primary)] transition-colors object-cover"
            />
          ) : (
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[var(--bg)] border-2 border-[var(--border)] flex items-center justify-center text-xs sm:text-sm font-semibold hover:border-[var(--primary)] transition-colors">
              {userDisplayName[0]?.toUpperCase() || "U"}
            </div>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <Link
              href={`/profile/${item.userData?.username || item.user}`}
              className="text-xs sm:text-sm font-semibold text-[var(--text)] hover:text-[var(--primary)] transition-colors truncate"
            >
              {userDisplayName}
            </Link>
            <span className="text-xs sm:text-sm text-[var(--text-muted)] hidden sm:inline">logged</span>
            <Link
              href={`/tools/${item.tool.slug}`}
              className="text-xs sm:text-sm font-semibold text-[var(--text)] hover:text-[var(--primary)] transition-colors truncate"
              style={{ color: toolColor }}
            >
              {item.tool.name}
            </Link>
            <span className="text-xs sm:text-sm text-[var(--text-muted)]">· {timeAgo(item.createdAt)}</span>
          </div>
        </div>
      </header>

      <Link 
        href={`/logs/${item.id}`} 
        className="block"
        onMouseEnter={handleMouseEnter}
      >
        <div className="flex gap-3 sm:gap-4">
          <div
            className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-lg border-2 transition-transform hover:scale-105 flex-shrink-0"
            style={{
              background: `${toolColor}15`,
              borderColor: `${toolColor}40`,
            }}
          >
            <Icon icon={item.tool.icon} width={20} height={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: toolColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-1.5 sm:mb-2 flex items-center gap-1 sm:gap-2">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  icon="mdi:star"
                  width={12}
                  height={12}
                  className="sm:w-4 sm:h-4"
                  style={{ 
                    color: i < item.rating ? "#fbbf24" : undefined,
                    fill: i < item.rating ? "#fbbf24" : "rgba(255,255,255,0.1)"
                  }}
                />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2 sm:line-clamp-3 mb-2 leading-relaxed">{item.review}</p>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            {item.project && (
              <div className="mt-2 inline-flex items-center gap-1.5 sm:gap-2 rounded-md border border-[var(--border)] px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-[var(--text-muted)] bg-[var(--bg)]">
                <Icon icon="mdi:code-tags" width={12} height={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Used in </span><span className="text-[var(--text)] font-medium truncate max-w-[120px] sm:max-w-none">{item.project.name}</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <footer className="mt-3 sm:mt-4 flex items-center gap-4 sm:gap-6 pt-3 sm:pt-4 border-t border-[var(--border)]">
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLike();
          }}
          disabled={loading}
          className={`inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition-colors min-h-[44px] sm:min-h-0 ${
            liked ? "text-red-400" : "text-[var(--text-muted)] hover:text-red-400"
          } disabled:opacity-50`}
        >
          <Icon
            icon={liked ? "mdi:heart" : "mdi:heart-outline"}
            width={16}
            height={16}
            className="sm:w-[18px] sm:h-[18px]"
            style={{ fill: liked ? "currentColor" : "none" }}
          />
          <span>{reactionCount}</span>
        </button>

        <Link
          href={`/logs/${item.id}`}
          className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors min-h-[44px] sm:min-h-0"
        >
          <Icon icon="mdi:comment-outline" width={16} height={16} className="sm:w-[18px] sm:h-[18px]" />
          <span>{commentCount}</span>
        </Link>

        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (showShareMenu) {
                handleShare();
              } else {
                setShowShareMenu(true);
              }
            }}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors min-h-[44px] sm:min-h-0"
          >
            {copied ? (
              <>
                <Icon icon="mdi:check" width={16} height={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Icon icon="mdi:share-variant" width={16} height={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          {showShareMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowShareMenu(false)}
              />
              <div className="absolute bottom-full left-0 mb-2 z-20 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl overflow-hidden">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleShare();
                    setShowShareMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors flex items-center gap-2"
                >
                  <Icon icon="mdi:link" width={18} height={18} />
                  <span>Copy link</span>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleShareImage();
                    setShowShareMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors flex items-center gap-2"
                >
                  <Icon icon="mdi:image" width={18} height={18} />
                  <span>Share as image</span>
                </button>
              </div>
            </>
          )}
        </div>
      </footer>
    </motion.article>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.round(diff / 3_600_000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}
