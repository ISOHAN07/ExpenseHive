"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Plus } from "lucide-react"
import { ExpenseForm } from "../../components/expense-form"
import { ExpenseList } from "../../components/expense-list"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([
    {
      id: "1",
      description: "Grocery Shopping",
      amount: 45.99,
      category: "Food",
      date: new Date("2025-10-25"),
    },
    {
      id: "2",
      description: "Gas",
      amount: 52.5,
      category: "Transportation",
      date: new Date("2025-10-24"),
    },
    {
      id: "3",
      description: "Netflix Subscription",
      amount: 15.99,
      category: "Entertainment",
      date: new Date("2025-10-20"),
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAddExpense = (expense: any) => {
    if (editingId) {
      setExpenses(expenses.map((e) => (e.id === editingId ? { ...expense, id: editingId } : e)))
      setEditingId(null)
    } else {
      setExpenses([...expenses, { ...expense, id: Date.now().toString() }])
    }
    setShowForm(false)
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const handleEditExpense = (id: string) => {
    setEditingId(id)
    setShowForm(true)
  }

  const editingExpense = editingId ? expenses.find((e) => e.id === editingId) : null

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
            <p className="mt-2 text-muted-foreground">Track and manage your daily expenses</p>
          </div>
          <Button
            onClick={() => {
              setEditingId(null)
              setShowForm(!showForm)
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 border-border/50">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Expense" : "Add New Expense"}</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseForm
                onSubmit={handleAddExpense}
                onCancel={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                initialData={editingExpense}
              />
            </CardContent>
          </Card>
        )}

        <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} onEdit={handleEditExpense} />
      </div>
    </div>
  )
}
