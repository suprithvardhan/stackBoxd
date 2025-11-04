"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { isAdminAuthenticated, logoutAdmin } from "@/lib/admin-auth";
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
      const token = localStorage.getItem("admin_session_token");
      const response = await fetch(`/api/admin/analytics?period=${period}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      } else if (response.status === 401) {
        // Session expired, redirect to login
        logoutAdmin();
        router.push("/admin/login");
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

        {/* Main Chart - Events Over Time */}
        <div className="mb-8">
          <ChartCard title="Events Over Time" description="Daily event distribution over the selected period">
            <div className="h-96">
              <LineChartWithLabels data={data.eventsByDay} />
            </div>
          </ChartCard>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Events by Type */}
          <ChartCard title="Events by Type" description="Breakdown of all tracked events">
            <div className="h-96">
              <EventsByTypeChart data={data.eventsByType} />
            </div>
          </ChartCard>

          {/* Hourly Distribution */}
          <ChartCard title="Traffic by Hour (UTC)" description="24-hour activity pattern">
            <div className="h-96">
              <HourlyChart data={data.traffic.hourly} />
            </div>
          </ChartCard>
        </div>

        {/* Geographic & Technical */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Country Distribution */}
          <ChartCard title="Users by Country" description="Geographic distribution">
            <div className="h-[500px] overflow-y-auto custom-scrollbar">
              <CountryChart data={data.geographic.countries} />
            </div>
          </ChartCard>

          {/* Device Distribution */}
          <ChartCard title="Device Types" description="Desktop, mobile, and tablet usage">
            <div className="h-[500px]">
              <DeviceChart data={data.technical.devices} />
            </div>
          </ChartCard>
        </div>

        {/* Browser & OS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Browser Distribution */}
          <ChartCard title="Browser Distribution" description="Popular browsers among users">
            <div className="h-[500px] overflow-y-auto custom-scrollbar">
              <BrowserChart data={data.technical.browsers} />
            </div>
          </ChartCard>

          {/* OS Distribution */}
          <ChartCard title="Operating Systems" description="Platform distribution">
            <div className="h-[500px] overflow-y-auto custom-scrollbar">
              <OSChart data={data.technical.os} />
            </div>
          </ChartCard>
        </div>

        {/* Traffic Sources */}
        <div className="mb-8">
          <ChartCard title="Traffic Sources" description="Top referrers driving traffic">
            <div className="h-[500px] overflow-y-auto custom-scrollbar">
              <ReferrerChart data={data.traffic.referrers} />
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

function TableCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
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

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}
