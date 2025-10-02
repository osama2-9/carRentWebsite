"use client";
import axiosInstance from "@/app/axios/axios";
import { AdminDashboardLayout } from "@/app/Layout/AdminDashboardLayout";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface CategoryFormTypes {
  name: string;
  dailyRate: string;
}

export default function Page() {
  const [formData, setFormData] = useState<CategoryFormTypes>({
    name: "",
    dailyRate: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddNewCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const { data } = await axiosInstance.post("/category/add", {
        name: formData.name,
        dailyRate: parseFloat(formData.dailyRate),
      });
      toast.success(data.message);
      setFormData({ name: "", dailyRate: "" });
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className=" mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Add New Category</h1>
          <p className="text-gray-600 text-sm mt-1">
            Create a new vehicle category and set its daily rental rate.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleAddNewCategory}>
            <div className="mb-5">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Category Name
              </label>
              <input
                value={formData.name}
                onChange={handleInputChange}
                type="text"
                id="name"
                name="name"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg 
                          focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="e.g. SUV, Sedan, Truck"
                required
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="dailyRate"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Daily Rate
              </label>
              <input
                value={formData.dailyRate}
                onChange={handleInputChange}
                type="number"
                min="0"
                step="1"
                id="dailyRate"
                name="dailyRate"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg 
                          focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="e.g. 50"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the rate in USD per day.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center w-full gap-2 px-5 py-2.5 
                  rounded-lg text-sm font-medium text-white 
                  bg-blue-600 hover:bg-blue-700 
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span className="animate-pulse">Saving...</span>
                  </>
                ) : (
                  "Save Category"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
