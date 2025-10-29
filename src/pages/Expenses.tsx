"use client";

import { useMemo, useState } from "react";
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

import {
  useExpenses,
  useCreateExpense,
  useDeleteExpense,
  useUpdateExpense,
} from "../../hooks/useExpenses";
import { useCategories } from "../../hooks/useCategories";
import type { ExpenseCreateDTO, ExpenseDTO, Category } from "../types/index";

export default function ExpensesPage() {
  const { data: expenses = [], isLoading: loadingExpenses } = useExpenses();
  const { categories = [], isLoading: loadingCategories } = useCategories();

  const createExpense = useCreateExpense();
  const deleteExpense = useDeleteExpense();
  const updateExpense = useUpdateExpense();

  const [filter, setFilter] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState<ExpenseDTO | null>(null);

  const [form, setForm] = useState<ExpenseCreateDTO>({
    expenseId: undefined,
    expenseCategory: "",
    expenseDesc: "",
    expenseDate: new Date().toISOString().slice(0, 10),
    expenseAmount: 0,
  });

  const getCategoryName = (cat: string | Category | undefined) => {
    if (!cat) return "—";
    if (typeof cat === "string") {
      const found = categories.find((c) => c._id === cat);
      return found ? found.name : cat;
    }
    return (cat as Category).name ?? "—";
  };

  const categoryNames = useMemo(() => {
    if (categories && categories.length) return categories.map((c) => c.name);
    const names = new Set<string>();
    expenses.forEach((e) => {
      const cn =
        typeof e.expenseCategory === "string"
          ? e.expenseCategory
          : e.expenseCategory?.name;
      if (cn) names.add(cn);
    });
    return Array.from(names);
  }, [categories, expenses]);

  const filteredExpenses = useMemo(() => {
    if (filter === "all") return expenses;
    return expenses.filter(
      (e) => getCategoryName(e.expenseCategory) === filter
    );
  }, [expenses, filter]);

  const openAdd = () => {
    if (loadingCategories) {
      alert("Please wait, categories are still loading...");
      return;
    }

    if (!categories || categories.length === 0) {
      alert("You need to create a category before adding an expense.");
      window.location.href = "/categories"; // ✅ Redirect user to category page
      return;
    }

    setForm({
      expenseId: undefined,
      expenseCategory: categories[0]._id,
      expenseDesc: "",
      expenseDate: new Date().toISOString().slice(0, 10),
      expenseAmount: 0,
    });

    setIsAddOpen(true);
  };

  // ✅ No userId in payload, JWT is sent automatically via apiClient
  const handleAddExpense = async () => {
    if (
      !form.expenseCategory ||
      !form.expenseAmount ||
      !form.expenseDesc ||
      !form.expenseDate
    ) {
      alert("Please provide all the fields.");
      return;
    }

    try {
      await createExpense.mutateAsync({
        expenseId: Date.now(), // optional client-side id
        expenseCategory: form.expenseCategory,
        expenseDesc: form.expenseDesc,
        expenseDate: form.expenseDate,
        expenseAmount: form.expenseAmount,
      });
      setIsAddOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to add expense");
    }
  };

  // ✅ expenseId is a number
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await deleteExpense.mutateAsync(id);
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  const startEdit = (expense: ExpenseDTO) => {
    setEditing(expense);
    setForm({
      expenseId: expense.expenseId,
      expenseCategory:
        typeof expense.expenseCategory === "string"
          ? expense.expenseCategory
          : expense.expenseCategory?._id ?? "",
      expenseDesc: expense.expenseDesc,
      expenseDate: expense.expenseDate.slice(0, 10),
      expenseAmount: expense.expenseAmount,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editing) return;
    try {
      await updateExpense.mutateAsync({
        expenseId: editing.expenseId!,
        payload: form,
      });
      setIsEditOpen(false);
      setEditing(null);
    } catch (err: any) {
      console.error(err);
      alert("Failed to update");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground">
            Manage and track your expenses
          </p>
        </div>

        {/* Add Expense Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
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
                  value={form.expenseCategory}
                  onValueChange={(v: string) =>
                    setForm((f) => ({ ...f, expenseCategory: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingCategories ? "Loading..." : "Select category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length ? (
                      categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="">No categories</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={String(form.expenseAmount ?? "")}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      expenseAmount: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="What was this expense for?"
                  value={form.expenseDesc}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expenseDesc: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.expenseDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expenseDate: e.target.value }))
                  }
                />
              </div>

              <Button
                onClick={handleAddExpense}
                className="w-full"
                disabled={createExpense.isPending}
              >
                {createExpense.isPending ? "Adding..." : "Add Expense"}
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

        {categoryNames.map((cat) => (
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
        {loadingExpenses ? (
          <p>Loading expenses...</p>
        ) : filteredExpenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          filteredExpenses.map((expense) => (
            <Card key={expense._id ?? String(expense.expenseId)}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
                      {getCategoryName(expense.expenseCategory)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {expense.expenseDesc}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {expense.expenseDate.slice(0, 10)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-bold text-foreground">
                      ${expense.expenseAmount.toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(expense)}
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(expense.expenseId!)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>Update expense details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="category-edit">Category</Label>
              <Select
                value={form.expenseCategory}
                onValueChange={(v: string) =>
                  setForm((f) => ({ ...f, expenseCategory: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount-edit">Amount</Label>
              <Input
                id="amount-edit"
                type="number"
                value={String(form.expenseAmount ?? "")}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    expenseAmount: Number(e.target.value),
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="description-edit">Description</Label>
              <Input
                id="description-edit"
                value={form.expenseDesc}
                onChange={(e) =>
                  setForm((f) => ({ ...f, expenseDesc: e.target.value }))
                }
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleUpdate}
                className="flex-1"
                disabled={updateExpense.isPending}
              >
                {updateExpense.isPending ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsEditOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
