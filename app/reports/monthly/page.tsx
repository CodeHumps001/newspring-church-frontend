"use client";

import { useState } from "react";
import {
  PDFDownloadLink,
  PDFViewer,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import MainLayout from "@/components/Layout/MainLayout";
import { reportsAPI } from "@/services/api";
import toast from "react-hot-toast";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  churchName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1e3a8a",
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#3b82f6",
  },
  monthYear: {
    fontSize: 11,
    marginTop: 6,
    color: "#6b7280",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
    backgroundColor: "#f3f4f6",
    padding: 5,
  },
  table: {
    width: "100%",
    marginTop: 8,
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#d1d5db",
  },
  tableCellWeek: {
    width: "15%",
    paddingHorizontal: 4,
  },
  tableCell: {
    width: "17%",
    textAlign: "right",
    paddingHorizontal: 4,
  },
  tableCellTotal: {
    width: "17%",
    textAlign: "right",
    fontWeight: "bold",
    paddingHorizontal: 4,
  },
  expenseRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 5,
  },
  expenseCategory: {
    width: "35%",
    paddingHorizontal: 4,
  },
  expenseAmount: {
    width: "25%",
    textAlign: "right",
    paddingHorizontal: 4,
  },
  expenseDesc: {
    width: "40%",
    paddingHorizontal: 4,
  },
  footer: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 15,
  },
  signatureLine: {
    marginTop: 15,
  },
  signatureText: {
    fontSize: 9,
    color: "#6b7280",
  },
  totalRow: {
    backgroundColor: "#f9fafb",
    fontWeight: "bold",
    borderTopWidth: 2,
    borderTopColor: "#9ca3af",
  },
  summaryBox: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f0f9ff",
    borderRadius: 5,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  netPositive: {
    color: "#16a34a",
    fontWeight: "bold",
  },
  netNegative: {
    color: "#dc2626",
    fontWeight: "bold",
  },
});

