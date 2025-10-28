"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Target, AlertCircle } from "lucide-react"

export default function AnalyticsPage() {
  const spendingTrend = [
    { date: "Oct 1", amount: 45 },
    { date: "Oct 5", amount: 120 },
    { date: "Oct 10", amount: 95 },
    { date: "Oct 15", amount: 180 },
    { date: "Oct 20", amount: 150 },
    { date: "Oct 25", amount: 200 },
    { date: "Oct 28", amount: 175 },
  ]

  const insights = [
    {
      title: "Highest Spending Day",
      value: "October 25",
      description: "$200 spent",
      icon: TrendingUp,
      color: "text-red-500",
    },
    {
      title: "Average Daily Spend",
      value: "$145.71",
      description: "This month",
      icon: Target,
      color: "text-blue-500",
    },
    {
      title: "Lowest Spending Day",
      value: "October 1",
      description: "$45 spent",
      icon: TrendingDown,
      color: "text-green-500",
    },
    {
      title: "Budget Alert",
      value: "95% Used",
      description: "Only $50 remaining",
      icon: AlertCircle,
      color: "text-yellow-500",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="mt-2 text-muted-foreground">Deep dive into your spending insights</p>
        </div>

        {/* Insights Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {insights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <Card key={index} className="border-border/50 hover:border-border/80 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{insight.title}</CardTitle>
                    <Icon className={`h-4 w-4 ${insight.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">{insight.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Spending Trend */}
        <Card className="border-border/50 mb-8">
          <CardHeader>
            <CardTitle>Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={spendingTrend}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value) => `$${value}`}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--primary)"
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Monthly Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <span className="text-muted-foreground">Total Transactions</span>
                <span className="font-semibold text-foreground">47</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <span className="text-muted-foreground">Average Transaction</span>
                <span className="font-semibold text-foreground">$31.06</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <span className="text-muted-foreground">Largest Transaction</span>
                <span className="font-semibold text-foreground">$200.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Smallest Transaction</span>
                <span className="font-semibold text-foreground">$5.50</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Spending Patterns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <span className="text-muted-foreground">Most Active Day</span>
                <span className="font-semibold text-foreground">Friday</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <span className="text-muted-foreground">Peak Spending Hour</span>
                <span className="font-semibold text-foreground">6:00 PM</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <span className="text-muted-foreground">Most Used Category</span>
                <span className="font-semibold text-foreground">Food</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Budget Compliance</span>
                <span className="font-semibold text-green-600 dark:text-green-500">95%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
