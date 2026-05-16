"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Users,
  Church,
  DollarSign,
  Plus,
  Eye,
  PencilIcon,
  Trash2,
} from "lucide-react";
import MainLayout from "@/components/Layout/MainLayout";
import { reportsAPI, recordsAPI } from "@/services/api";
import { DashboardData } from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await reportsAPI.getDashboard();
      setData(response.data.data);
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, category: string) => {
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
      fetchDashboard(); // Refresh the dashboard
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete record");
    }
  };

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
      title: "Week Total",
      value: `₵${data?.weeklyTotal?.toLocaleString() || "0"}`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
      trend: `Week ${data?.currentWeek || 1}`,
    },
    {
      title: "Monthly Total",
      value: `₵${data?.monthlyTotal?.toLocaleString() || "0"}`,
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-100",
      trend: `${data?.currentMonth || ""} ${data?.currentYear || ""}`,
    },
    {
      title: "This Week",
      value: `Week ${data?.currentWeek || 1}`,
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-100",
      trend: `${data?.currentMonth || ""} ${data?.currentYear || ""}`,
    },
    {
      title: "Categories",
      value: Object.keys(data?.categoryBreakdown || {}).length,
      icon: Church,
      color: "text-orange-600",
      bg: "bg-orange-100",
      trend: "Active categories",
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
          <Link href="/records/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </Link>
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

        {/* Charts and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Breakdown */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
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
                            <span className="font-semibold">
                              ₵{amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${
                                  (amount / (data?.monthlyTotal || 1)) * 100
                                }%`,
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
                    No data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/records/new">
                  <Button variant="outline" className="w-full h-24 flex-col">
                    <Plus className="w-8 h-8 mb-2 text-blue-600" />
                    <span>Add New Record</span>
                  </Button>
                </Link>
                <Link href="/reports/monthly">
                  <Button variant="outline" className="w-full h-24 flex-col">
                    <Calendar className="w-8 h-8 mb-2 text-green-600" />
                    <span>Generate Report</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Records</CardTitle>
          </CardHeader>
          <CardContent>
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
                    <TableCell className="text-right font-semibold">
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
                            handleDelete(record.id, record.category)
                          }
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!data?.recentRecords || data.recentRecords.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-gray-500">No records found</p>
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
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
