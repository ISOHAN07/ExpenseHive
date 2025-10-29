// hooks/useCategories.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../src/api/apiClient"

export interface Category {
  _id: string
  name: string
  color: string
  budget: number
  description?: string
  icon?: string
  spent?: number
}

export const useCategories = () => {
  const queryClient = useQueryClient()

  // ✅ Fetch categories
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories")
      return res.data
    },
  })

  // ✅ Add category
  const addCategory = useMutation({
    mutationFn: async (newCategory: Partial<Category>) => {
      const res = await api.post("/categories", newCategory)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })

  // ✅ Update category
  const updateCategory = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Category> }) => {
      const res = await api.put(`/categories/${encodeURIComponent(id)}`, updates)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })

  // ✅ Delete category
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      if (!id) throw new Error("Invalid category id")
      const res = await api.delete(`/categories/${encodeURIComponent(id)}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })

  return { categories, isLoading, addCategory, updateCategory, deleteCategory }
}
