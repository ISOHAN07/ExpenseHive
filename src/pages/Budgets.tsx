"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { useCategories } from "../../hooks/useCategories";

type CategoryType = {
  _id: string;
  name: string;
  color: string;
  budget: number;
  spent?: number;
};

export default function Budgets() {
  const { categories = [], isLoading } = useCategories();

  // derive overall totals and per-category safe values
  const { overall } = useMemo(() => {
    let totalBudget = 0;
    let totalSpent = 0;

    const cleanCats: CategoryType[] = (categories || []).map((c: any) => {
      const budget = typeof c.budget === "number" && !isNaN(c.budget) ? c.budget : 0;
      const spent = typeof c.spent === "number" && !isNaN(c.spent) ? c.spent : 0;
      totalBudget += budget;
      totalSpent += spent;
      return {
        _id: c._id,
        name: c.name,
        color: c.color ?? "#1c69e3",
        budget,
        spent,
      };
    });

    return {
      overall: {
        categories: cleanCats,
        totalBudget,
        totalSpent,
      },
    };
  }, [categories]);

  if (isLoading) {
    // preserve design: simple loading text or spinner
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Budgets</h1>
          <p className="text-muted-foreground">Track your spending against budgets</p>
        </div>

        <div className="flex items-center justify-center py-8">
          {/* If you have a Spinner component use it; else simple text */}
          {/* <Spinner /> */}
          <p className="text-muted-foreground">Loading budgets…</p>
        </div>
      </div>
    );
  }

  const overallPercentage = overall.totalBudget > 0 ? (overall.totalSpent / overall.totalBudget) * 100 : 0;
  const overallRemaining = overall.totalBudget - overall.totalSpent;

  const clamp = (v: number) => {
    if (!isFinite(v) || isNaN(v)) return 0;
    return Math.min(Math.max(v, 0), 100);
  };

  const statusFor = (percentage: number, spent: number, total: number) => {
    if (total <= 0) return { label: "No budget", className: "text-muted-foreground" };
    if (spent > total) return { label: "Over budget!", className: "text-destructive" };
    if (percentage > 90) return { label: "Danger", className: "text-destructive" };
    if (percentage > 70) return { label: "Caution", className: "text-yellow-600" };
    return { label: "On track", className: "text-green-600" };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Budgets</h1>
        <p className="text-muted-foreground">Track your spending against budgets</p>
      </div>

      {/* Overall Budget Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Overall Budget</CardTitle>
              <CardDescription>All categories combined</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                ${overallRemaining.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">Remaining</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Spent: ${overall.totalSpent.toFixed(2)}</span>
              <span className="text-sm font-medium">${overall.totalBudget.toFixed(2)}</span>
            </div>

            <Progress value={clamp(overallPercentage)} className="h-2" />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{Math.round(overallPercentage)}% used</span>
            <span
              className={`font-semibold ${
                overall.totalBudget <= 0
                  ? "text-muted-foreground"
                  : overall.totalSpent > overall.totalBudget
                  ? "text-destructive"
                  : overallPercentage > 90
                  ? "text-destructive"
                  : overallPercentage > 70
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {overall.totalBudget <= 0
                ? "No budget set"
                : overall.totalSpent > overall.totalBudget
                ? "Over budget!"
                : overallPercentage > 90
                ? "Danger"
                : overallPercentage > 70
                ? "Caution"
                : "On track"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Per-category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {overall.categories.length === 0 ? (
          <div className="col-span-full text-muted-foreground">No categories yet. Create categories to track budgets.</div>
        ) : (
          overall.categories.map((category) => {
            const spent = category.spent ?? 0;
            const total = category.budget ?? 0;
            const percentage = total > 0 ? (spent / total) * 100 : 0;
            const clamped = clamp(percentage);
            const status = statusFor(percentage, spent, total);

            return (
              <Card key={category._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color ?? "#1c69e3" }}
                        aria-hidden
                      />
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        ${Math.max(total - spent, 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">Remaining</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Spent: ${spent.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">${total.toFixed(2)}</span>
                    </div>

                    <Progress value={clamped} className="h-2" />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{Math.round(percentage)}% used</span>
                    <span className={`font-semibold ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
