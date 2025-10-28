"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

const mockExpenses = [
  {
    id: 1,
    category: "Food",
    amount: 45.5,
    date: "2024-01-15",
    description: "Lunch at restaurant",
  },
  {
    id: 2,
    category: "Transport",
    amount: 12.0,
    date: "2024-01-14",
    description: "Uber ride",
  },
  {
    id: 3,
    category: "Entertainment",
    amount: 25.0,
    date: "2024-01-13",
    description: "Movie tickets",
  },
  {
    id: 4,
    category: "Utilities",
    amount: 89.99,
    date: "2024-01-12",
    description: "Electricity bill",
  },
];

export default function Expenses() {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [filter, setFilter] = useState("all");
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    description: "",
  });

  const handleAddExpense = () => {
    if (newExpense.category && newExpense.amount) {
      setExpenses([
        ...expenses,
        {
          id: expenses.length + 1,
          category: newExpense.category,
          amount: Number.parseFloat(newExpense.amount),
          date: new Date().toISOString().split("T")[0],
          description: newExpense.description,
        },
      ]);
      setNewExpense({ category: "", amount: "", description: "" });
    }
  };

  const handleDelete = (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const filteredExpenses =
    filter === "all" ? expenses : expenses.filter((e) => e.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground">
            Manage and track your expenses
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>Create a new expense entry</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newExpense.category}
                  onValueChange={(value: string) =>
                    setNewExpense({ ...newExpense, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="What was this expense for?"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <Button onClick={handleAddExpense} className="w-full">
                Add Expense
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        {["Food", "Transport", "Entertainment", "Utilities"].map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Expenses List */}
      <div className="grid gap-4">
        {filteredExpenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">
                    {expense.category}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {expense.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {expense.date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-2xl font-bold text-foreground">
                    ${expense.amount.toFixed(2)}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
