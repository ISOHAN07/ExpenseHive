"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Download } from "lucide-react"

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("month")

  // Sample data for charts
  const categoryData = [
    { name: "Food", value: 350, percentage: 35 },
    { name: "Transportation", value: 280, percentage: 28 },
    { name: "Entertainment", value: 120, percentage: 12 },
    { name: "Utilities", value: 150, percentage: 15 },
    { name: "Healthcare", value: 100, percentage: 10 },
  ]

  const monthlyData = [
    { month: "Jan", expenses: 800, budget: 1000 },
    { month: "Feb", expenses: 920, budget: 1000 },
    { month: "Mar", expenses: 750, budget: 1000 },
    { month: "Apr", expenses: 1050, budget: 1000 },
    { month: "May", expenses: 890, budget: 1000 },
    { month: "Jun", expenses: 950, budget: 1000 },
  ]

  const weeklyData = [
    { week: "Week 1", expenses: 180 },
    { week: "Week 2", expenses: 220 },
    { week: "Week 3", expenses: 195 },
    { week: "Week 4", expenses: 210 },
  ]

  const COLORS = ["#8b5cf6", "#f97316", "#06b6d4", "#10b981", "#ef4444"]

  const totalExpenses = categoryData.reduce((sum, item) => sum + item.value, 0)
  const averageExpense = Math.round(totalExpenses / categoryData.length)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="mt-2 text-muted-foreground">Analyze your spending patterns and trends</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8 flex gap-2">
          {["week", "month", "year"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              {range}
            </Button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">${totalExpenses.toFixed(2)}</p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">-5% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">${averageExpense.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">Per category</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Highest Category</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">Food</p>
              <p className="text-xs text-muted-foreground mt-1">$350 (35%)</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Budget Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600 dark:text-green-500">On Track</p>
              <p className="text-xs text-muted-foreground mt-1">95% of budget used</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          {/* Pie Chart */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Monthly Expenses vs Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={(value) => `$${value}`}
                  />
                  <Legend />
                  <Bar dataKey="expenses" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="budget" fill="var(--secondary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Line Chart */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Weekly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value) => `$${value}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--primary)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown Table */}
        <Card className="border-border/50 mt-8">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between pb-4 border-b border-border/50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[categoryData.indexOf(category)] }}
                    />
                    <span className="font-medium text-foreground">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${category.value.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{category.percentage}% of total</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
