"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/Layout/MainLayout";
import { recordsAPI, utilsAPI } from "@/services/api";
import { CATEGORIES } from "@/types";
import toast from "react-hot-toast";

export default function NewRecordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    loadDenominations();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [quantities]);

  const loadDenominations = async () => {
    try {
      const response = await utilsAPI.getDenominations();
      const denoms = response.data.denominations;
      setDenominations(denoms);
      // Initialize quantities to 0
      const initialQuantities: { [key: number]: number } = {};
      denoms.forEach((d: number) => {
        initialQuantities[d] = 0;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      toast.error("Failed to load denominations");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Build denominations array (only non-zero quantities)
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

    const recordData = {
      ...formData,
      denominations: denominationsArray,
    };

    try {
      await recordsAPI.create(recordData);
      toast.success("Record created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            New Financial Entry
          </h1>
          <p className="text-gray-600 mt-1">
            Enter church service offering details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Service Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Week Number
                </label>
                <select
                  value={formData.weekNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weekNumber: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  {[1, 2, 3, 4, 5].map((week) => (
                    <option key={week} value={week}>
                      Week {week}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <select
                  value={formData.month}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      month: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {new Date(2000, month - 1).toLocaleString("default", {
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
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Date
                </label>
                <input
                  type="date"
                  value={formData.serviceDate}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Any special notes..."
                />
              </div>
            </div>
          </div>

          {/* Denominations Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Denominations
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Denomination
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                      Subtotal (₵)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {denominations.map((denom) => {
                    const qty = quantities[denom] || 0;
                    const subtotal = denom * qty;
                    return (
                      <tr key={denom}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          ₵{denom.toFixed(2)}
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min="0"
                            value={qty}
                            onChange={(e) =>
                              handleQuantityChange(
                                denom,
                                parseInt(e.target.value) || 0,
                              )
                            }
                            className="w-24 px-2 py-1 border rounded"
                          />
                        </td>
                        <td className="px-4 py-2 text-right text-sm text-gray-900">
                          {subtotal > 0 ? `₵${subtotal.toFixed(2)}` : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-3 text-right font-semibold"
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
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
