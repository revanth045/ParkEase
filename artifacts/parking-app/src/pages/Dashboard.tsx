import React from "react";
import { useGetDashboardStats, useGetOccupancyStats, useGetRevenueStats, useGetRecentActivity } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Car, DollarSign, Users, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: occupancy, isLoading: occLoading } = useGetOccupancyStats();
  const { data: revenue, isLoading: revLoading } = useGetRevenueStats();
  const { data: activity, isLoading: actLoading } = useGetRecentActivity();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your parking facility metrics.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Spots" 
            value={stats?.totalSpots} 
            subtitle={`${stats?.availableSpots || 0} available`}
            icon={Car} 
            loading={statsLoading} 
          />
          <StatCard 
            title="Occupancy Rate" 
            value={stats ? `${(stats.occupancyRate * 100).toFixed(1)}%` : undefined} 
            subtitle={`${stats?.occupiedSpots || 0} currently occupied`}
            icon={Activity} 
            loading={statsLoading} 
          />
          <StatCard 
            title="Active Subscriptions" 
            value={stats?.activeSubscriptions} 
            subtitle={stats ? `${stats.subscriptionGrowth > 0 ? '+' : ''}${stats.subscriptionGrowth}% from last month` : undefined}
            icon={Users} 
            loading={statsLoading} 
          />
          <StatCard 
            title="Monthly Revenue" 
            value={stats ? `$${stats.monthlyRevenue.toLocaleString()}` : undefined} 
            subtitle={stats ? `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}% from last month` : undefined}
            icon={DollarSign} 
            loading={statsLoading}
            valueColor="text-accent"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Revenue Chart */}
          <Card className="lg:col-span-4 bg-card border-border">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-0">
              {revLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
                        itemStyle={{ color: "hsl(var(--accent))" }}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Occupancy Chart */}
          <Card className="lg:col-span-3 bg-card border-border">
            <CardHeader>
              <CardTitle>Zone Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              {occLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={occupancy} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis dataKey="zone" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
                      />
                      <Bar dataKey="occupancyRate" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Occupancy (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {actLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : !activity || activity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No recent activity</div>
            ) : (
              <div className="space-y-4">
                {activity.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.description}</span>
                      <span className="text-sm text-muted-foreground">{item.customerName} {item.spotNumber ? `• Spot ${item.spotNumber}` : ''}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</span>
                      {item.amount && <span className="text-accent font-medium">${item.amount.toFixed(2)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, loading, valueColor = "text-foreground" }: any) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24 mb-2" />
        ) : (
          <div className={`text-2xl font-bold ${valueColor}`}>{value ?? '-'}</div>
        )}
        {loading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
