"use client";
import axiosInstance from "@/app/axios/axios";
import { AdminDashboardLayout } from "@/app/Layout/AdminDashboardLayout";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
interface FormDataTypes {
  city: string;
  address: string;
  country: string;
  googleMapsUrl: string;
}
export default function page() {
  const [formData, setFormData] = useState<FormDataTypes>({
    city: "",
    address: "",
    country: "",
    googleMapsUrl: "",
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleAddNewLoaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const response = axiosInstance.post("/location/add-location", {
        address: formData.address,
        city: formData.city,
        country: formData.country,
        googleMapsUrl: formData.googleMapsUrl,
      });
      const data = (await response).data;
      if (data) {
        toast.success(data.message);
        setFormData({
          address: "",
          city: "",
          country: "",
          googleMapsUrl: "",
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.error);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div>
      <AdminDashboardLayout>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Add New Location</h1>
          <p className="text-gray-600 text-sm mt-1">
            Create a new vehicle Location.
          </p>
        </div>
        <form
          onSubmit={handleAddNewLoaction}
          className=" mx-auto bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="mb-5">
            <label
              htmlFor="city"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              value={formData.city}
              onChange={handleInputChange}
              type="text"
              id="city"
              name="city"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="e.g. Cairo"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              value={formData.address}
              onChange={handleInputChange}
              type="text"
              id="address"
              name="address"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Street name, building, etc."
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="country"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <input
              value={formData.country}
              onChange={handleInputChange}
              type="text"
              id="country"
              name="country"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="e.g. Egypt"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="mapsUrl"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Google Maps URL
            </label>
            <input
              value={formData.googleMapsUrl}
              onChange={handleInputChange}
              type="url"
              id="mapsUrl"
              name="googleMapsUrl"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="https://www.google.com/maps"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 w-full px-5 py-2.5 
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
              "Save Location"
            )}
          </button>
        </form>
      </AdminDashboardLayout>
    </div>
  );
}
