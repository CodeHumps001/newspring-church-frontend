"use client";

import { useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { reportsAPI } from "@/services/api";
import { MonthlyReport } from "@/types";
import toast from "react-hot-toast";

export default function MonthlyReportPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await reportsAPI.getMonthly(month, year);
      setReport(response.data.data);
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Monthly Report</h1>
          <p className="text-gray-600 mt-1">
            Generate monthly financial report
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="px-3 py-2 border rounded-lg"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(2000, m - 1).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="px-3 py-2 border rounded-lg w-24"
              />
            </div>

            <button
              onClick={generateReport}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>

            {report && (
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Print Report
              </button>
            )}
          </div>
        </div>

        {/* Report */}
        {report && (
          <div
            id="report-content"
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="text-center py-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                NEWSPRING CHAPEL A/G
              </h2>
              <h3 className="text-xl text-gray-700 mt-1">
                MONTHLY OFFERING REPORT
              </h3>
              <p className="text-gray-600 mt-2">
                {report.month} {report.year}
              </p>
            </div>

            <div className="overflow-x-auto p-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-left">WEEK</th>
                    <th className="border p-3 text-right">TITHE (₵)</th>
                    <th className="border p-3 text-right">OFFERING (₵)</th>
                    <th className="border p-3 text-right">SPECIAL SEEDS (₵)</th>
                    <th className="border p-3 text-right">CHILDREN (₵)</th>
                    <th className="border p-3 text-right">TOTAL (₵)</th>
                  </tr>
                </thead>
                <tbody>
                  {report.weeks.map((week) => (
                    <tr key={week.weekNumber}>
                      <td className="border p-3 font-medium">
                        Week {week.weekNumber}
                      </td>
                      <td className="border p-3 text-right">
                        {week.Tithe.toLocaleString()}
                      </td>
                      <td className="border p-3 text-right">
                        {week.Offering.toLocaleString()}
                      </td>
                      <td className="border p-3 text-right">
                        {week.Special_Seeds.toLocaleString()}
                      </td>
                      <td className="border p-3 text-right">
                        {week.Children_Service.toLocaleString()}
                      </td>
                      <td className="border p-3 text-right font-bold">
                        {week.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100 font-bold">
                  <tr>
                    <td className="border p-3">TOTAL</td>
                    <td className="border p-3 text-right">
                      {report.categoryTotals.Tithe.toLocaleString()}
                    </td>
                    <td className="border p-3 text-right">
                      {report.categoryTotals.Offering.toLocaleString()}
                    </td>
                    <td className="border p-3 text-right">
                      {report.categoryTotals.Special_Seeds.toLocaleString()}
                    </td>
                    <td className="border p-3 text-right">
                      {report.categoryTotals.Children_Service.toLocaleString()}
                    </td>
                    <td className="border p-3 text-right">
                      {report.grandTotal.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="border-t p-6 flex justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Prepared by: _________________
                </p>
                <p className="text-sm text-gray-600 mt-4">
                  Date: _________________
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Confirmed by: _________________
                </p>
                <p className="text-sm text-gray-600 mt-4">
                  Isaac Fripong Manso
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
