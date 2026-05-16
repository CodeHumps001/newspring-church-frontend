"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { recordsAPI, utilsAPI } from "@/services/api";
import { CATEGORIES } from "@/types";
import { Calculator, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const Textarea = ({
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    {...props}
  />
);

export default function EditRecordPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [denominations, setDenominations] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    category: "Tithe",
    weekNumber: 1,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    serviceDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [quantities]);

  const loadData = async () => {
    try {
      // Load denominations
      const denomResponse = await utilsAPI.getDenominations();
      const denoms = denomResponse.data.denominations;
      setDenominations(denoms);

      // Load record data
      const recordResponse = await recordsAPI.getById(parseInt(id));
      const record = recordResponse.data.data;

      setFormData({
        category: record.category,
        weekNumber: record.weekNumber,
        month: record.month,
        year: record.year,
        serviceDate: record.serviceDate.split("T")[0],
        notes: record.notes || "",
      });

      // Load quantities
      const initialQuantities: { [key: number]: number } = {};
      denoms.forEach((d: number) => {
        const entry = record.denominationEntries.find(
          (e: any) => e.denomination === d,
        );
        initialQuantities[d] = entry ? entry.quantity : 0;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      toast.error("Failed to load record");
      router.push("/dashboard");
    } finally {
      setFetching(false);
    }
  };

  const calculateTotal = () => {
    let sum = 0;
    Object.entries(quantities).forEach(([denom, qty]) => {
      sum += parseFloat(denom) * qty;
    });
    setTotal(sum);
  };

  const handleQuantityChange = (denomination: number, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [denomination]: quantity,
    }));
  };

  const handleCategoryChange = (value: string | null) => {
    if (value) {
      setFormData({ ...formData, category: value });
    }
  };

  const handleWeekChange = (value: string | null) => {
    if (value) {
      setFormData({ ...formData, weekNumber: parseInt(value) });
    }
  };

  const handleMonthChange = (value: string | null) => {
    if (value) {
      setFormData({ ...formData, month: parseInt(value) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const denominationsArray = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([denom, qty]) => ({
        denomination: parseFloat(denom),
        quantity: qty,
      }));

    if (denominationsArray.length === 0) {
      toast.error("Please enter at least one denomination");
      setLoading(false);
      return;
    }

    try {
      await recordsAPI.update(parseInt(id), {
        ...formData,
        denominations: denominationsArray,
      });
      toast.success("Record updated successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update record");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this record? This action cannot be undone.",
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await recordsAPI.delete(parseInt(id));
      toast.success("Record deleted successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete record");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading record...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Financial Entry
            </h1>
            <p className="text-gray-600 mt-1">
              Update church service offering details
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Record
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Week Number</Label>
                <Select
                  value={formData.weekNumber.toString()}
                  onValueChange={handleWeekChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((week) => (
                      <SelectItem key={week} value={week.toString()}>
                        Week {week}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Month</Label>
                <Select
                  value={formData.month.toString()}
                  onValueChange={handleMonthChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {new Date(2000, month - 1).toLocaleString("default", {
                            month: "long",
                          })}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  min={2000}
                  max={2100}
                />
              </div>

              <div className="space-y-2">
                <Label>Service Date</Label>
                <Input
                  type="date"
                  value={formData.serviceDate}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceDate: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Any special notes about this service..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Denominations</span>
                <div className="flex items-center gap-2 text-sm font-normal">
                  <Calculator className="w-4 h-4" />
                  <span>Total: ₵{total.toFixed(2)}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Denomination
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {denominations.map((denom) => {
                      const qty = quantities[denom] || 0;
                      const subtotal = denom * qty;
                      return (
                        <tr key={denom}>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">
                            ₵{denom.toFixed(2)}
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="number"
                              min="0"
                              value={qty}
                              onChange={(e) =>
                                handleQuantityChange(
                                  denom,
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              className="w-32"
                            />
                          </td>
                          <td className="px-4 py-2 text-right text-sm text-gray-900">
                            {subtotal > 0 ? `₵${subtotal.toFixed(2)}` : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t">
                    <tr>
                      <td
                        colSpan={2}
                        className="px-4 py-3 text-right font-semibold text-gray-900"
                      >
                        Total:
                      </td>
                      <td className="px-4 py-3 text-right text-lg font-bold text-blue-600">
                        ₵{total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Updating..." : "Update Record"}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
