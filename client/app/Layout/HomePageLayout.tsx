"use client";
import React from "react";
import Navbar from "../Components/HomePage/Navbar";
import Footer from "../Components/HomePage/Footer";

interface HomePageLayoutProps {
  children: React.ReactNode;
}

export const HomePageLayout = ({ children }: HomePageLayoutProps) => {
  return (
    <div>
      <div className="mb-2">
        <Navbar />
      </div>

      {children}

      <div className="mt-2">
        <Footer />
      </div>
    </div>
  );
};
