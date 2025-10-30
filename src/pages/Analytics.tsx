"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useExpenses } from "../../hooks/useExpenses";
import { useCategories } from "../../hooks/useCategories";

export default function Analytics() {
  const { data: expenses = [], isLoading: loadingExpenses } = useExpenses();
  const { categories = [], isLoading: loadingCategories } = useCategories();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const d = new Date(e.expenseDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [expenses, currentMonth, currentYear]);

  const analytics = useMemo(() => {
    if (monthlyExpenses.length === 0) {
      return {
        avgDailySpending: 0,
        highestSpendingDay: "N/A",
        mostSpentCategory: "N/A",
        budgetEfficiency: 0,
      };
    }

    const total = monthlyExpenses.reduce((sum, e) => sum + e.expenseAmount, 0);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const avgDaily = total / daysInMonth;

    const dayTotals: Record<string, number> = {};
    monthlyExpenses.forEach((e) => {
      const day = new Date(e.expenseDate).toLocaleDateString("en-US", { weekday: "long" });
      dayTotals[day] = (dayTotals[day] || 0) + e.expenseAmount;
    });
    const highestDay = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const catTotals: Record<string, number> = {};
    monthlyExpenses.forEach((e) => {
      const cat =
        typeof e.expenseCategory === "object"
          ? e.expenseCategory?.name
          : e.expenseCategory;
      if (cat) catTotals[cat] = (catTotals[cat] || 0) + e.expenseAmount;
    });
    const topCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const totalBudget = categories.reduce((sum, c) => sum + (c.budget || 0), 0);
    const efficiency = totalBudget > 0 ? Math.min((total / totalBudget) * 100, 100) : 0;

    return {
      avgDailySpending: avgDaily,
      highestSpendingDay: highestDay,
      mostSpentCategory: topCategory,
      budgetEfficiency: efficiency,
    };
  }, [monthlyExpenses, categories, currentMonth, currentYear]);


  const insights = [
    {
      title: "Average Daily Spending",
      value: `$${analytics.avgDailySpending.toFixed(2)}`,
      trend: "up",
      change: "+12%",
    },
    {
      title: "Highest Spending Day",
      value: analytics.highestSpendingDay,
      trend: "up",
      change: "+25%",
    },
    {
      title: "Most Spent Category",
      value: analytics.mostSpentCategory,
      trend: "down",
      change: "-8%",
    },
    {
      title: "Budget Efficiency",
      value: `${analytics.budgetEfficiency.toFixed(0)}%`,
      trend: "up",
      change: "+5%",
    },
  ];

  if (loadingExpenses || loadingCategories) return <p>Loading analytics...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">
          Deep insights into your spending habits
        </p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
              {insight.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insight.value}</div>
              <p
                className={`text-xs ${
                  insight.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {insight.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pattern Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Patterns</CardTitle>
          <CardDescription>
            Key insights about your financial behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-semibold text-foreground">Peak Spending Day</p>
            <p className="text-sm text-muted-foreground">
              You spend the most on <strong>{analytics.highestSpendingDay}</strong>.
            </p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="font-semibold text-foreground">Top Category</p>
            <p className="text-sm text-muted-foreground">
              Most of your spending is in{" "}
              <strong>{analytics.mostSpentCategory}</strong>.
            </p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="font-semibold text-foreground">Budget Usage</p>
            <p className="text-sm text-muted-foreground">
              You've used about{" "}
              <strong>{analytics.budgetEfficiency.toFixed(0)}%</strong> of your
              total budget this month.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
