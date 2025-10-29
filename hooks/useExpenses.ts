import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../src/api/apiClient";
import type { ExpenseDTO, ExpenseCreateDTO } from "../src/types/index";

const EXPENSES_KEY = ["expenses"];

export function useExpenses() {
  return useQuery<ExpenseDTO[], Error>({
    queryKey: EXPENSES_KEY,
    queryFn: async () => {
      const res = await api.get("/expenses");

      // ✅ your backend returns an array directly
      const expenses = res.data;

      if (!Array.isArray(expenses)) {
        console.warn("Unexpected /expenses response:", res.data);
        return [];
      }

      return expenses;
    },
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation<ExpenseDTO, Error, ExpenseCreateDTO>({
    mutationFn: async (payload) => {
      const res = await api.post("/expenses", payload);
      return res.data?.data ?? res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: EXPENSES_KEY }),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation<ExpenseDTO, Error, { expenseId: number; payload: Partial<ExpenseCreateDTO> }>({
    mutationFn: async ({ expenseId, payload }) => {
      const res = await api.put(`/expenses/${expenseId}`, payload);
      return res.data?.data ?? res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: EXPENSES_KEY }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation<Number, Error, Number>({
    mutationFn: async (expenseId) => {
      await api.delete(`/expenses/${expenseId}`);
      return expenseId;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: EXPENSES_KEY }),
  });
}
