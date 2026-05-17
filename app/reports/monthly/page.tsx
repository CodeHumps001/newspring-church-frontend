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

// Professional Minimal PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 20,
  },
  churchName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111827",
    letterSpacing: 1,
  },
  reportTitle: {
    fontSize: 12,
    fontWeight: "normal",
    marginBottom: 4,
    color: "#6b7280",
  },
  monthYear: {
    fontSize: 10,
    marginTop: 4,
    color: "#9ca3af",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#374151",
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  table: {
    width: "100%",
    marginTop: 8,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 6,
  },
  tableHeader: {
    backgroundColor: "#f9fafb",
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    color: "#374151",
  },
  tableCellWeek: {
    width: "15%",
    paddingHorizontal: 4,
    fontSize: 9,
  },
  tableCell: {
    width: "17%",
    textAlign: "right",
    paddingHorizontal: 4,
    fontSize: 9,
  },
  tableCellTotal: {
    width: "17%",
    textAlign: "right",
    fontWeight: "bold",
    paddingHorizontal: 4,
    fontSize: 9,
  },
  expenseRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 5,
  },
  expenseCategory: {
    width: "30%",
    paddingHorizontal: 4,
    fontSize: 9,
  },
  expenseAmount: {
    width: "20%",
    textAlign: "right",
    paddingHorizontal: 4,
    fontSize: 9,
  },
  expenseDesc: {
    width: "50%",
    paddingHorizontal: 4,
    fontSize: 9,
  },
  footer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 20,
  },
  signatureLine: {
    marginTop: 20,
  },
  signatureText: {
    fontSize: 9,
    color: "#6b7280",
  },
  totalRow: {
    backgroundColor: "#f9fafb",
    fontWeight: "bold",
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    borderBottomWidth: 0,
  },
  summaryBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    fontSize: 10,
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  netPositive: {
    color: "#059669",
    fontWeight: "bold",
  },
  netNegative: {
    color: "#dc2626",
    fontWeight: "bold",
  },
  watermark: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 7,
    color: "#d1d5db",
  },
});

