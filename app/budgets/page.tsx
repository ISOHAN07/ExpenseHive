"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"

interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  color: string
}

export default function BudgetsPage() {
  const [budgets] = useState<Budget[]>([
    { id: "1", category: "Food", limit: 500, spent: 350, color: "bg-orange-500" },
    { id: "2", category: "Transportation", limit: 300, spent: 280, color: "bg-blue-500" },
    { id: "3", category: "Entertainment", limit: 200, spent: 120, color: "bg-purple-500" },
    { id: "4", category: "Utilities", limit: 400, spent: 380, color: "bg-green-500" },
    { id: "5", category: "Healthcare", limit: 250, spent: 100, color: "bg-red-500" },
  ])

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const percentageSpent = Math.round((totalSpent / totalBudget) * 100)

  const getStatusColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 90) return "text-destructive"
    if (percentage >= 70) return "text-yellow-600 dark:text-yellow-500"
    return "text-green-600 dark:text-green-500"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Budget Overview</h1>
          <p className="mt-2 text-muted-foreground">Track your spending against budgets</p>
        </div>

        {/* Summary Card */}
        <Card className="mb-8 border-border/50 bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader>
            <CardTitle>Total Budget Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
                <p className="text-3xl font-bold text-foreground">${totalBudget.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-primary">${totalSpent.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-500">
                  ${(totalBudget - totalSpent).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Overall Progress</span>
                <span className="text-sm font-semibold text-foreground">{percentageSpent}%</span>
              </div>
              <Progress value={percentageSpent} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Budget Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">Category Budgets</h2>
          {budgets.map((budget) => {
            const percentage = Math.round((budget.spent / budget.limit) * 100)
            return (
              <Card key={budget.id} className="border-border/50 hover:border-border/80 transition-colors">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${budget.color}`} />
                        <h3 className="font-semibold text-foreground">{budget.category}</h3>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${getStatusColor(budget.spent, budget.limit)}`}>
                          {percentage}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${budget.spent.toFixed(2)} of ${budget.limit.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
