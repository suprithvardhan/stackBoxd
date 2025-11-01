"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock data for demo purposes
const mockData = {
  period: "30d",
  overview: {
    totalEvents: 125847,
    pageViews: 89432,
    uniqueUsers: 3421,
    newUsers: 892,
    activeUsers: 2156,
  },
  content: {
    totalLogs: 1247,
    totalProjects: 456,
    totalTools: 473,
    totalLists: 189,
    totalFollows: 3421,
  },
  engagement: {
    totalPageViews: 89432,
    avgTimeOnPage: 127,
    bounceRate: 32.5,
    totalSessions: 12543,
    avgSessionDuration: 245000, // milliseconds
    avgEventsPerSession: 10.3,
  },
  geographic: {
    countries: [
      { country: "US", count: 45234 },
      { country: "IN", count: 28341 },
      { country: "GB", count: 12456 },
      { country: "CA", count: 8732 },
      { country: "DE", count: 6543 },
      { country: "AU", count: 4321 },
      { country: "FR", count: 3892 },
      { country: "JP", count: 3241 },
      { country: "BR", count: 2891 },
      { country: "MX", count: 2134 },
      { country: "IT", count: 1876 },
      { country: "ES", count: 1654 },
      { country: "NL", count: 1432 },
      { country: "SE", count: 1287 },
      { country: "NO", count: 987 },
    ],
  },
  technical: {
    devices: [
      { device: "desktop", count: 78432 },
      { device: "mobile", count: 32145 },
      { device: "tablet", count: 12876 },
    ],
    browsers: [
      { browser: "chrome", count: 72341 },
      { browser: "safari", count: 23145 },
      { browser: "firefox", count: 12876 },
      { browser: "edge", count: 9876 },
      { browser: "opera", count: 3421 },
      { browser: "unknown", count: 189 },
    ],
    os: [
      { os: "windows", count: 52432 },
      { os: "macos", count: 31245 },
      { os: "linux", count: 18765 },
      { os: "android", count: 16543 },
      { os: "ios", count: 12321 },
      { os: "unknown", count: 1541 },
    ],
  },
  traffic: {
    referrers: [
      { referrer: "google.com", count: 34218 },
      { referrer: "direct", count: 21345 },
      { referrer: "github.com", count: 18765 },
      { referrer: "twitter.com", count: 9876 },
      { referrer: "linkedin.com", count: 6543 },
      { referrer: "reddit.com", count: 4321 },
      { referrer: "producthunt.com", count: 2987 },
      { referrer: "dev.to", count: 2134 },
      { referrer: "medium.com", count: 1876 },
      { referrer: "youtube.com", count: 1432 },
    ],
    hourly: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: Math.floor(Math.random() * 8000) + 2000 + Math.sin(i / 24 * Math.PI * 2) * 3000,
    })),
  },
  eventsByType: [
    { type: "page_view", count: 89432 },
    { type: "log_create", count: 1247 },
    { type: "tool_view", count: 34218 },
    { type: "search", count: 15234 },
    { type: "reaction", count: 8765 },
    { type: "comment_create", count: 4321 },
    { type: "project_create", count: 456 },
    { type: "follow", count: 3421 },
    { type: "list_create", count: 189 },
    { type: "page_view_end", count: 76543 },
    { type: "feature_usage", count: 1234 },
    { type: "engagement", count: 987 },
  ],
  eventsByDay: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 5000) + 2000,
    };
  }),
  topPages: [
    { path: "/", count: 23456 },
    { path: "/home", count: 18765 },
    { path: "/discover", count: 15234 },
    { path: "/tools/react", count: 9876 },
    { path: "/tools/nextjs", count: 8765 },
    { path: "/tools/typescript", count: 7654 },
    { path: "/logs/123", count: 6543 },
    { path: "/profile/johndoe", count: 5432 },
    { path: "/projects", count: 4321 },
    { path: "/lists", count: 3214 },
  ],
  topUsers: Array.from({ length: 10 }, (_, i) => ({
    user: {
      id: `user-${i + 1}`,
      username: `developer${i + 1}`,
      displayName: `Developer ${i + 1}`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=developer${i + 1}`,
    },
    count: Math.floor(Math.random() * 5000) + 1000,
  })),
};

export default function AdminDemoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icon icon="mdi:chart-line" width={32} height={32} className="text-[var(--primary)]" />
              <div>
                <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
                <p className="text-xs text-[var(--text-muted)]">Demo Mode • Mock Data</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--bg)] transition text-sm font-medium text-[var(--text)]"
              >
                View Real Data
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Selector */}
        <div className="mb-8 flex items-center gap-2">
          <span className="text-sm text-[var(--text-muted)] font-medium">Time Period:</span>
          {["7d", "30d", "90d", "all"].map((p) => (
            <button
              key={p}
              disabled
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                p === "30d"
                  ? "bg-[var(--primary)] text-black"
                  : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] opacity-60"
              }`}
            >
              {p === "all" ? "All Time" : p}
            </button>
          ))}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Total Events"
            value={mockData.overview.totalEvents.toLocaleString()}
            icon="mdi:chart-bar"
            trend={{ value: "+12.5%", positive: true }}
            color="primary"
          />
          <StatCard
            title="Page Views"
            value={mockData.overview.pageViews.toLocaleString()}
            icon="mdi:eye"
            trend={{ value: "+8.2%", positive: true }}
            color="blue"
          />
          <StatCard
            title="Unique Users"
            value={mockData.overview.uniqueUsers.toLocaleString()}
            icon="mdi:account-group"
            trend={{ value: "+15.3%", positive: true }}
            color="green"
          />
          <StatCard
            title="Active Users"
            value={mockData.overview.activeUsers.toLocaleString()}
            icon="mdi:account-check"
            trend={{ value: "+22.1%", positive: true }}
            color="purple"
          />
          <StatCard
            title="New Users"
            value={mockData.overview.newUsers.toLocaleString()}
            icon="mdi:account-plus"
            trend={{ value: "+5.7%", positive: true }}
            color="orange"
          />
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <EngagementCard
            title="Average Session Duration"
            value={formatDuration(mockData.engagement.avgSessionDuration)}
            icon="mdi:timer"
            color="purple"
          />
          <EngagementCard
            title="Average Time on Page"
            value={`${mockData.engagement.avgTimeOnPage}s`}
            icon="mdi:clock-outline"
            color="blue"
          />
          <EngagementCard
            title="Events per Session"
            value={mockData.engagement.avgEventsPerSession.toFixed(1)}
            icon="mdi:chart-timeline"
            color="green"
          />
        </div>

        {/* Main Chart - Events Over Time */}
        <div className="mb-8">
          <ChartCard title="Events Over Time" description="Daily event distribution over the last 30 days">
            <div className="h-96">
              <LineChartWithLabels data={mockData.eventsByDay} />
            </div>
          </ChartCard>
        </div>

        {/* Content Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <ContentStatCard
            title="Logs"
            value={mockData.content.totalLogs.toLocaleString()}
            icon="mdi:file-document"
            color="blue"
          />
          <ContentStatCard
            title="Projects"
            value={mockData.content.totalProjects.toLocaleString()}
            icon="mdi:folder"
            color="green"
          />
          <ContentStatCard
            title="Tools"
            value={mockData.content.totalTools.toLocaleString()}
            icon="mdi:toolbox"
            color="purple"
          />
          <ContentStatCard
            title="Lists"
            value={mockData.content.totalLists.toLocaleString()}
            icon="mdi:format-list-bulleted"
            color="orange"
          />
          <ContentStatCard
            title="Follows"
            value={mockData.content.totalFollows.toLocaleString()}
            icon="mdi:account-plus"
            color="pink"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Events by Type */}
          <ChartCard title="Events by Type" description="Breakdown of all tracked events">
            <div className="h-96">
              <EventsByTypeChart data={mockData.eventsByType} />
            </div>
          </ChartCard>

          {/* Hourly Distribution */}
          <ChartCard title="Traffic by Hour (UTC)" description="24-hour activity pattern">
            <div className="h-96">
              <HourlyChart data={mockData.traffic.hourly} />
            </div>
          </ChartCard>
        </div>

        {/* Geographic & Technical */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Country Distribution */}
          <ChartCard title="Users by Country" description="Geographic distribution">
            <div className="h-[500px] overflow-y-auto custom-scrollbar">
              <CountryChart data={mockData.geographic.countries} />
            </div>
          </ChartCard>

          {/* Device Distribution */}
          <ChartCard title="Device Types" description="Desktop, mobile, and tablet usage">
            <div className="h-[500px]">
              <DeviceChart data={mockData.technical.devices} />
            </div>
          </ChartCard>
        </div>

        {/* Browser & OS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Browser Distribution */}
          <ChartCard title="Browser Distribution" description="Popular browsers among users">
            <div className="h-[500px] overflow-y-auto custom-scrollbar">
              <BrowserChart data={mockData.technical.browsers} />
            </div>
          </ChartCard>

          {/* OS Distribution */}
          <ChartCard title="Operating Systems" description="Platform distribution">
            <div className="h-[500px] overflow-y-auto custom-scrollbar">
              <OSChart data={mockData.technical.os} />
            </div>
          </ChartCard>
        </div>

        {/* Traffic Sources */}
        <div className="mb-8">
          <ChartCard title="Traffic Sources" description="Top referrers driving traffic">
            <div className="h-[500px] overflow-y-auto custom-scrollbar">
              <ReferrerChart data={mockData.traffic.referrers} />
            </div>
          </ChartCard>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <TableCard title="Top Pages" description="Most visited pages">
            <div className="space-y-2">
              {mockData.topPages.map((page, idx) => (
                <div key={page.path} className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg)] hover:bg-[var(--surface)] transition border border-[var(--border)]">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                      idx === 0 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                      idx === 1 ? "bg-gray-400/20 text-gray-300 border border-gray-400/30" :
                      idx === 2 ? "bg-amber-600/20 text-amber-400 border border-amber-600/30" :
                      "bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]"
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{page.path || "/"}</div>
                      <div className="text-xs text-[var(--text-muted)]">{page.count.toLocaleString()} views</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TableCard>

          {/* Top Users */}
          <TableCard title="Top Active Users" description="Most engaged users">
            <div className="space-y-2">
              {mockData.topUsers.map((item, idx) => (
                <div
                  key={item.user.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg)] hover:bg-[var(--surface)] transition border border-[var(--border)]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                      idx === 0 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                      idx === 1 ? "bg-gray-400/20 text-gray-300 border border-gray-400/30" :
                      idx === 2 ? "bg-amber-600/20 text-amber-400 border border-amber-600/30" :
                      "bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]"
                    }`}>
                      {idx + 1}
                    </div>
                    {item.user.avatarUrl && (
                      <img src={item.user.avatarUrl} alt={item.user.username} className="w-10 h-10 rounded-full" />
                    )}
                    <div>
                      <div className="text-sm font-semibold text-white">{item.user.displayName}</div>
                      <div className="text-xs text-[var(--text-muted)]">@{item.user.username}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text-muted)]">{item.count.toLocaleString()}</span>
                    <span className="text-xs text-[var(--text-muted)]">events</span>
                  </div>
                </div>
              ))}
            </div>
          </TableCard>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--bg);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }
      `}</style>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color = "primary" }: { title: string; value: string | number; icon: string; trend?: { value: string; positive: boolean }; color?: string }) {
  const colorClasses: Record<string, string> = {
    primary: "bg-[var(--primary)]/10 text-[var(--primary)]",
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-green-500/10 text-green-400",
    purple: "bg-purple-500/10 text-purple-400",
    orange: "bg-orange-500/10 text-orange-400",
    pink: "bg-pink-500/10 text-pink-400",
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--primary)]/30 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color] || colorClasses.primary} flex items-center justify-center`}>
          <Icon icon={icon} width={24} height={24} />
        </div>
        {trend && (
          <div className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
            trend.positive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}>
            <Icon icon={trend.positive ? "mdi:trending-up" : "mdi:trending-down"} width={12} />
            {trend.value}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-[var(--text-muted)]">{title}</div>
    </div>
  );
}

function EngagementCard({ title, value, icon, color = "primary" }: { title: string; value: string | number; icon: string; color?: string }) {
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
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color] || colorClasses.primary} flex items-center justify-center`}>
          <Icon icon={icon} width={24} height={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
      </div>
      <div className="text-4xl font-bold text-white">{value}</div>
    </div>
  );
}

