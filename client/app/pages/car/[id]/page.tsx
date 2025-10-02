"use client";
import React, { useState } from "react";
import {
  MapPin,
  Car,
  Fuel,
  Users,
  Calendar,
  Settings,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { useGetCarById } from "@/app/hooks/useGetCarById";
import { HomePageLayout } from "@/app/Layout/HomePageLayout";
import { useParams } from "next/navigation";
import { SelectRentalDuration } from "@/app/Components/SelectRentalDuration";
import { CarType } from "@/app/types/Car";

export default function CarPage() {
  const { id } = useParams();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carData, setCarData] = useState<CarType>();
  const carId = typeof id === "string" ? parseInt(id) : undefined;
  const { car, error, isLoading } = useGetCarById(
    carId !== undefined ? { carId } : { carId: 0 }
  );
  if (carId === undefined || !car) {
    return null;
  }

  const onClickReserve = (car: CarType) => {
    setCarData(car);
    setIsModalOpen(true);
  };
  const specifications = [
    { icon: Calendar, label: "Year", value: car.year },
    { icon: Users, label: "Seats", value: `${car.seats} passengers` },
    { icon: Settings, label: "Transmission", value: car.transmission },
    { icon: Fuel, label: "Fuel Type", value: car.fuelType },
    { icon: Car, label: "License Plate", value: car.licensePlate },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {car.year} {car.make} {car.model}
                </h1>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {car.category.name}
                  </span>
                  {car.available ? (
                    <span className="inline-flex items-center text-sm text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Available Now
                    </span>
                  ) : (
                    <>
                      {" "}
                      <span className="inline-flex items-center text-sm text-red-600">
                        Unavailable
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  ${car.category.dailyRate}
                </div>
                <div className="text-sm text-gray-500">per day</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img
                      src={
                        car.featuredImage || car.imagesUrl[currentImageIndex]
                      }
                      alt={`${car.make} ${car.model}`}
                      className="w-full"
                    />
                  </div>
                  {car.imagesUrl.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="flex space-x-2">
                        {car.imagesUrl.map((_: any, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              index === currentImageIndex
                                ? "bg-white"
                                : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {car.imagesUrl.length > 1 && (
                  <div className="p-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {car.imagesUrl.map((image: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            index === currentImageIndex
                              ? "border-blue-500"
                              : "border-gray-200"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`View ${index + 1}`}
                            className="w-full h-full "
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Vehicle Specifications
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {specifications.map((spec, index) => {
                    const IconComponent = spec.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">
                            {spec.label}
                          </div>
                          <div className="text-base font-medium text-gray-900">
                            {spec.value}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    "Air Conditioning",
                    "Bluetooth Connectivity",
                    "Power Steering",
                    "Electric Windows",
                    "USB Charging Ports",
                    "Safety Airbags",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pickup Location
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {car.location.city}
                      </div>
                      <div className="text-sm text-gray-600">
                        {car.location.address}
                      </div>
                    </div>
                  </div>
                  <a
                    href={car.location.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View on Google Maps</span>
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pricing
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Daily Rate</span>
                    <span className="text-xl font-bold text-blue-600">
                      ${car.category.dailyRate}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="text-xs text-gray-500 mb-3">
                      Estimated for 3 days
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-blue-600">
                        ${car.category.dailyRate * 3}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => onClickReserve(car)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Reserve Now
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Contact Support
                </button>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">Quick Facts</div>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Free cancellation up to 24h</li>
                    <li>• Full insurance included</li>
                    <li>• 24/7 roadside assistance</li>
                    <li>• Clean & sanitized vehicles</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <>
          <SelectRentalDuration
            car={car}
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
          />
        </>
      )}
    </>
  );
}
