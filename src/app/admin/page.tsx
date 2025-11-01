"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { isAdminAuthenticated, logoutAdmin } from "@/lib/admin-auth";
import Link from "next/link";

type AnalyticsData = {
  period: string;
  overview: {
    totalEvents: number;
    pageViews: number;
    uniqueUsers: number;
    newUsers: number;
    activeUsers: number;
  };
  content: {
    totalLogs: number;
    totalProjects: number;
    totalTools: number;
    totalLists: number;
    totalFollows: number;
  };
  engagement: {
    totalPageViews: number;
    avgTimeOnPage: number;
    bounceRate: number;
    totalSessions: number;
    avgSessionDuration: number;
    avgEventsPerSession: number;
  };
  geographic: {
    countries: Array<{ country: string; count: number }>;
  };
  technical: {
    devices: Array<{ device: string; count: number }>;
    browsers: Array<{ browser: string; count: number }>;
    os: Array<{ os: string; count: number }>;
  };
  traffic: {
    referrers: Array<{ referrer: string; count: number }>;
    hourly: Array<{ hour: number; count: number }>;
  };
  eventsByType: Array<{ type: string; count: number }>;
  eventsByDay: Array<{ date: string; count: number }>;
  topPages: Array<{ path: string; count: number }>;
  topUsers: Array<{ user: any; count: number }>;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState("7d");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push("/admin/login");
      return;
    }
    setAuthenticated(true);
    loadAnalytics();
  }, [router, period]);

  const loadAnalytics = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/admin/analytics?period=${period}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  if (!authenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-[var(--text-muted)]">No data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icon icon="mdi:chart-line" width={32} height={32} className="text-[var(--primary)]" />
              <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadAnalytics}
                disabled={refreshing}
                className="px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--bg)] transition disabled:opacity-50"
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Selector */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-[var(--text-muted)]">Period:</span>
          {["7d", "30d", "90d", "all"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                period === p
                  ? "bg-[var(--primary)] text-black"
                  : "bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--bg)]"
              }`}
            >
              {p === "all" ? "All Time" : p}
            </button>
          ))}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Total Events"
            value={data.overview.totalEvents.toLocaleString()}
            icon="mdi:chart-bar"
          />
          <StatCard
            title="Page Views"
            value={data.overview.pageViews.toLocaleString()}
            icon="mdi:eye"
          />
          <StatCard
            title="Unique Users"
            value={data.overview.uniqueUsers.toLocaleString()}
            icon="mdi:account-group"
          />
          <StatCard
            title="Active Users"
            value={data.overview.activeUsers.toLocaleString()}
            icon="mdi:account-check"
          />
          <StatCard
            title="New Users"
            value={data.overview.newUsers.toLocaleString()}
            icon="mdi:account-plus"
          />
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Avg Session Duration"
            value={formatDuration(data.engagement.avgSessionDuration)}
            icon="mdi:timer"
            color="purple"
          />
          <StatCard
            title="Avg Time on Page"
            value={`${data.engagement.avgTimeOnPage}s`}
            icon="mdi:clock-outline"
            color="blue"
          />
          <StatCard
            title="Events per Session"
            value={data.engagement.avgEventsPerSession.toFixed(1)}
            icon="mdi:chart-timeline"
            color="green"
          />
        </div>

        {/* Content Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Logs Created"
            value={data.content.totalLogs.toLocaleString()}
            icon="mdi:file-document"
            color="blue"
          />
          <StatCard
            title="Projects"
            value={data.content.totalProjects.toLocaleString()}
            icon="mdi:folder"
            color="green"
          />
          <StatCard
            title="Tools"
            value={data.content.totalTools.toLocaleString()}
            icon="mdi:toolbox"
            color="purple"
          />
          <StatCard
            title="Lists"
            value={data.content.totalLists.toLocaleString()}
            icon="mdi:format-list-bulleted"
            color="orange"
          />
          <StatCard
            title="Follows"
            value={data.content.totalFollows.toLocaleString()}
            icon="mdi:account-plus"
            color="pink"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Events Over Time */}
          <ChartCard title="Events Over Time">
            <div className="h-64">
              <EventsChart data={data.eventsByDay} />
            </div>
          </ChartCard>

          {/* Events by Type */}
          <ChartCard title="Events by Type">
            <div className="h-64">
              <EventsByTypeChart data={data.eventsByType} />
            </div>
          </ChartCard>
        </div>

        {/* Geographic & Technical */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Country Distribution */}
          <ChartCard title="Users by Country">
            <div className="h-64 overflow-y-auto">
              <CountryChart data={data.geographic.countries} />
            </div>
          </ChartCard>

          {/* Device Distribution */}
          <ChartCard title="Device Types">
            <div className="h-64">
              <DeviceChart data={data.technical.devices} />
            </div>
          </ChartCard>
        </div>

        {/* Browser & OS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Browser Distribution */}
          <ChartCard title="Browser Distribution">
            <div className="h-64">
              <BrowserChart data={data.technical.browsers} />
            </div>
          </ChartCard>

          {/* OS Distribution */}
          <ChartCard title="Operating Systems">
            <div className="h-64">
              <OSChart data={data.technical.os} />
            </div>
          </ChartCard>
        </div>

        {/* Traffic Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Referrers */}
          <ChartCard title="Traffic Sources">
            <div className="h-64 overflow-y-auto">
              <ReferrerChart data={data.traffic.referrers} />
            </div>
          </ChartCard>

          {/* Hourly Distribution */}
          <ChartCard title="Traffic by Hour (UTC)">
            <div className="h-64">
              <HourlyChart data={data.traffic.hourly} />
            </div>
          </ChartCard>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <TableCard title="Top Pages">
            <div className="space-y-2">
              {data.topPages.slice(0, 10).map((page, idx) => (
                <div key={page.path} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg)] hover:bg-[var(--surface)] transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-sm font-bold text-[var(--primary)]">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-medium text-[var(--text)]">{page.path || "/"}</span>
                  </div>
                  <span className="text-sm text-[var(--text-muted)]">{page.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </TableCard>

          {/* Top Users */}
          <TableCard title="Top Active Users">
            <div className="space-y-2">
              {data.topUsers.slice(0, 10).map((item, idx) => (
                <Link
                  key={item.user?.id}
                  href={`/profile/${item.user?.username}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg)] hover:bg-[var(--surface)] transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-sm font-bold text-[var(--primary)]">
                      {idx + 1}
                    </div>
                    {item.user?.avatarUrl && (
                      <img src={item.user.avatarUrl} alt={item.user.username} className="w-8 h-8 rounded-full" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-[var(--text)]">{item.user?.displayName}</div>
                      <div className="text-xs text-[var(--text-muted)]">@{item.user?.username}</div>
                    </div>
                  </div>
                  <span className="text-sm text-[var(--text-muted)]">{item.count.toLocaleString()} events</span>
                </Link>
              ))}
            </div>
          </TableCard>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color = "primary" }: { title: string; value: string | number; icon: string; trend?: string; color?: string }) {
  const colorClasses: Record<string, string> = {
    primary: "bg-[var(--primary)]/10 text-[var(--primary)]",
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-green-500/10 text-green-400",
    purple: "bg-purple-500/10 text-purple-400",
    orange: "bg-orange-500/10 text-orange-400",
    pink: "bg-pink-500/10 text-pink-400",
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color] || colorClasses.primary} flex items-center justify-center`}>
          <Icon icon={icon} width={24} height={24} />
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-[var(--text-muted)]">{title}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

function TableCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

function EventsChart({ data }: { data: Array<{ date: string; count: number }> }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const reversed = [...data].reverse();

  return (
    <div className="flex items-end justify-between gap-2 h-full">
      {reversed.map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full bg-[var(--bg)] rounded-t overflow-hidden relative" style={{ height: "200px" }}>
            <div
              className="absolute bottom-0 w-full bg-[var(--primary)] rounded-t transition-all"
              style={{ height: `${(item.count / max) * 100}%` }}
            />
          </div>
          <span className="text-xs text-[var(--text-muted)] transform -rotate-45 origin-left whitespace-nowrap">
            {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
      ))}
    </div>
  );
}

function EventsByTypeChart({ data }: { data: Array<{ type: string; count: number }> }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 8);

  return (
    <div className="space-y-3">
      {sorted.map((item) => (
        <div key={item.type} className="flex items-center gap-4">
          <div className="w-24 text-sm text-[var(--text-muted)] truncate">{item.type.replace(/_/g, " ")}</div>
          <div className="flex-1 bg-[var(--bg)] rounded-full h-6 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/70 rounded-full transition-all"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
          <div className="w-16 text-right text-sm font-semibold text-white">{item.count.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

function CountryChart({ data }: { data: Array<{ country: string; count: number }> }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 15);

  return (
    <div className="space-y-3">
      {sorted.map((item) => (
        <div key={item.country} className="flex items-center gap-4">
          <div className="w-20 text-sm font-medium text-[var(--text)]">{item.country}</div>
          <div className="flex-1 bg-[var(--bg)] rounded-full h-6 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
          <div className="w-16 text-right text-sm font-semibold text-white">{item.count.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

function DeviceChart({ data }: { data: Array<{ device: string; count: number }> }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.device}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-[var(--text)] capitalize">{item.device}</span>
            <span className="text-sm text-[var(--text-muted)]">{((item.count / total) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-[var(--bg)] rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all"
              style={{ width: `${(item.count / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function BrowserChart({ data }: { data: Array<{ browser: string; count: number }> }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-4">
      {sorted.map((item) => (
        <div key={item.browser}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-[var(--text)] capitalize">{item.browser}</span>
            <span className="text-sm text-[var(--text-muted)]">{((item.count / total) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-[var(--bg)] rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all"
              style={{ width: `${(item.count / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function OSChart({ data }: { data: Array<{ os: string; count: number }> }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-4">
      {sorted.map((item) => (
        <div key={item.os}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-[var(--text)] capitalize">{item.os}</span>
            <span className="text-sm text-[var(--text-muted)]">{((item.count / total) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-[var(--bg)] rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all"
              style={{ width: `${(item.count / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ReferrerChart({ data }: { data: Array<{ referrer: string; count: number }> }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-3">
      {sorted.map((item) => (
        <div key={item.referrer} className="flex items-center gap-4">
          <div className="w-32 text-sm text-[var(--text-muted)] truncate">{item.referrer}</div>
          <div className="flex-1 bg-[var(--bg)] rounded-full h-6 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full transition-all"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
          <div className="w-16 text-right text-sm font-semibold text-white">{item.count.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

function HourlyChart({ data }: { data: Array<{ hour: number; count: number }> }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex items-end justify-between gap-1 h-full">
      {data.map((item) => (
        <div key={item.hour} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full bg-[var(--bg)] rounded-t overflow-hidden relative" style={{ height: "200px" }}>
            <div
              className="absolute bottom-0 w-full bg-blue-500 rounded-t transition-all"
              style={{ height: `${(item.count / max) * 100}%` }}
            />
          </div>
          <span className="text-xs text-[var(--text-muted)]">{item.hour}h</span>
        </div>
      ))}
    </div>
  );
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}
