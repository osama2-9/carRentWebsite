"use client";
import React from "react";
import { ArrowRight, Car, Shield, Clock, Star, Users, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center lg:pt-32">
          
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            Drive The
            <span className="relative whitespace-nowrap text-blue-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70"
                preserveAspectRatio="none"
              >
                <path d="m203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.935-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <span className="relative">Experience</span>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            Premium car rental service with a wide range of vehicles for your
            every need. From luxury sedans to compact cars, we have the perfect
            ride waiting for you at <span className="font-semibold text-blue-600">unbeatable prices</span>.
          </p>

          <div className="mt-8 flex justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-blue-500" />
              Fully Insured
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              Instant Booking
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
              50+ Locations
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#search"
              className="group inline-flex items-center justify-center rounded-full py-3 px-8 text-base font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Find Your Car
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full py-3 px-8 text-base font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 text-slate-700 hover:text-slate-900 focus-visible:outline-slate-900 border border-slate-200 hover:border-slate-300 bg-white hover:bg-gray-50 transition-all duration-300"
            >
              How It Works
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="group relative rounded-2xl border border-slate-200 bg-white p-8 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Car className="h-6 w-6 text-white" />
                </span>
                <span className="text-2xl font-bold text-blue-600">500+</span>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold leading-8 tracking-tight text-gray-900">
                  Wide Selection
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  Choose from our extensive fleet of premium vehicles, from
                  compact cars to luxury SUVs, all maintained to perfection.
                </p>
              </div>
            </div>

            <div className="group relative rounded-2xl border border-slate-200 bg-white p-8 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Shield className="h-6 w-6 text-white" />
                </span>
                <span className="text-2xl font-bold text-blue-600">100%</span>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold leading-8 tracking-tight text-gray-900">
                  Fully Insured
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  All our vehicles come with comprehensive insurance coverage
                  and roadside assistance for your complete peace of mind.
                </p>
              </div>
            </div>

            <div className="group relative rounded-2xl border border-slate-200 bg-white p-8 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Clock className="h-6 w-6 text-white" />
                </span>
                <span className="text-2xl font-bold text-blue-600">24/7</span>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold leading-8 tracking-tight text-gray-900">
                  Always Available
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  Our customer support team and emergency assistance are available
                  around the clock to help you whenever you need it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Background decoration */}
      <div
        className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-50 via-indigo-50 to-purple-50 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      {/* Secondary background decoration */}
      <div
        className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 -rotate-[30deg] bg-gradient-to-tl from-purple-50 via-pink-50 to-blue-50 opacity-30 sm:left-[calc(50%+30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(25.9% 55.9%, 0% 38.4%, 2.5% 73.1%, 14.5% 99.9%, 19.3% 98%, 27.5% 67.5%, 39.8% 37.6%, 47.6% 31.9%, 52.5% 41.7%, 54.8% 65.5%, 72.5% 23.3%, 99.9% 35.1%, 82.1% 0%, 72.4% 23.2%, 23.9% 2.3%, 25.9% 55.9%)",
          }}
        />
      </div>
    </div>
  );
};
