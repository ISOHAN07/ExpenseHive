"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Target, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const monthlyData = [
    { month: "Jan", expenses: 800 },
    { month: "Feb", expenses: 920 },
    { month: "Mar", expenses: 750 },
    { month: "Apr", expenses: 1050 },
    { month: "May", expenses: 890 },
    { month: "Jun", expenses: 950 },
  ]

  const categoryData = [
    { name: "Food", value: 350 },
    { name: "Transportation", value: 280 },
    { name: "Entertainment", value: 120 },
    { name: "Utilities", value: 150 },
    { name: "Healthcare", value: 100 },
  ]

  const COLORS = ["#8b5cf6", "#f97316", "#06b6d4", "#10b981", "#ef4444"]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, John!</h1>
        <p className="mt-2 text-muted-foreground">Here's your financial overview for this month</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Total Expenses
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">$1,450</p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-1">-5% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Budget Remaining
              <Target className="h-4 w-4 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">$550</p>
            <p className="text-xs text-muted-foreground mt-1">Of $2,000 budget</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Highest Category
              <TrendingDown className="h-4 w-4 text-orange-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">Food</p>
            <p className="text-xs text-muted-foreground mt-1">$350 spent</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Budget Status
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600 dark:text-green-500">On Track</p>
            <p className="text-xs text-muted-foreground mt-1">72.5% used</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
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
                <Bar dataKey="expenses" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
                  label={({ name, value }) => `${name} $${value}`}
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
      </div>

      {/* Recent Expenses */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { description: "Grocery Shopping", amount: 45.99, category: "Food", date: "Today" },
              { description: "Gas", amount: 52.5, category: "Transportation", date: "Yesterday" },
              { description: "Netflix Subscription", amount: 15.99, category: "Entertainment", date: "2 days ago" },
            ].map((expense, index) => (
              <div
                key={index}
                className="flex items-center justify-between pb-4 border-b border-border/50 last:border-0"
              >
                <div>
                  <p className="font-medium text-foreground">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">{expense.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${expense.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{expense.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
