export interface User {
  id: number;
  email: string;
  createdAt: string;
}

export interface DenominationEntry {
  id?: number;
  denomination: number;
  quantity: number;
  subtotal?: number;
}

export interface FinancialRecord {
  id: number;
  userId: number;
  category: string;
  weekNumber: number;
  month: number;
  year: number;
  totalAmount: number;
  serviceDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  denominationEntries: DenominationEntry[];
}

export interface DashboardData {
  weeklyTotal: number;
  monthlyTotal: number;
  currentWeek: number;
  currentMonth: string;
  currentYear: number;
  categoryBreakdown: {
    Tithe: number;
    Offering: number;
    Special_Seeds: number;
    Children_Service: number;
  };
  recentRecords: FinancialRecord[];
}

export interface MonthlyReport {
  month: string;
  year: number;
  weeks: WeeklyData[];
  categoryTotals: CategoryTotals;
  grandTotal: number;
}

export interface WeeklyData {
  weekNumber: number;
  Tithe: number;
  Offering: number;
  Special_Seeds: number;
  Children_Service: number;
  total: number;
}

export interface CategoryTotals {
  Tithe: number;
  Offering: number;
  Special_Seeds: number;
  Children_Service: number;
  sunday_school_offering: number;
}

export const CATEGORIES = [
  "Tithe",
  "Offering",
  "Special Seeds",
  "Children Service",
  "Sunday School Offering",
] as const;

// Add after your existing types
export const EXPENSE_CATEGORIES = [
  "Church Utilities",
  "Missionary Support",
  "Outreach Programs",
  "Church Maintenance",
  "Staff Salary",
  "Children Ministry",
  "Youth Programs",
  "Worship & Music",
  "Administrative",
  "Benevolence",
  "Special Events",
  "Transportation",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const PAYMENT_METHODS = [
  "Cash",
  "Bank Transfer",
  "Mobile Money",
  "Check",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface Expense {
  id: number;
  userId: number;
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export type Category = (typeof CATEGORIES)[number];
