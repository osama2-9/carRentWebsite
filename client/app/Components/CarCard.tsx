"use client";
import React from "react";
import { CarType } from "../types/Car";
import { Star, Users, Gauge, Car, MapPin } from "lucide-react";
import Link from "next/link";

export const CarCard = ({ car }: { car: CarType }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative h-48">
        <img
          src={car.featuredImage || car.imagesUrl[0]}
          alt={car.model}
          className="w-full h-full object-cover"
          width={400}
          height={192}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700">
            {car.category.name}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {car.model}
            </h3>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-3 h-3 mr-1" />
              {car.available ? (
                <>
                  <span className="text-green-500">Available Now</span>
                </>
              ) : (
                <>
                  <span className="text-red-500">Unavailable</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-amber-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700">4.8</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{car.seats} seats</span>
          </div>
          <div className="flex items-center">
            <Gauge className="h-4 w-4 mr-1" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
            <span>{car.fuelType}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ${car.category.dailyRate}
            </span>
            <span className="text-sm text-gray-500 ml-1">/ day</span>
          </div>

          <Link href={`/pages/car/${car.id}`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
              Reserve
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
