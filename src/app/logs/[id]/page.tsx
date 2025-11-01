"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLog, useComments, useReactions } from "@/lib/api-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api-hooks";

export default function LogDetail() {
  const params = useParams();
  const logId = params.id as string;
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Use React Query hooks - data is instantly available if prefetched!
  const { data: log, isLoading: logLoading, error: logError } = useLog(logId);
  const { data: comments = [], isLoading: commentsLoading } = useComments(logId);
  const { data: reactions = [] } = useReactions(logId);
  const { data: userReactions = [] } = useReactions(undefined, session?.user?.id, !!session?.user?.id);
  
  const loading = logLoading || commentsLoading;
  const reactionCount = reactions.length;
  const liked = session?.user?.id ? userReactions.includes(logId) : false;

  const handleLike = async () => {
    if (!session?.user?.id) return;

    try {
      await api.reactions.toggle(logId);
      // Invalidate reactions queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.reactions.list(logId, undefined) });
      queryClient.invalidateQueries({ queryKey: queryKeys.reactions.list(undefined, session.user.id) });
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !newComment.trim()) return;

    setSubmitting(true);
    try {
      await api.comments.create(logId, newComment.trim());
      // Invalidate comments query to refetch updated list
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(logId) });
      setNewComment("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/logs/${logId}`;
    if (navigator.share) {
      await navigator.share({
        title: `${log?.userData?.displayName || log?.user}'s review of ${log?.tool?.name}`,
        text: log?.review?.substring(0, 200),
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  if (!log) {
    return notFound();
  }

  const toolColor = log.tool?.color || "#888";
  const userDisplayName = log.userData?.displayName || log.user;
  const userAvatar = log.userData?.avatarUrl;

  return (
    <div className="w-full max-w-5xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)] px-0 py-3 mb-0 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="px-4 sm:px-6 lg:px-8">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors group"
        >
          <div className="p-1.5 rounded-full group-hover:bg-[var(--surface)] transition-colors">
            <Icon icon="mdi:arrow-left" width={18} height={18} />
          </div>
          <span className="font-medium">Back</span>
        </Link>
        </div>
      </div>

      {/* Log Post - Twitter/X Style */}
      <article className="border-b border-[var(--border)] hover:bg-[var(--surface)]/50 transition-colors py-8">
        {/* User Header */}
        <div className="flex items-start gap-3 mb-4">
          <Link href={`/profile/${log.userData?.username || log.user}`} className="flex-shrink-0">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userDisplayName}
                className="h-14 w-14 rounded-full hover:opacity-80 transition-opacity"
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5 border-2 border-[var(--border)] flex items-center justify-center text-lg font-bold hover:opacity-80 transition-opacity">
                {userDisplayName[0]?.toUpperCase() || "U"}
              </div>
            )}
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Link
                href={`/profile/${log.userData?.username || log.user}`}
                className="font-bold text-[var(--text)] hover:underline text-base"
              >
                {userDisplayName}
              </Link>
              {log.userData?.username && (
                <>
                  <span className="text-[var(--text-muted)]">@</span>
                  <Link
                    href={`/profile/${log.userData.username}`}
                    className="text-[var(--text-muted)] hover:underline text-sm"
                  >
                    {log.userData.username}
                  </Link>
                </>
              )}
              <span className="text-[var(--text-muted)]">·</span>
              <time className="text-[var(--text-muted)] text-sm hover:underline cursor-pointer">
                {new Date(log.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
              <span>reviewed</span>
              <Link
                href={`/tools/${log.tool?.slug}`}
                className="font-semibold hover:underline"
                style={{ color: toolColor }}
              >
                {log.tool?.name}
              </Link>
            </div>
          </div>
        </div>

        {/* Tool Badge & Rating */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl border-2 flex-shrink-0"
            style={{
              background: `${toolColor}15`,
              borderColor: `${toolColor}40`,
            }}
          >
            <Icon icon={log.tool?.icon} width={32} height={32} style={{ color: toolColor }} />
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                icon="mdi:star"
                width={20}
                height={20}
                className={i < (log.rating || 0) ? "text-yellow-400 fill-current" : "text-[var(--text-muted)]/20 fill-current"}
              />
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div className="mb-4">
          <p className="text-[var(--text)] whitespace-pre-wrap leading-relaxed text-[15px] break-words">{log.review}</p>
        </div>

        {/* Tags & Project */}
        <div className="mb-4 space-y-2">
          {log.tags && log.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {log.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/discover?tag=${tag}`}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--surface)] border border-[var(--border)] text-[var(--primary)] hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/30 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
          {log.project && (
            <Link
              href={`/projects/${log.project.id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-muted)] bg-[var(--surface)] hover:border-[var(--primary)]/30 transition-colors group"
            >
              <Icon icon="mdi:code-tags" width={14} height={14} />
              <span className="group-hover:text-[var(--text)] transition-colors">Used in {log.project.name}</span>
            </Link>
          )}
        </div>

        {/* Action Buttons - Twitter Style */}
        <div className="flex items-center justify-between max-w-md pt-4 mt-4 border-t border-[var(--border)]">
          <button
            onClick={handleLike}
            disabled={!session}
            className={`group relative flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
              liked 
                ? "text-red-500 hover:bg-red-500/10" 
                : "text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-red-500"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="relative">
              <Icon
                icon={liked ? "mdi:heart" : "mdi:heart-outline"}
                width={20}
                height={20}
                className={`transition-all ${liked ? "fill-current scale-110" : "group-hover:scale-110"}`}
              />
            </div>
            <span className={`text-sm font-medium ${liked ? "text-red-500" : ""}`}>
              {reactionCount > 0 ? reactionCount : ""}
            </span>
          </button>

          <Link
            href={`#comments`}
            className="group flex items-center gap-2 px-3 py-2 rounded-full text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--primary)] transition-colors"
          >
            <Icon icon="mdi:comment-outline" width={20} height={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{comments.length > 0 ? comments.length : ""}</span>
          </Link>

          <button
            onClick={handleShare}
            className="group flex items-center gap-2 px-3 py-2 rounded-full text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--primary)] transition-colors"
          >
            <Icon icon="mdi:share-variant" width={20} height={20} className="group-hover:scale-110 transition-transform" />
          </button>

          <a
            href={`/logs/${logId}/share`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-3 py-2 rounded-full text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--primary)] transition-colors"
          >
            <Icon icon="mdi:image" width={20} height={20} className="group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </article>

      {/* Comment Form - Twitter Style */}
      <div id="comments" className="border-b border-[var(--border)] py-6 min-h-[120px]">
        {session ? (
          <form onSubmit={handleComment} className="flex gap-3">
            <div className="flex-shrink-0 pt-1">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "You"}
                  className="h-11 w-11 rounded-full hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5 border border-[var(--border)] flex items-center justify-center text-sm font-bold">
                  {(session.user?.name || session.user?.email || "U")[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <textarea
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                  // Auto-resize textarea
                  const textarea = e.target as HTMLTextAreaElement;
                  textarea.style.height = "auto";
                  textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
                }}
                placeholder="Post your reply..."
                rows={1}
                className="w-full resize-none bg-transparent border-0 focus:outline-none text-[var(--text)] placeholder:text-[var(--text-muted)] text-[15px] leading-relaxed"
                style={{ minHeight: "24px", maxHeight: "200px" }}
              />
              <div className="flex items-center justify-between pt-1">
                <div className="flex-1" />
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-4 py-1.5 rounded-full bg-[var(--primary)] text-black font-bold text-sm hover:bg-[var(--primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all disabled:hover:bg-[var(--primary)]"
                >
                  {submitting ? "Replying..." : "Reply"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="py-8 px-4 text-center border-2 border-dashed border-[var(--border)] rounded-xl">
            <p className="text-sm text-[var(--text-muted)] mb-3">Sign in to reply</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)] text-black font-semibold text-sm hover:bg-[var(--primary)]/90 transition-colors"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>

      {/* Comments Thread - Twitter Style */}
      <div className="min-h-[300px]">
        {comments.length === 0 ? (
          <div className="py-20 text-center border-b border-[var(--border)]">
            <Icon icon="mdi:comment-text-outline" width={48} height={48} className="mx-auto mb-3 text-[var(--text-muted)] opacity-40" />
            <p className="text-[var(--text-muted)] text-sm">No replies yet. Be the first to reply!</p>
          </div>
        ) : (
          <div>
            {comments.map((comment, index) => (
              <div
                key={comment.id}
                className={`relative flex gap-3 py-5 border-b border-[var(--border)] hover:bg-[var(--surface)]/30 transition-colors min-h-[80px] ${
                  index === 0 ? "border-t border-[var(--border)]" : ""
                }`}
              >
                {/* Thread line */}
                {index < comments.length - 1 && (
                  <div className="absolute left-[47px] top-14 bottom-0 w-0.5 bg-[var(--border)]" />
                )}

                {/* Avatar */}
                <div className="flex-shrink-0 relative z-10">
                  <Link href={`/profile/${comment.userData?.username || comment.user}`}>
                    {comment.userData?.avatarUrl ? (
                      <img
                        src={comment.userData.avatarUrl}
                        alt={comment.userData.displayName || comment.user}
                        className="h-11 w-11 rounded-full hover:opacity-80 transition-opacity"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5 border border-[var(--border)] flex items-center justify-center text-sm font-bold">
                        {(comment.userData?.displayName || comment.user || "U")[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </Link>
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0 pb-2 min-h-[60px] flex flex-col">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Link
                      href={`/profile/${comment.userData?.username || comment.user}`}
                      className="font-bold text-[var(--text)] hover:underline text-[15px]"
                    >
                      {comment.userData?.displayName || comment.user}
                    </Link>
                    {comment.userData?.username && (
                      <>
                        <span className="text-[var(--text-muted)] text-[15px]">@</span>
                        <Link
                          href={`/profile/${comment.userData.username}`}
                          className="text-[var(--text-muted)] hover:underline text-[15px]"
                        >
                          {comment.userData.username}
                        </Link>
                      </>
                    )}
                    <span className="text-[var(--text-muted)] text-[15px]">·</span>
                    <time className="text-[var(--text-muted)] text-[15px] hover:underline cursor-pointer">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <p className="text-[var(--text)] text-[15px] leading-relaxed whitespace-pre-wrap break-words mb-3 flex-1">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-6 mt-auto">
                    <button className="group flex items-center gap-1 px-2 py-1 rounded-full text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors">
                      <Icon icon="mdi:heart-outline" width={16} height={16} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
