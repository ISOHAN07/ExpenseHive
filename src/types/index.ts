export interface Category {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdBy?: string; // user _id
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseDTO {
  _id: string;
  expenseId?: number;
  expenseCategory: string | Category;
  expenseDesc: string;
  expenseDate: string;
  expenseAmount: number;
  userId?: number | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseCreateDTO {
  expenseId?: number;
  expenseCategory: string; // category _id
  expenseDesc: string;
  expenseDate: string;
  expenseAmount: number;
  userId?: number | string;
}
