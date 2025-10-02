'use client'
import React, { useState } from "react";
import {
  Clock,
  Calendar,
  MapPin,
  Search,
} from "lucide-react";
import { useGetLocations } from "@/app/hooks/useGetLocations";
import { useRouter } from "next/navigation";

export const SearchBar = () => {
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const router = useRouter()

  const { locations } = useGetLocations()


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
      router.push(`pages/search?location=${location}&pickupDate=${pickupDate}&pickupTime=${pickupTime}&returnDate=${returnDate}&returnTime=${returnTime}`)

  };

  return (
    <div id="search" className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-5">
        Find Your Car
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <select
                id="location"
                name="location"
                className="block w-full pl-9 py-3 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              >
                <option value="">Select location</option>
                {locations?.map((location) => (
                  <option key={location.id} value={location.address}>
                    {location.address}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-span-1">
            <label
              htmlFor="pickup-date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Pick-up Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                id="pickup-date"
                name="pickup-date"
                className="block w-full pl-9 py-3 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="col-span-1">
            <label
              htmlFor="pickup-time"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Pick-up Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <select
                id="pickup-time"
                name="pickup-time"
                className="block w-full pl-9 py-3 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
              >
                <option value="">Select time</option>
                <option value="08:00">08:00 AM</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">01:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:00">05:00 PM</option>
                <option value="18:00">06:00 PM</option>
              </select>
            </div>
          </div>

          <div className="col-span-1">
            <label
              htmlFor="return-date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Return Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                id="return-date"
                name="return-date"
                className="block w-full pl-9 py-3 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="col-span-1">
            <label
              htmlFor="return-time"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Return Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <select
                id="return-time"
                name="return-time"
                className="block w-full pl-9 py-3 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                required
              >
                <option value="">Select time</option>
                <option value="08:00">08:00 AM</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">01:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:00">05:00 PM</option>
                <option value="18:00">06:00 PM</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <Search className="h-4 w-4 mr-2" />
            Search Cars
          </button>
        </div>
      </form>
    </div>
  );
};