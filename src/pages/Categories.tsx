"use client";

import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import { toast } from "sonner";

export default function Categories() {
  const { categories, isLoading, addCategory, updateCategory, deleteCategory } =
    useCategories();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#FF6B6B",
    budget: "",
  });

  const [editCategory, setEditCategory] = useState({
    name: "",
    color: "#FF6B6B",
    budget: "",
  });

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.budget) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await addCategory.mutateAsync({
        name: newCategory.name,
        color: newCategory.color,
        budget: parseFloat(newCategory.budget),
      });
      setNewCategory({ name: "", color: "#FF6B6B", budget: "" });
      setDialogOpen(false);
      toast.success("Category added successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add category");
    }
  };

  const openEditDialog = (category: any) => {
    setSelectedCategory(category);
    setEditCategory({
      name: category.name,
      color: category.color,
      budget: String(category.budget),
    });
    setEditDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory?._id) return;

    try {
      await updateCategory.mutateAsync({
        id: selectedCategory._id,
        updates: {
          name: editCategory.name.trim(),
          color: editCategory.color,
          budget: parseFloat(editCategory.budget),
        },
      });
      setEditDialogOpen(false);
      toast.success("Category updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      toast.error("Invalid category id");
      return;
    }

    if (!confirm("Delete this category? This cannot be undone.")) return;

    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">
            Manage your expense categories
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new expense category
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, color: e.target.value })
                    }
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Input
                    id="color"
                    value={newCategory.color}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, color: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  value={newCategory.budget}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, budget: e.target.value })
                  }
                />
              </div>
              <Button
                onClick={handleAddCategory}
                disabled={addCategory.isPending}
                className="w-full"
              >
                {addCategory.isPending ? "Adding..." : "Add Category"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      {isLoading ? (
        <p className="text-muted-foreground">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-muted-foreground">No categories yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const spent = category.spent || 0;
            const budget = category.budget || 0;
            const percentage = budget > 0 ? (spent / budget) * 100 : 0;

            return (
              <Card key={category._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(category)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category._id)}
                        disabled={deleteCategory.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Spent
                      </span>
                      <span className="font-semibold">${spent.toFixed(2)}</span>
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
                    <span className="text-muted-foreground">
                      Budget: ${category.budget.toFixed(2)}
                    </span>
                    <span className="font-semibold">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Modify category details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Name</Label>
              <Input
                value={editCategory.name}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={editCategory.color}
                  onChange={(e) =>
                    setEditCategory({ ...editCategory, color: e.target.value })
                  }
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <Input
                  value={editCategory.color}
                  onChange={(e) =>
                    setEditCategory({ ...editCategory, color: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Budget</Label>
              <Input
                type="number"
                value={editCategory.budget}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, budget: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateCategory}
                disabled={updateCategory.isPending}
              >
                {updateCategory.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