function ContentStatCard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-green-500/10 text-green-400",
    purple: "bg-purple-500/10 text-purple-400",
    orange: "bg-orange-500/10 text-orange-400",
    pink: "bg-pink-500/10 text-pink-400",
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--primary)]/30 transition-all">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon icon={icon} width={24} height={24} />
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-[var(--text-muted)]">{title}</div>
    </div>
  );
}

function ChartCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        {description && <p className="text-sm text-[var(--text-muted)]">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function TableCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        {description && <p className="text-sm text-[var(--text-muted)]">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function LineChartWithLabels({ data }: { data: Array<{ date: string; count: number }> }) {
  // Transform data for recharts
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    fullDate: item.date,
    events: item.count,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-white mb-1">
            {new Date(payload[0].payload.fullDate).toLocaleDateString("en-US", { 
              month: "long", 
              day: "numeric",
              year: "numeric"
            })}
          </p>
          <p className="text-xs text-[var(--primary)]">
            Events: <span className="font-bold">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey="date" 
          stroke="var(--text-muted)"
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
          interval={Math.floor(data.length / 5)}
        />
        <YAxis 
          stroke="var(--text-muted)"
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          label={{ value: "Events", angle: -90, position: "insideLeft", fill: "var(--text-muted)", fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="events"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#areaGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function EventsByTypeChart({ data }: { data: Array<{ type: string; count: number }> }) {
  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 8);
  const chartData = sorted.map((item) => ({
    name: item.type.replace(/_/g, " "),
    value: item.count,
  }));

  const colors = ["#3b82f6", "#a855f7", "#10b981", "#f59e0b", "#ec4899", "#06b6d4", "#eab308", "#6366f1"];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-white mb-1">{payload[0].name}</p>
          <p className="text-xs text-[var(--primary)]">
            Events: <span className="font-bold">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={true} vertical={false} />
        <XAxis type="number" stroke="var(--text-muted)" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="name"
          stroke="var(--text-muted)"
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          width={90}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function HourlyChart({ data }: { data: Array<{ hour: number; count: number }> }) {
  // Transform data for recharts
  const chartData = data.map((item) => ({
    hour: `${item.hour}:00`,
    hourNum: item.hour,
    events: item.count,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-white mb-1">
            {payload[0].payload.hourNum}:00 UTC
          </p>
          <p className="text-xs text-[var(--primary)]">
            Events: <span className="font-bold">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey="hour"
          stroke="var(--text-muted)"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          angle={-45}
          textAnchor="end"
          height={60}
          interval={3}
        />
        <YAxis 
          stroke="var(--text-muted)"
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          label={{ value: "Events", angle: -90, position: "insideLeft", fill: "var(--text-muted)", fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="events" 
          fill="var(--primary)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CountryChart({ data }: { data: Array<{ country: string; count: number }> }) {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const chartData = sorted.map((item) => ({
    country: item.country,
    users: item.count,
  }));

  const total = data.reduce((sum, d) => sum + d.count, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-white mb-1">{payload[0].payload.country}</p>
          <p className="text-xs text-blue-400">
            Users: <span className="font-bold">{payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={true} vertical={false} />
        <XAxis type="number" stroke="var(--text-muted)" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="country"
          stroke="var(--text-muted)"
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="users" fill="#3b82f6" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function DeviceChart({ data }: { data: Array<{ device: string; count: number }> }) {
  const chartData = data.map((item) => ({
    name: item.device.charAt(0).toUpperCase() + item.device.slice(1),
    value: item.count,
  }));

  const total = data.reduce((sum, d) => sum + d.count, 0);
  const colors = ["#10b981", "#3b82f6", "#f59e0b"];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-white mb-1">{payload[0].name}</p>
          <p className="text-xs text-green-400">
            Users: <span className="font-bold">{payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={60}
          formatter={(value) => (
            <span style={{ color: "var(--text-muted)" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function BrowserChart({ data }: { data: Array<{ browser: string; count: number }> }) {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const chartData = sorted.map((item) => ({
    name: item.browser.charAt(0).toUpperCase() + item.browser.slice(1),
    value: item.count,
  }));

  const total = data.reduce((sum, d) => sum + d.count, 0);

  const browserColors: Record<string, string> = {
    Chrome: "#3b82f6",
    Safari: "#2563eb",
    Firefox: "#f59e0b",
    Edge: "#1e40af",
    Opera: "#ef4444",
    Unknown: "var(--text-muted)",
  };

  const colors = chartData.map((item) => browserColors[item.name] || "#6b7280");

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-white mb-1">{payload[0].name}</p>
          <p className="text-xs text-blue-400">
            Users: <span className="font-bold">{payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    if (percent < 0.05) return null; // Don't show label for small slices
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {name}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={80}
          formatter={(value) => (
            <span style={{ color: "var(--text-muted)" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function OSChart({ data }: { data: Array<{ os: string; count: number }> }) {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const chartData = sorted.map((item) => ({
    name: item.os === "macos" ? "macOS" : item.os === "ios" ? "iOS" : item.os.charAt(0).toUpperCase() + item.os.slice(1),
    value: item.count,
  }));

  const total = data.reduce((sum, d) => sum + d.count, 0);

  const osColors: Record<string, string> = {
    Windows: "#3b82f6",
    macOS: "#9ca3af",
    Linux: "#f59e0b",
    Android: "#10b981",
    iOS: "#9ca3af",
    Unknown: "var(--text-muted)",
  };

  const colors = chartData.map((item) => osColors[item.name] || "#6b7280");

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-white mb-1">{payload[0].name}</p>
          <p className="text-xs text-orange-400">
            Users: <span className="font-bold">{payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    if (percent < 0.05) return null; // Don't show label for small slices
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {name}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={80}
          formatter={(value) => (
            <span style={{ color: "var(--text-muted)" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function ReferrerChart({ data }: { data: Array<{ referrer: string; count: number }> }) {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const chartData = sorted.map((item) => ({
    referrer: item.referrer === "direct" ? "Direct" : item.referrer.replace(/\.com$/, "").replace(/^www\./, ""),
    visits: item.count,
    original: item.referrer,
  }));

  const colors = ["#3b82f6", "#a855f7", "#10b981", "#f59e0b", "#ec4899", "#06b6d4", "#eab308", "#6366f1", "#8b5cf6", "#f43f5e"];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-white mb-1">{payload[0].payload.original}</p>
          <p className="text-xs text-purple-400">
            Visits: <span className="font-bold">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={true} vertical={false} />
        <XAxis type="number" stroke="var(--text-muted)" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="referrer"
          stroke="var(--text-muted)"
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          width={110}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="visits" radius={[0, 8, 8, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}
