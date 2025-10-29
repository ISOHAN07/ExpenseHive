// src/hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";
import api from "../src/api/apiClient";
import type { Category } from "../src/types/index";

const CATEGORIES_KEY = ["categories"];

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: CATEGORIES_KEY,
    queryFn: async () => {
      const { data } = await api.get<Category[]>("/categories");
      return data;
    },
  });
}