// Professional Minimal PDF Document
const ReportPDF = ({ report }: { report: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.churchName}>NEWSPRING CHAPEL A/G</Text>
        <Text style={styles.reportTitle}>Financial Report</Text>
        <Text style={styles.monthYear}>
          {report.month} {report.year}
        </Text>
      </View>

      {/* Income Section */}
      <Text style={styles.sectionTitle}>Income Statement</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCellWeek}>Week</Text>
          <Text style={styles.tableCell}>Tithe (GHS)</Text>
          <Text style={styles.tableCell}>Offering (GHS)</Text>
          <Text style={styles.tableCell}>Special (GHS)</Text>
          <Text style={styles.tableCell}>Children (GHS)</Text>
          <Text style={styles.tableCellTotal}>Total (GHS)</Text>
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
          <Text style={styles.tableCellWeek}>Total Income</Text>
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
      <Text style={styles.sectionTitle}>Expenses</Text>
      <View style={styles.table}>
        <View style={[styles.expenseRow, styles.tableHeader]}>
          <Text style={styles.expenseCategory}>Category</Text>
          <Text style={styles.expenseDesc}>Description</Text>
          <Text style={styles.expenseAmount}>Amount (GHS)</Text>
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
          <Text style={styles.expenseCategory}>Total Expenses</Text>
          <Text style={styles.expenseDesc}></Text>
          <Text style={styles.expenseAmount}>
            {report.expenses.total.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Summary Section */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text>Total Income</Text>
          <Text>GHS {report.grandTotal.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Total Expenses</Text>
          <Text>GHS {report.expenses.total.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryTotal}>
          <Text style={{ fontWeight: "bold" }}>Net Balance</Text>
          <Text
            style={
              report.netBalance >= 0 ? styles.netPositive : styles.netNegative
            }
          >
            GHS {report.netBalance.toLocaleString()}{" "}
            {report.netBalance >= 0 ? "(Surplus)" : "(Deficit)"}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.signatureText}>Prepared by</Text>
          <Text style={[styles.signatureText, styles.signatureLine]}>
            _________________
          </Text>
          <Text style={styles.signatureText}>Date: _________________</Text>
        </View>
        <View>
          <Text style={styles.signatureText}>Confirmed by</Text>
          <Text style={[styles.signatureText, styles.signatureLine]}>
            _________________
          </Text>
          <Text style={styles.signatureText}>Isaac Frimpong Manso</Text>
        </View>
      </View>

      {/* Watermark */}
      <Text style={styles.watermark}>
        Generated on {new Date().toLocaleString()}
      </Text>
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
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {showPreview ? "Hide Preview" : "Preview PDF"}
                </button>

                <PDFDownloadLink
                  document={<ReportPDF report={report} />}
                  fileName={`church-financial-report-${report.month}-${report.year}.pdf`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  {({ loading }) => (loading ? "Preparing..." : "Download PDF")}
                </PDFDownloadLink>
              </>
            )}
          </div>
        </div>

        {/* HTML Preview - Minimal Professional */}
        {report && !showPreview && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="text-center py-8 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                NEWSPRING CHAPEL A/G
              </h2>
              <h3 className="text-sm text-gray-500 mt-1">Financial Report</h3>
              <p className="text-xs text-gray-400 mt-2">
                {report.month} {report.year}
              </p>
            </div>

            <div className="p-6">
              {/* Income Section */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-1 border-b">
                  Income Statement
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border-b p-2 text-left text-gray-600">
                          Week
                        </th>
                        <th className="border-b p-2 text-right text-gray-600">
                          Tithe
                        </th>
                        <th className="border-b p-2 text-right text-gray-600">
                          Offering
                        </th>
                        <th className="border-b p-2 text-right text-gray-600">
                          Special
                        </th>
                        <th className="border-b p-2 text-right text-gray-600">
                          Children
                        </th>
                        <th className="border-b p-2 text-right text-gray-600">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.weeks.map((week: any) => (
                        <tr key={week.weekNumber} className="border-b">
                          <td className="p-2 text-gray-700">
                            Week {week.weekNumber}
                          </td>
                          <td className="p-2 text-right">
                            GHS {week.Tithe.toLocaleString()}
                          </td>
                          <td className="p-2 text-right">
                            GHS {week.Offering.toLocaleString()}
                          </td>
                          <td className="p-2 text-right">
                            GHS {week.Special_Seeds.toLocaleString()}
                          </td>
                          <td className="p-2 text-right">
                            GHS {week.Children_Service.toLocaleString()}
                          </td>
                          <td className="p-2 text-right font-medium">
                            GHS {week.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 font-medium">
                        <td className="p-2">Total Income</td>
                        <td className="p-2 text-right">
                          GHS {report.categoryTotals.Tithe.toLocaleString()}
                        </td>
                        <td className="p-2 text-right">
                          GHS {report.categoryTotals.Offering.toLocaleString()}
                        </td>
                        <td className="p-2 text-right">
                          GHS{" "}
                          {report.categoryTotals.Special_Seeds.toLocaleString()}
                        </td>
                        <td className="p-2 text-right">
                          GHS{" "}
                          {report.categoryTotals.Children_Service.toLocaleString()}
                        </td>
                        <td className="p-2 text-right font-bold">
                          GHS {report.grandTotal.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Expenses Section */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-1 border-b">
                  Expenses
                </h3>
                {report.expenses.list.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border-b p-2 text-left text-gray-600">
                            Category
                          </th>
                          <th className="border-b p-2 text-left text-gray-600">
                            Description
                          </th>
                          <th className="border-b p-2 text-right text-gray-600">
                            Date
                          </th>
                          <th className="border-b p-2 text-right text-gray-600">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.expenses.list.map(
                          (expense: any, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="p-2 text-gray-700">
                                {expense.category}
                              </td>
                              <td className="p-2 text-gray-600">
                                {expense.description}
                              </td>
                              <td className="p-2 text-right text-gray-600">
                                {new Date(expense.date).toLocaleDateString()}
                              </td>
                              <td className="p-2 text-right">
                                GHS{" "}
                                {parseFloat(expense.amount).toLocaleString()}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50 font-medium">
                          <td colSpan={3} className="p-2 text-right">
                            Total Expenses
                          </td>
                          <td className="p-2 text-right font-bold">
                            GHS {report.expenses.total.toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">
                      No expenses recorded
                    </p>
                  </div>
                )}
              </div>

              {/* Summary Section */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Income</span>
                    <span className="font-medium">
                      GHS {report.grandTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Expenses</span>
                    <span className="font-medium">
                      GHS {report.expenses.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">
                      Net Balance
                    </span>
                    <span
                      className={`font-bold ${report.netBalance >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      GHS {report.netBalance.toLocaleString()}{" "}
                      {report.netBalance >= 0 ? "(Surplus)" : "(Deficit)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-between text-xs text-gray-500">
              <div>
                <p>Prepared by: _________________</p>
                <p className="mt-4">Date: _________________</p>
              </div>
              <div>
                <p>Confirmed by: _________________</p>
                <p className="mt-4"></p>
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
