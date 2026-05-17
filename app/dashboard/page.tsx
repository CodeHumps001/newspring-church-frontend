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
  Church,
  DollarSign,
  Plus,
  PencilIcon,
  Trash2,
  Wallet,
  PieChart,
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's your church financial overview
            </p>
          </div>
          <div className="flex gap-2">
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bg} p-2 rounded-full`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Income vs Expense Chart Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Income by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.categoryBreakdown &&
                  Object.entries(data.categoryBreakdown).map(
                    ([category, amount]) =>
                      amount > 0 && (
                        <div key={category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">
                              {category.replace("_", " ")}
                            </span>
                            <span className="font-semibold text-green-600">
                              ₵{amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
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
                  <p className="text-gray-500 text-center py-8">
                    No income data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expense Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                Expenses by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseData?.categoryBreakdown &&
                  Object.entries(expenseData.categoryBreakdown).map(
                    ([category, amount]) =>
                      amount > 0 && (
                        <div key={category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{category}</span>
                            <span className="font-semibold text-red-600">
                              ₵{amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-600 h-2 rounded-full"
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
                  <p className="text-gray-500 text-center py-8">
                    No expense data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Records and Expenses Tabs */}
        <Card>
          <CardHeader>
            <div className="flex gap-4 border-b pb-4">
              <button
                onClick={() => setActiveTab("income")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "income"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Recent Income
              </button>
              <button
                onClick={() => setActiveTab("expenses")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "expenses"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Recent Expenses
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === "income" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Week</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.recentRecords?.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {new Date(record.serviceDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{record.category}</Badge>
                      </TableCell>
                      <TableCell>Week {record.weekNumber}</TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        ₵{record.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/records/edit/${record.id}`}>
                            <Button variant="ghost" size="sm">
                              <PencilIcon className="w-4 h-4 text-blue-600" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteIncome(record.id, record.category)
                            }
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!data?.recentRecords ||
                    data.recentRecords.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <p className="text-gray-500">No income records found</p>
                        <Link href="/records/new">
                          <Button variant="link" className="mt-2">
                            Create your first record
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseData?.recentExpenses?.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-red-600">
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {expense.description}
                      </TableCell>
                      <TableCell>{expense.paymentMethod}</TableCell>
                      <TableCell className="text-right font-semibold text-red-600">
                        ₵{parseFloat(expense.amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/expenses/edit/${expense.id}`}>
                            <Button variant="ghost" size="sm">
                              <PencilIcon className="w-4 h-4 text-blue-600" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteExpense(
                                expense.id,
                                expense.description,
                              )
                            }
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!expenseData?.recentExpenses ||
                    expenseData.recentExpenses.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-gray-500">
                          No expense records found
                        </p>
                        <Link href="/expenses/new">
                          <Button variant="link" className="mt-2">
                            Record your first expense
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
