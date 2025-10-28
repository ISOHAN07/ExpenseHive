"use client"

import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Trash2, Edit2 } from "lucide-react"

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: Date
}

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
  onEdit: (id: string) => void
}

export function ExpenseList({ expenses, onDelete, onEdit }: ExpenseListProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Transportation: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Entertainment: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Utilities: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Healthcare: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Shopping: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      Other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    }
    return colors[category] || colors.Other
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-4">
      {sortedExpenses.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="pt-6 text-center text-muted-foreground">
            No expenses yet. Add one to get started!
          </CardContent>
        </Card>
      ) : (
        sortedExpenses.map((expense) => (
          <Card key={expense.id} className="border-border/50 hover:border-border/80 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">{expense.description}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}
                    >
                      {expense.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatDate(expense.date)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${expense.amount.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(expense.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(expense.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
