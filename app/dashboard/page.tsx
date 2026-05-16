"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { reportsAPI } from "@/services/api";
import { DashboardData } from "@/types";
import toast from "react-hot-toast";

export default function DashboardPage() {
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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {data?.currentMonth} {data?.currentYear} Financial Summary
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Week {data?.currentWeek} Total
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₵{data?.weeklyTotal?.toLocaleString() || "0.00"}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₵{data?.monthlyTotal?.toLocaleString() || "0.00"}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Category Breakdown
          </h2>
          <div className="space-y-3">
            {data?.categoryBreakdown &&
              Object.entries(data.categoryBreakdown).map(
                ([category, amount]) =>
                  amount > 0 && (
                    <div
                      key={category}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-600">
                        {category.replace("_", " ")}
                      </span>
                      <span className="font-medium text-gray-900">
                        ₵{amount.toLocaleString()}
                      </span>
                    </div>
                  ),
              )}
          </div>
        </div>

        {/* Recent Records */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Records
            </h2>
          </div>
          <div className="divide-y">
            {data?.recentRecords?.map((record) => (
              <div
                key={record.id}
                className="px-6 py-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-900">{record.category}</p>
                  <p className="text-sm text-gray-500">
                    Week {record.weekNumber} •{" "}
                    {new Date(record.serviceDate).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-bold text-gray-900">
                  ₵{record.totalAmount.toLocaleString()}
                </p>
              </div>
            ))}
            {(!data?.recentRecords || data.recentRecords.length === 0) && (
              <div className="px-6 py-8 text-center text-gray-500">
                No records found. Create your first record!
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
