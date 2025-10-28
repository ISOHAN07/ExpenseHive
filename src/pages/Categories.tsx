"use client"

import { Plus, Trash2, Edit2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useState } from "react"

const mockCategories = [
  { id: 1, name: "Food", color: "#FF6B6B", spent: 450.5, budget: 500 },
  { id: 2, name: "Transport", color: "#4ECDC4", spent: 200.0, budget: 300 },
  { id: 3, name: "Entertainment", color: "#FFE66D", spent: 150.0, budget: 200 },
  { id: 4, name: "Utilities", color: "#95E1D3", spent: 300.0, budget: 400 },
]

export default function Categories() {
  const [categories, setCategories] = useState(mockCategories)
  const [newCategory, setNewCategory] = useState({ name: "", color: "#FF6B6B", budget: "" })

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.budget) {
      setCategories([
        ...categories,
        {
          id: categories.length + 1,
          name: newCategory.name,
          color: newCategory.color,
          spent: 0,
          budget: Number.parseFloat(newCategory.budget),
        },
      ])
      setNewCategory({ name: "", color: "#FF6B6B", budget: "" })
    }
  }

  const handleDelete = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">Manage your expense categories</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new expense category</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Groceries"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Input
                    id="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="budget">Monthly Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="0.00"
                  value={newCategory.budget}
                  onChange={(e) => setNewCategory({ ...newCategory, budget: e.target.value })}
                />
              </div>
              <Button onClick={handleAddCategory} className="w-full">
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const percentage = (category.spent / category.budget) * 100
          return (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Spent</span>
                    <span className="font-semibold">${category.spent.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget: ${category.budget.toFixed(2)}</span>
                  <span className="font-semibold">{Math.round(percentage)}%</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