// PDF Document Component
const ReportPDF = ({ report }: { report: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.churchName}>NEWSPRING CHAPEL A/G</Text>
        <Text style={styles.reportTitle}>COMPREHENSIVE FINANCIAL REPORT</Text>
        <Text style={styles.monthYear}>
          {report.month} {report.year}
        </Text>
      </View>

      {/* Income Section */}
      <Text style={styles.sectionTitle}>INCOME STATEMENT</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCellWeek}>WEEK</Text>
          <Text style={styles.tableCell}>TITHE (₵)</Text>
          <Text style={styles.tableCell}>OFFERING (₵)</Text>
          <Text style={styles.tableCell}>SPECIAL SEEDS (₵)</Text>
          <Text style={styles.tableCell}>CHILDREN (₵)</Text>
          <Text style={styles.tableCellTotal}>TOTAL (₵)</Text>
        </View>

        {report.weeks.map((week: any) => (
          <View style={styles.tableRow} key={week.weekNumber}>
            <Text style={styles.tableCellWeek}>Week {week.weekNumber}</Text>
            <Text style={styles.tableCell}>{week.Tithe.toLocaleString()}</Text>
            <Text style={styles.tableCell}>
              {week.Offering.toLocaleString()}
            </Text>
            <Text style={styles.tableCell}>
              {week.Special_Seeds.toLocaleString()}
            </Text>
            <Text style={styles.tableCell}>
              {week.Children_Service.toLocaleString()}
            </Text>
            <Text style={styles.tableCellTotal}>
              {week.total.toLocaleString()}
            </Text>
          </View>
        ))}

        <View style={[styles.tableRow, styles.totalRow]}>
          <Text style={styles.tableCellWeek}>TOTAL INCOME</Text>
          <Text style={styles.tableCell}>
            {report.categoryTotals.Tithe.toLocaleString()}
          </Text>
          <Text style={styles.tableCell}>
            {report.categoryTotals.Offering.toLocaleString()}
          </Text>
          <Text style={styles.tableCell}>
            {report.categoryTotals.Special_Seeds.toLocaleString()}
          </Text>
          <Text style={styles.tableCell}>
            {report.categoryTotals.Children_Service.toLocaleString()}
          </Text>
          <Text style={styles.tableCellTotal}>
            {report.grandTotal.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Expenses Section */}
      <Text style={styles.sectionTitle}>EXPENSES BREAKDOWN</Text>
      <View style={styles.table}>
        <View style={[styles.expenseRow, styles.tableHeader]}>
          <Text style={styles.expenseCategory}>CATEGORY</Text>
          <Text style={styles.expenseDesc}>DESCRIPTION</Text>
          <Text style={styles.expenseAmount}>AMOUNT (₵)</Text>
        </View>

        {report.expenses.list.map((expense: any, index: number) => (
          <View style={styles.expenseRow} key={index}>
            <Text style={styles.expenseCategory}>{expense.category}</Text>
            <Text style={styles.expenseDesc}>{expense.description}</Text>
            <Text style={styles.expenseAmount}>
              {parseFloat(expense.amount).toLocaleString()}
            </Text>
          </View>
        ))}

        <View style={[styles.expenseRow, styles.totalRow]}>
          <Text style={styles.expenseCategory}>TOTAL EXPENSES</Text>
          <Text style={styles.expenseDesc}></Text>
          <Text style={styles.expenseAmount}>
            {report.expenses.total.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Summary Section */}
      <View style={styles.summaryBox}>
        <Text style={{ fontSize: 11, fontWeight: "bold", marginBottom: 8 }}>
          FINANCIAL SUMMARY
        </Text>
        <View style={styles.summaryRow}>
          <Text>Total Income:</Text>
          <Text>₵{report.grandTotal.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Total Expenses:</Text>
          <Text>₵{report.expenses.total.toLocaleString()}</Text>
        </View>
        <View
          style={[
            styles.summaryRow,
            {
              marginTop: 5,
              paddingTop: 5,
              borderTopWidth: 1,
              borderTopColor: "#d1d5db",
            },
          ]}
        >
          <Text style={{ fontWeight: "bold" }}>Net Balance:</Text>
          <Text
            style={
              report.netBalance >= 0 ? styles.netPositive : styles.netNegative
            }
          >
            ₵{report.netBalance.toLocaleString()}{" "}
            {report.netBalance >= 0 ? "(Surplus)" : "(Deficit)"}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.signatureText}>
            Prepared by: _________________
          </Text>
          <Text style={[styles.signatureText, styles.signatureLine]}>
            Date: _________________
          </Text>
        </View>
        <View>
          <Text style={styles.signatureText}>
            Confirmed by: _________________
          </Text>
          <Text style={[styles.signatureText, styles.signatureLine]}>
            Isaac Frimpong Manso
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 20, textAlign: "center" }}>
        <Text style={{ fontSize: 7, color: "#9ca3af", textAlign: "center" }}>
          Generated on {new Date().toLocaleString()}
        </Text>
      </View>
    </Page>
  </Document>
);

