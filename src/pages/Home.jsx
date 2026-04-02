import React from "react";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";

// ProductDetails has been moved to its own page (ProductDetailPage)
// Home now shows Hero → Gender Collections → New Arrivals

const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
    </div>
  );
};

export default Home;
