"use client";
import FeaturedCars from "./Components/HomePage/FeaturedCars";
import Hero from "./Components/HomePage/Hero";
import HowItWorks from "./Components/HomePage/HowItsWork";
import { SearchBar } from "./Components/HomePage/SearchBar";
import { HomePageLayout } from "./Layout/HomePageLayout";
import Testimonials from "./Components/HomePage/Testimonials";

export default function Home() {
  return (
    <>
      <HomePageLayout>
        <div>
          <Hero />
          <SearchBar />
          <FeaturedCars />
          <HowItWorks />
          <Testimonials />
        </div>
      </HomePageLayout>
    </>
  );
}
