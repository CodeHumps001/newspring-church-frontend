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

export type Category = (typeof CATEGORIES)[number];
