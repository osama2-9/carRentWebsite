"use client";

import { useState } from "react";
import { X, Trash2, FileImage } from "lucide-react";
import axiosInstance from "@/app/axios/axios";

interface UpdateCarModalProps {
  car: any | null;
  onClose: () => void;
  onUpdate?: (data: any) => Promise<void>;
  categories?: any[];
  locations?: any[];
  isLoading?: boolean;
  locationsLoading?: boolean;
}

export function UpdateCarModal({
  car,
  onClose,
  onUpdate,
  categories = [],
  locations = [],
  isLoading = false,
  locationsLoading = false,
}: UpdateCarModalProps) {
  const [formData, setFormData] = useState({
    make: car?.make || "",
    model: car?.model || "",
    year: car?.year || new Date().getFullYear(),
    licensePlate: car?.licensePlate || "",
    fuelType: car?.fuelType || "GASOLINE",
    transmission: car?.transmission || "AUTOMATIC",
    seats: car?.seats || 4,
    imagesUrl: car?.imagesUrl || [],
    featuredImage: car?.featuredImage || "",
    available: car?.available ?? true,
    locationId: car?.location?.id || "",
    categoryId: car?.category?.id || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);

      const urls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET || "");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to upload ${file.name}`);
      }

      const data = await response.json();

      return data.secure_url;
    });

    return Promise.all(uploadPromises);
  };

  const handleSetAsFeatured = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: url,
    }));
  };

  const handleRemoveExistingImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      imagesUrl: prev.imagesUrl.filter(
        (_: any, index: number) => index !== indexToRemove
      ),
    }));
  };

  const handleRemoveNewImage = (indexToRemove: number) => {
    // Revoke the preview URL
    URL.revokeObjectURL(previewUrls[indexToRemove]);

    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setPreviewUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);

    try {
      let newImageUrls: string[] = [];

      if (selectedFiles.length > 0) {
        newImageUrls = await uploadImagesToCloudinary(selectedFiles);
      }

      const allImageUrls = [...formData.imagesUrl, ...newImageUrls];

      const updatedFormData = {
        ...formData,
        featuredImage: formData.featuredImage,
        imageUrls: allImageUrls,
        categoryId: formData.categoryId,
        locationId: formData.locationId,
      };

      if (!updatedFormData.featuredImage && allImageUrls.length > 0) {
        updatedFormData.featuredImage = allImageUrls[0];
      }

      const response = await axiosInstance.put(
        "/car/update-car",
        updatedFormData,
        {
          params: {
            carId: car?.id,
          },
        }
      );
      if (response.status === 200) {
        setUploadProgress("Car updated successfully!");
      }

      onClose();
    } catch (error) {
      console.error("Error updating car:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Update Car</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Make *
              </label>
              <input
                type="text"
                name="make"
                onChange={(e) =>
                  setFormData({ ...formData, make: e.target.value })
                }
                value={formData.make}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="e.g., Toyota"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model *
              </label>
              <input
                type="text"
                name="model"
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                value={formData.model}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="e.g., Camry"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <input
                type="number"
                name="year"
                onChange={(e) =>
                  setFormData({ ...formData, year: Number(e.target.value) })
                }
                value={formData.year}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                min="1900"
                max={new Date().getFullYear() + 2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Plate *
              </label>
              <input
                type="text"
                name="licensePlate"
                onChange={(e) =>
                  setFormData({ ...formData, licensePlate: e.target.value })
                }
                value={formData.licensePlate}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="e.g., ABC123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fuel Type
              </label>
              <select
                name="fuelType"
                onChange={(e) =>
                  setFormData({ ...formData, fuelType: e.target.value })
                }
                value={formData.fuelType}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transmission
              </label>
              <select
                name="transmission"
                onChange={(e) =>
                  setFormData({ ...formData, transmission: e.target.value })
                }
                value={formData.transmission}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="AUTOMATIC">Automatic</option>
                <option value="MANUAL">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seats *
              </label>
              <input
                type="number"
                name="seats"
                onChange={(e) =>
                  setFormData({ ...formData, seats: Number(e.target.value) })
                }
                value={formData.seats}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                min="1"
                max="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <select
                name="locationId"
                onChange={(e) =>
                  setFormData({ ...formData, locationId: e.target.value })
                }
                value={formData.locationId}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a location</option>
                {locationsLoading && <option>Loading locations...</option>}
                {locations?.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.address}, {location.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="categoryId"
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                value={formData.categoryId}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {isLoading && <option>Loading categories...</option>}
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} / ${category.dailyRate}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Car Images
            </label>

            {/* File Input */}
            <div className="mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {selectedFiles.length > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  {selectedFiles.length} new image(s) selected. They will be
                  uploaded when you click "Update".
                </p>
              )}
            </div>

            {/* Existing Images */}
            {formData.imagesUrl.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Current Images
                </h4>
                <div className="space-y-2">
                  {formData.imagesUrl.map((url: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                    >
                      <img
                        src={url}
                        alt={`Current ${index + 1}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="flex-1 text-sm text-gray-600 truncate">
                        Current image {index + 1}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleSetAsFeatured(url)}
                          className={`px-2 py-1 text-xs rounded ${
                            formData.featuredImage === url
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                          }`}
                        >
                          {formData.featuredImage === url
                            ? "Featured"
                            : "Set Featured"}
                        </button>
                        <button
                          onClick={() => handleRemoveExistingImage(index)}
                          type="button"
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Preview */}
            {previewUrls.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  New Images (Preview)
                </h4>
                <div className="space-y-2">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-blue-50 rounded-md border border-blue-200"
                    >
                      <img
                        src={url}
                        alt={`New ${index + 1}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <FileImage className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600">
                          {selectedFiles[index]?.name} (will be uploaded)
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveNewImage(index)}
                        type="button"
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="available"
              onChange={(e) =>
                setFormData({ ...formData, available: !formData.available })
              }
              checked={formData.available}
              id="available"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="available"
              className="ml-2 block text-sm text-gray-700"
            >
              Car is available for rental
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              type="button"
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isSubmitting ? "Processing..." : "Update"}
            </button>
          </div>

          {/* Progress Message */}
          {uploadProgress && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">{uploadProgress}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
