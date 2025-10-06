"use client";
import React, { useEffect } from "react";
import { Car } from "lucide-react";
import { useGetCars } from "@/app/hooks/useGetCars";
import { CarCard } from "@/app/Components/CarCard";
import { useInView } from "react-intersection-observer";

const FeaturedCars: React.FC = () => {
  const {
    cars,
    fetchMoreCars,
    hasMore,
    isLoadingMore,
    isLoading,
    error,
    isDesktop,
  } = useGetCars();

  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasMore && !isLoadingMore && !isDesktop) {
      fetchMoreCars();
    }
  }, [inView, hasMore, isLoadingMore, fetchMoreCars, isDesktop]);

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading cars...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-red-600">
              Error loading cars. Please try again.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="cars" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Featured Vehicles
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
            Discover our premium collection of vehicles, each carefully selected
            to provide you with comfort, reliability, and style for your
            journey.
          </p>
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">No cars available</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {hasMore && !isDesktop && <div ref={ref} className="h-1 mt-10" />}

            {isLoadingMore && !isDesktop && (
              <div className="text-center mt-6">
                <p className="text-gray-600">Loading more cars...</p>
              </div>
            )}

            {hasMore && isDesktop && (
              <div className="text-center mt-10">
                <button
                  onClick={fetchMoreCars}
                  disabled={isLoadingMore}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? "Loading..." : "Load More Cars"}
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-16 text-center">
          <a
            href="/pages/cars"
            className="inline-flex items-center px-8 py-4 border-2 border-gray-300 shadow-lg text-lg font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300"
          >
            <Car className="w-5 h-5 mr-2" />
            View All Vehicles
            <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
