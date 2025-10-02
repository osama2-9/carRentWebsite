"use client";
import React from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Business Traveler",
    image: "/api/placeholder/60/60",
    rating: 5,
    text: "Exceptional service! The booking process was seamless, and the car was in perfect condition. Will definitely use again for my business trips."
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Tourist",
    image: "/api/placeholder/60/60",
    rating: 5,
    text: "Great selection of vehicles and competitive prices. The pickup process was quick and the staff was very helpful throughout our vacation."
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Local Resident",
    image: "/api/placeholder/60/60",
    rating: 5,
    text: "I've been using their service for over a year now. Reliable, clean cars and excellent customer support. Highly recommend!"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            What Our Customers Say
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Don't just take our word for it. Here's what our satisfied customers have to say about their experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-blue-200 ml-auto" />
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center">
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-6">Trusted by leading companies</p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">ENTERPRISE</div>
            <div className="text-2xl font-bold text-gray-400">HERTZ</div>
            <div className="text-2xl font-bold text-gray-400">AVIS</div>
            <div className="text-2xl font-bold text-gray-400">BUDGET</div>
          </div>
        </div>
      </div>
    </section>
  );
};