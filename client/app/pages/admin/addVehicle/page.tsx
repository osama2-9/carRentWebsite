"use client";
import React, { useState, useEffect } from "react";
import {
  Car,
  Save,
  Upload,
  X,
  AlertCircle,
  Check,
  Plus,
  FileImage,
} from "lucide-react";
import { AdminDashboardLayout } from "@/app/Layout/AdminDashboardLayout";
import { useGetLocations } from "@/app/hooks/useGetLocations";
import { useGetCategories } from "@/app/hooks/useGetCategories";
import axiosInstance from "@/app/axios/axios";

export default function CarRegistrationForm() {
  const { locations } = useGetLocations();
  const { categories } = useGetCategories();

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    fuelType: "PETROL",
    transmission: "AUTOMATIC",
    seats: 5,
    imageUrls: [],
    available: true,
    locationId: "",
    categoryId: "",
    featuredImage: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleImageUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    const uploadedUrls: String[] = [];
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        if (CLOUDINARY_UPLOAD_PRESET) {
          formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        } else {
          throw new Error("Cloudinary upload preset is not defined.");
        }

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.secure_url);
        } else {
          console.error("Failed to upload image:", file.name);
        }
      }
      setFormData((prev: any) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleFileInputChange = (e: any) => {
    const files: any = Array.from(e.target.files);
    handleImageUpload(files);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await axiosInstance.post(
        "/car/add-new-car",
        {
          ...formData,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const data = await res.data;
      if (data.success !== true) {
        setSubmitError(data.message);
        return;
      }

      if (res.status !== 201) {
      }
      setSubmitError(null);
      setFormData({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        licensePlate: "",
        fuelType: "PETROL",
        transmission: "AUTOMATIC",
        seats: 5,
        imageUrls: [],
        available: true,
        locationId: "",
        categoryId: "",
        featuredImage: "",
      });

      setSubmitSuccess(true);

      setFormData({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        licensePlate: "",
        fuelType: "PETROL",
        transmission: "AUTOMATIC",
        seats: 5,
        imageUrls: [],
        available: true,
        locationId: "",
        categoryId: "",
        featuredImage: "",
      });
    } catch (error: any) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Official Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Car className="h-8 w-8 text-slate-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Vehicle Registration Form
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div onSubmit={handleSubmit} className="p-8">
              {submitSuccess && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Vehicle registered successfully!</span>
                </div>
              )}

              {submitError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Vehicle Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="make"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Manufacturer <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="make"
                      name="make"
                      value={formData.make}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g. Toyota, Ford, BMW"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="model"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g. Camry, Focus, X5"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="year"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Year of Manufacture{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="licensePlate"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      License Plate Number{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="licensePlate"
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g. ABC-1234"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="fuelType"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Fuel Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="fuelType"
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="PETROL">Petrol</option>
                      <option value="DIESEL">Diesel</option>
                      <option value="ELECTRIC">Electric</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="transmission"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Transmission <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="transmission"
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="AUTOMATIC">Automatic</option>
                      <option value="MANUAL">Manual</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="seats"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Number of Seats <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="seats"
                      name="seats"
                      value={formData.seats}
                      onChange={handleInputChange}
                      min="1"
                      max="15"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Location & Category
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="locationId"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Operating Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="locationId"
                      name="locationId"
                      value={formData.locationId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option disabled={true} value="">
                        Select a location
                      </option>
                      {locations?.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.city}, {location.address}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="categoryId"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Vehicle Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select a category</option>
                      {categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name} (${category.dailyRate}/day)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Vehicle Images
                </h2>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    {uploadingImages ? (
                      <div className="space-y-2">
                        <div className="animate-spin mx-auto h-12 w-12 text-blue-500">
                          <svg
                            className="w-full h-full"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                        <p className="text-blue-600 font-medium">
                          Uploading images...
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                        <div>
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Vehicle Images
                          </label>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="sr-only"
                          />
                        </div>
                        <p className="text-sm text-gray-500">
                          Select multiple images (PNG, JPG, GIF up to 10MB each)
                        </p>
                      </div>
                    )}
                  </div>
                  {formData.imageUrls.length != 0 && (
                    <>
                      <p className="font-semibold text-gray-600 text-sm text-center m-2">
                        Select featured Image (the image that will show in car
                        card)
                      </p>
                    </>
                  )}

                  {formData.imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            onClick={() =>
                              setFormData({
                                ...formData,
                                featuredImage: url,
                              })
                            }
                            src={url}
                            alt={`Vehicle image ${index + 1}`}
                            className={`w-full ${formData.featuredImage == url && 'opacity-55'} h-32 object-cover transition-all hover:scale-105 shadow-md rounded-lg border border-gray-200`}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Availability Status
                </h2>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="available"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="available"
                    className="text-sm font-medium text-gray-700"
                  >
                    Vehicle is available for rental
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingImages}
                  onClick={handleSubmit}
                  className={`px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center transition-colors ${
                    isSubmitting || uploadingImages
                      ? "opacity-75 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Registering Vehicle...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Register Vehicle
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
