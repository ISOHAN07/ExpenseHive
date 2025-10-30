"use client";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { TrendingUp, Wallet, Target, AlertCircle } from "lucide-react";
import { useExpenses } from "../../hooks/useExpenses";
import { useCategories } from "../../hooks/useCategories";
import { useMemo } from "react";

// Category colors
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A855F7",
  "#EC4899",
];

export default function Dashboard() {
  const { data: expenses = [], isLoading: loadingExpenses } = useExpenses();
  const { categories = [], isLoading: loadingCategories } = useCategories();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyData = useMemo(() => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const lastSix = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(currentYear, currentMonth - (5 - i), 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

    const totalsMap = new Map(
      lastSix.map(({ year, month }) => [`${year}-${month}`, 0])
    );

    expenses.forEach((e) => {
      const date = new Date(
        typeof e.expenseDate === "string" || typeof e.expenseDate === "number"
          ? e.expenseDate
          : (e.expenseDate as any)
      );
      if (!isNaN(date.getTime())) {
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (totalsMap.has(key)) {
          totalsMap.set(key, (totalsMap.get(key) || 0) + e.expenseAmount);
        }
      }
    });

    const totalBudget = categories.reduce((sum, c) => sum + (c.budget || 0), 0);

    return lastSix.map(({ year, month }) => ({
      month: `${monthNames[month]} ${year}`,
      expenses: +(totalsMap.get(`${year}-${month}`) || 0).toFixed(2),
      budget: +totalBudget.toFixed(2),
    }));
  }, [expenses, categories, currentMonth, currentYear]);

  const totalBudget = useMemo(
    () => categories.reduce((sum, c) => sum + (c.budget || 0), 0),
    [categories]
  );

  const totalExpenses = useMemo(() => {
    return expenses
      .filter((e) => {
        const date = new Date(e.expenseDate);
        return (
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        );
      })
      .reduce((sum, e) => sum + e.expenseAmount, 0);
  }, [expenses, currentMonth, currentYear]);

  const remaining = Math.max(totalBudget - totalExpenses, 0);
  const percentageUsed =
    totalBudget > 0 ? Math.min((totalExpenses / totalBudget) * 100, 100) : 0;

  const categoryData = useMemo(() => {
    if (!categories.length) return [];
    return categories.map((cat, index) => ({
      name: cat.name,
      value: cat.spent ?? 0,
      fill: COLORS[index % COLORS.length],
    }));
  }, [categories]);

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort(
        (a, b) =>
          new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime()
      )
      .slice(0, 5)
      .map((e) => ({
        id: e._id,
        category:
          typeof e.expenseCategory === "object"
            ? e.expenseCategory?.name
            : e.expenseCategory,
        amount: e.expenseAmount,
        date: new Date(e.expenseDate).toLocaleDateString(),
      }));
  }, [expenses]);

  if (loadingExpenses || loadingCategories) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your financial overview.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalExpenses.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Monthly total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${remaining.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {percentageUsed.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">Budget used</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Spending Trend</CardTitle>
            <CardDescription>
              Your expenses vs budget (last 6 months)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#1c69e3"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#1c69e3" }}
                  activeDot={{ r: 6 }}
                  name="Expenses"
                />
                <Line
                  type="monotone"
                  dataKey="budget"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#22c55e" }}
                  activeDot={{ r: 6 }}
                  name="Budget"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>This month's breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value}`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentExpenses.length ? (
              recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {expense.category || "Uncategorized"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {expense.date}
                    </p>
                  </div>
                  <p className="font-bold text-foreground">
                    ${expense.amount.toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No recent expenses found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
