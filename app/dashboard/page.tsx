"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  PencilIcon,
  Trash2,
  Wallet,
  Plus,
} from "lucide-react";
import MainLayout from "@/components/Layout/MainLayout";
import { reportsAPI, recordsAPI, expenseAPI } from "@/services/api";
import { DashboardData } from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";

interface ExpenseData {
  monthlyTotal: number;
  categoryBreakdown: Record<string, number>;
  recentExpenses: any[];
  count: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [expenseData, setExpenseData] = useState<ExpenseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"income" | "expenses">("income");

  useEffect(() => {
    fetchDashboard();
    fetchExpenses();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await reportsAPI.getDashboard();
      setData(response.data.data);
    } catch (error) {
      toast.error("Failed to load dashboard");
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await reportsAPI.getExpenseSummary();
      setExpenseData(response.data.data);
    } catch (error) {
      console.error("Failed to load expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIncome = async (id: number, category: string) => {
    if (
      !confirm(
        `Are you sure you want to delete this ${category} record? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await recordsAPI.delete(id);
      toast.success("Record deleted successfully!");
      fetchDashboard();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete record");
    }
  };

  const handleDeleteExpense = async (id: number, description: string) => {
    if (
      !confirm(
        `Are you sure you want to delete this expense: "${description}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await expenseAPI.delete(id);
      toast.success("Expense deleted successfully!");
      fetchExpenses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete expense");
    }
  };

  const incomeTotal = data?.monthlyTotal || 0;
  const expenseTotal = expenseData?.monthlyTotal || 0;
  const netBalance = incomeTotal - expenseTotal;
  const isPositive = netBalance >= 0;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const stats = [
    {
      title: "Total Income",
      value: `₵${incomeTotal.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
      trend: `${data?.currentMonth || ""} ${data?.currentYear || ""}`,
    },
    {
      title: "Total Expenses",
      value: `₵${expenseTotal.toLocaleString()}`,
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-100",
      trend: `${Object.keys(expenseData?.categoryBreakdown || {}).length} categories`,
    },
    {
      title: "Net Balance",
      value: `₵${netBalance.toLocaleString()}`,
      icon: Wallet,
      color: isPositive ? "text-green-600" : "text-red-600",
      bg: isPositive ? "bg-green-100" : "bg-red-100",
      trend: isPositive ? "Surplus" : "Deficit",
    },
    {
      title: "This Week",
      value: `Week ${data?.currentWeek || 1}`,
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-100",
      trend: `${data?.currentMonth || ""} ${data?.currentYear || ""}`,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Buttons visible on desktop, hidden on mobile */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Welcome back! Here's your church financial overview
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Link href="/records/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Income
              </Button>
            </Link>
            <Link href="/expenses/new">
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bg} p-1.5 sm:p-2 rounded-full`}>
                  <stat.icon
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.color}`}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                <div className="text-sm sm:text-2xl font-bold truncate">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Income vs Expense Chart Cards - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Income Categories */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                Income by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-3 sm:space-y-4">
                {data?.categoryBreakdown &&
                  Object.entries(data.categoryBreakdown).map(
                    ([category, amount]) =>
                      amount > 0 && (
                        <div key={category}>
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span className="text-gray-600 truncate">
                              {category.replace("_", " ")}
                            </span>
                            <span className="font-semibold text-green-600 ml-2">
                              ₵{amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div
                              className="bg-green-600 h-1.5 sm:h-2 rounded-full"
                              style={{
                                width: `${(amount / (incomeTotal || 1)) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ),
                  )}
                {(!data?.categoryBreakdown ||
                  Object.values(data.categoryBreakdown).every(
                    (v) => v === 0,
                  )) && (
                  <p className="text-gray-500 text-center py-8 text-sm">
                    No income data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expense Categories */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                Expenses by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-3 sm:space-y-4">
                {expenseData?.categoryBreakdown &&
                  Object.entries(expenseData.categoryBreakdown).map(
                    ([category, amount]) =>
                      amount > 0 && (
                        <div key={category}>
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span className="text-gray-600 truncate">
                              {category}
                            </span>
                            <span className="font-semibold text-red-600 ml-2">
                              ₵{amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div
                              className="bg-red-600 h-1.5 sm:h-2 rounded-full"
                              style={{
                                width: `${(amount / (expenseTotal || 1)) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ),
                  )}
                {(!expenseData?.categoryBreakdown ||
                  Object.values(expenseData.categoryBreakdown).length ===
                    0) && (
                  <p className="text-gray-500 text-center py-8 text-sm">
                    No expense data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Records and Expenses Tabs - Responsive Table */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex gap-4 border-b pb-3 sm:pb-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab("income")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
                  activeTab === "income"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Recent Income
              </button>
              <button
                onClick={() => setActiveTab("expenses")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
                  activeTab === "expenses"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Recent Expenses
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0 overflow-x-auto">
            {activeTab === "income" ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Date</TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Category
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">
                        Week
                      </TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">
                        Amount
                      </TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.recentRecords?.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="text-xs sm:text-sm">
                          {new Date(record.serviceDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {record.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          Week {record.weekNumber}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-green-600 text-xs sm:text-sm">
                          ₵{record.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Link href={`/records/edit/${record.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                handleDeleteIncome(record.id, record.category)
                              }
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!data?.recentRecords ||
                      data.recentRecords.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-gray-500 text-sm">
                            No income records found
                          </p>
                          <Link href="/records/new">
                            <Button variant="link" className="mt-2 text-sm">
                              Create your first record
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Date</TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Category
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">
                        Description
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm hidden lg:table-cell">
                        Payment
                      </TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">
                        Amount
                      </TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseData?.recentExpenses?.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="text-xs sm:text-sm">
                          {new Date(expense.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-red-600 text-xs"
                          >
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell max-w-[150px] truncate">
                          {expense.description}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          {expense.paymentMethod}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-red-600 text-xs sm:text-sm">
                          ₵{parseFloat(expense.amount).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Link href={`/expenses/edit/${expense.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                handleDeleteExpense(
                                  expense.id,
                                  expense.description,
                                )
                              }
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!expenseData?.recentExpenses ||
                      expenseData.recentExpenses.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <p className="text-gray-500 text-sm">
                            No expense records found
                          </p>
                          <Link href="/expenses/new">
                            <Button variant="link" className="mt-2 text-sm">
                              Record your first expense
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