export default function MonthlyReportPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await reportsAPI.getMonthly(month, year);
      setReport(response.data.data);
      setShowPreview(false);
      toast.success("Report generated successfully!");
    } catch (error) {
      toast.error("Failed to generate report");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Monthly Financial Report
          </h1>
          <p className="text-gray-600 mt-1">
            Complete report including income and expenses
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
                className="px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                className="px-3 py-2 border rounded-lg w-24 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={generateReport}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>

            {report && (
              <>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {showPreview ? "Hide Preview" : "Preview PDF"}
                </button>

                <PDFDownloadLink
                  document={<ReportPDF report={report} />}
                  fileName={`church-financial-report-${report.month}-${report.year}.pdf`}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
                >
                  {({ loading }) => (loading ? "Preparing..." : "Download PDF")}
                </PDFDownloadLink>
              </>
            )}
          </div>
        </div>

        {/* HTML Preview */}
        {report && !showPreview && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="text-center py-6 border-b bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-2xl font-bold text-blue-900">
                NEWSPRING CHAPEL A/G
              </h2>
              <h3 className="text-xl text-blue-700 mt-1">
                COMPREHENSIVE FINANCIAL REPORT
              </h3>
              <p className="text-gray-600 mt-2">
                {report.month} {report.year}
              </p>
            </div>

            <div className="p-6">
              {/* Income Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-600 rounded"></span>
                  INCOME STATEMENT
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-3 text-left">WEEK</th>
                        <th className="border p-3 text-right">TITHE (₵)</th>
                        <th className="border p-3 text-right">OFFERING (₵)</th>
                        <th className="border p-3 text-right">
                          SPECIAL SEEDS (₵)
                        </th>
                        <th className="border p-3 text-right">CHILDREN (₵)</th>
                        <th className="border p-3 text-right">TOTAL (₵)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.weeks.map((week: any) => (
                        <tr key={week.weekNumber} className="hover:bg-gray-50">
                          <td className="border p-3 font-medium">
                            Week {week.weekNumber}
                          </td>
                          <td className="border p-3 text-right">
                            ₵{week.Tithe.toLocaleString()}
                          </td>
                          <td className="border p-3 text-right">
                            ₵{week.Offering.toLocaleString()}
                          </td>
                          <td className="border p-3 text-right">
                            ₵{week.Special_Seeds.toLocaleString()}
                          </td>
                          <td className="border p-3 text-right">
                            ₵{week.Children_Service.toLocaleString()}
                          </td>
                          <td className="border p-3 text-right font-bold">
                            ₵{week.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100 font-bold">
                      <tr>
                        <td className="border p-3">TOTAL INCOME</td>
                        <td className="border p-3 text-right">
                          ₵{report.categoryTotals.Tithe.toLocaleString()}
                        </td>
                        <td className="border p-3 text-right">
                          ₵{report.categoryTotals.Offering.toLocaleString()}
                        </td>
                        <td className="border p-3 text-right">
                          ₵
                          {report.categoryTotals.Special_Seeds.toLocaleString()}
                        </td>
                        <td className="border p-3 text-right">
                          ₵
                          {report.categoryTotals.Children_Service.toLocaleString()}
                        </td>
                        <td className="border p-3 text-right">
                          ₵{report.grandTotal.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Expenses Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-red-600 rounded"></span>
                  EXPENSES BREAKDOWN
                </h3>
                {report.expenses.list.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-3 text-left">CATEGORY</th>
                          <th className="border p-3 text-left">DESCRIPTION</th>
                          <th className="border p-3 text-right">DATE</th>
                          <th className="border p-3 text-right">AMOUNT (₵)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.expenses.list.map(
                          (expense: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border p-3">{expense.category}</td>
                              <td className="border p-3">
                                {expense.description}
                              </td>
                              <td className="border p-3 text-right">
                                {new Date(expense.date).toLocaleDateString()}
                              </td>
                              <td className="border p-3 text-right">
                                ₵{parseFloat(expense.amount).toLocaleString()}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                      <tfoot className="bg-gray-100 font-bold">
                        <tr>
                          <td colSpan={3} className="border p-3 text-right">
                            TOTAL EXPENSES
                          </td>
                          <td className="border p-3 text-right">
                            ₵{report.expenses.total.toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      No expenses recorded for this month
                    </p>
                  </div>
                )}
              </div>

              {/* Summary Section */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                  FINANCIAL SUMMARY
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-blue-200">
                    <span className="text-gray-700">Total Income:</span>
                    <span className="font-semibold text-green-600 text-lg">
                      ₵{report.grandTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-blue-200">
                    <span className="text-gray-700">Total Expenses:</span>
                    <span className="font-semibold text-red-600 text-lg">
                      ₵{report.expenses.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3">
                    <span className="font-bold text-gray-900 text-lg">
                      Net Balance:
                    </span>
                    <span
                      className={`font-bold text-xl ${report.netBalance >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      ₵{report.netBalance.toLocaleString()}
                      <span className="text-sm ml-2">
                        {report.netBalance >= 0 ? "(Surplus)" : "(Deficit)"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-between bg-gray-50">
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
                  Isaac Frimpong Manso
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PDF Preview Modal */}
        {report && showPreview && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">
                  PDF Preview - {report.month} {report.year}
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 p-4">
                <PDFViewer width="100%" height="100%" className="rounded-lg">
                  <ReportPDF report={report} />
                </PDFViewer>
              </div>
              <div className="flex justify-end gap-3 p-4 border-t">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
                <PDFDownloadLink
                  document={<ReportPDF report={report} />}
                  fileName={`church-financial-report-${report.month}-${report.year}.pdf`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {({ loading }) => (loading ? "Preparing..." : "Download PDF")}
                </PDFDownloadLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
