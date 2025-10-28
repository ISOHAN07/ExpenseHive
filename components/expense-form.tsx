"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

interface ExpenseFormProps {
  onSubmit: (expense: any) => void
  onCancel: () => void
  initialData?: any
}

export function ExpenseForm({ onSubmit, onCancel, initialData }: ExpenseFormProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")
  const [date, setDate] = useState("")

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description)
      setAmount(initialData.amount.toString())
      setCategory(initialData.category)
      setDate(initialData.date.toISOString().split("T")[0])
    } else {
      setDate(new Date().toISOString().split("T")[0])
    }
  }, [initialData])

  const categories = ["Food", "Transportation", "Entertainment", "Utilities", "Healthcare", "Shopping", "Other"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (description && amount && category && date) {
      onSubmit({
        description,
        amount: Number.parseFloat(amount),
        category,
        date: new Date(date),
      })
      setDescription("")
      setAmount("")
      setCategory("Food")
      setDate(new Date().toISOString().split("T")[0])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <Input
            type="text"
            placeholder="e.g., Grocery shopping"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
          <Input
            type="number"
            placeholder="0.00"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          {initialData ? "Update Expense" : "Add Expense"}
        </Button>
      </div>
    </form>
  )
}
