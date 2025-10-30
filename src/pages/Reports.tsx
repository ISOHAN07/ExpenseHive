"use client";

import { useMemo } from "react";
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
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useExpenses } from "../../hooks/useExpenses";
import { useCategories } from "../../hooks/useCategories";
import type { ExpenseDTO, Category } from "../types/index";

const FALLBACK_COLORS = [
  "#1C69E3",
  "#FF6B6B",
  "#00C49F",
  "#FFBB28",
  "#8054AB",
  "#FF8042",
  "#6C5CE7",
  "#F06595",
  "#74C0FC",
  "#FCC419",
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

function safeDate(value: string | Date | undefined | null): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isFinite(d.getTime()) ? d : null;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

function monthLabelFromKey(key: string) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, (m || 1) - 1, 1);
  return d.toLocaleString(undefined, { month: "short", year: "numeric" });
}

function lastNMonthKeys(n: number) {
  const now = new Date();
  const keys: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(monthKey(d));
  }
  return keys;
}

export default function Reports() {
  const { data: expenses = [], isLoading: loadingExpenses } = useExpenses();
  const { categories = [], isLoading: loadingCategories } = useCategories();

  const loading = loadingExpenses || loadingCategories;

  const { monthlyData, weeklyData, categoryData } = useMemo(() => {
    const allExpenses: ExpenseDTO[] = Array.isArray(expenses) ? expenses : [];
    const cats: Category[] = Array.isArray(categories) ? categories : [];

    // ---------- MONTHLY DATA (last 6 months) ----------
    const last6Keys = lastNMonthKeys(6);
    const monthlyMap = new Map<string, number>();
    for (const k of last6Keys) monthlyMap.set(k, 0);

    for (const ex of allExpenses) {
      const d = safeDate(ex.expenseDate);
      if (!d) continue;
      const key = monthKey(d);
      if (monthlyMap.has(key)) {
        monthlyMap.set(
          key,
          (monthlyMap.get(key) || 0) + (Number(ex.expenseAmount) || 0)
        );
      }
    }

    const monthlyData = last6Keys.map((k) => ({
      month: monthLabelFromKey(k),
      expenses: +(monthlyMap.get(k) || 0),
    }));

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const firstOfMonth = new Date(currentYear, currentMonth, 1);
    const firstCalendarDay = new Date(firstOfMonth);
    firstCalendarDay.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

    const lastOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const lastCalendarDay = new Date(lastOfMonth);
    lastCalendarDay.setDate(lastOfMonth.getDate() + (6 - lastOfMonth.getDay())); 

    const weekRanges: { start: Date; end: Date }[] = [];
    let start = new Date(firstCalendarDay);
    while (start <= lastCalendarDay) {
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      weekRanges.push({ start: new Date(start), end });
      start.setDate(start.getDate() + 7);
    }
    const weekTotals = weekRanges.map((range) => {
      const total = allExpenses.reduce((sum, ex) => {
        const d = safeDate(ex.expenseDate);
        if (!d) return sum;
        if (d >= range.start && d <= range.end) {
          return sum + (Number(ex.expenseAmount) || 0);
        }
        return sum;
      }, 0);
      return total;
    });

    const weeklyData = weekRanges.map((_, i) => ({
      week: `Week ${i + 1}`,
      expenses: +(weekTotals[i] || 0),
    }));

    // ---------- CATEGORY DATA ----------
    const categoryTotals = new Map<
      string,
      { name: string; color?: string; value: number }
    >();
    cats.forEach((c) => {
      categoryTotals.set(String(c._id), {
        name: c.name,
        color: c.color,
        value: 0,
      });
    });

    for (const ex of allExpenses) {
      const amt = Number(ex.expenseAmount) || 0;
      let catId = "";
      let name = "Uncategorized";
      let color: string | undefined;

      const catField = ex.expenseCategory;
      if (typeof catField === "string") {
        catId = catField;
        const found = cats.find((c) => String(c._id) === catField);
        if (found) {
          name = found.name;
          color = found.color;
        }
      } else if (catField && typeof catField === "object") {
        catId = String((catField as any)._id ?? "uncategorized");
        name = (catField as any).name ?? "Uncategorized";
        color = (catField as any).color;
      }

      if (!categoryTotals.has(catId)) {
        categoryTotals.set(catId, { name, color, value: amt });
      } else {
        const cur = categoryTotals.get(catId)!;
        cur.value += amt;
      }
    }

    // Assign distinct colors
    const categoryData = Array.from(categoryTotals.entries()).map(
      ([id, c], idx) => ({
        _id: id,
        name: c.name,
        value: Math.max(0, c.value),
        color: c.color || FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
      })
    );

    categoryData.sort((a, b) => b.value - a.value);

    return { monthlyData, weeklyData, categoryData };
  }, [expenses, categories]);

  const currencyFormatter = (v: any) => formatCurrency(Number(v || 0));
  const tooltipFormatter = (v: any) => [currencyFormatter(v), "Amount"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground">Analyze your spending patterns</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
        </TabsList>

        {/* Monthly Overview */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expenses</CardTitle>
              <CardDescription>
                Your spending over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading chart...</p>
              ) : monthlyData.every((m) => m.expenses === 0) ? (
                <p className="text-muted-foreground">
                  No expense data for the last 6 months.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      tickFormatter={(v) =>
                        v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                      }
                    />
                    <Tooltip formatter={tooltipFormatter} />
                    <Bar dataKey="expenses" fill="#1c69e3" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category Distribution */}
        <TabsContent value="category" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Distribution of your spending</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading chart...</p>
              ) : categoryData.length === 0 ? (
                <p className="text-muted-foreground">
                  No categories or expenses yet.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) =>
                        `${name}: ${formatCurrency(Number(value))}`
                      }
                      outerRadius={90}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={tooltipFormatter} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weekly Spending */}
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Spending</CardTitle>
              <CardDescription>Your expenses by ISO week</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading chart...</p>
              ) : weeklyData.every((w) => w.expenses === 0) ? (
                <p className="text-muted-foreground">
                  No expense data for recent weeks.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip formatter={tooltipFormatter} />
                    <Bar dataKey="expenses" fill="#1c69e3" barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
