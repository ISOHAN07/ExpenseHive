"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Plus, Trash2, Edit2 } from "lucide-react"

interface Category {
  id: string
  name: string
  color: string
  budget?: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Food", color: "bg-orange-500", budget: 500 },
    { id: "2", name: "Transportation", color: "bg-blue-500", budget: 300 },
    { id: "3", name: "Entertainment", color: "bg-purple-500", budget: 200 },
    { id: "4", name: "Utilities", color: "bg-green-500", budget: 400 },
    { id: "5", name: "Healthcare", color: "bg-red-500", budget: 250 },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", color: "bg-blue-500", budget: "" })

  const colors = [
    "bg-orange-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-red-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-indigo-500",
  ]

  const handleAddCategory = () => {
    if (formData.name && formData.budget) {
      if (editingId) {
        setCategories(
          categories.map((c) =>
            c.id === editingId
              ? { ...c, name: formData.name, color: formData.color, budget: Number.parseFloat(formData.budget) }
              : c,
          ),
        )
        setEditingId(null)
      } else {
        setCategories([
          ...categories,
          {
            id: Date.now().toString(),
            name: formData.name,
            color: formData.color,
            budget: Number.parseFloat(formData.budget),
          },
        ])
      }
      setFormData({ name: "", color: "bg-blue-500", budget: "" })
      setShowForm(false)
    }
  }

  const handleEditCategory = (category: Category) => {
    setFormData({
      name: category.name,
      color: category.color,
      budget: category.budget?.toString() || "",
    })
    setEditingId(category.id)
    setShowForm(true)
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Categories</h1>
            <p className="mt-2 text-muted-foreground">Manage your expense categories and budgets</p>
          </div>
          <Button
            onClick={() => {
              setEditingId(null)
              setFormData({ name: "", color: "bg-blue-500", budget: "" })
              setShowForm(!showForm)
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 border-border/50">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Category" : "Add New Category"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category Name</label>
                <Input
                  type="text"
                  placeholder="e.g., Groceries"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full ${color} ${formData.color === color ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Monthly Budget</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddCategory} className="bg-primary hover:bg-primary/90">
                  {editingId ? "Update Category" : "Add Category"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="border-border/50 hover:border-border/80 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${category.color}`} />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Budget</span>
                    <span className="font-semibold text-foreground">${category.budget?.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className={`${category.color} h-2 rounded-full w-1/3`} />
                  </div>
                  <p className="text-xs text-muted-foreground">$150 spent (30%)</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
