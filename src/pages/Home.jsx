import React from "react";
import Hero from "../components/Layout/Hero";
import Collaborations from "../components/Products/Collaborations";
import NewArrivals from "../components/Products/NewArrivals";

// ProductDetails has been moved to its own page (ProductDetailPage)
// Home now shows Hero → Collaborations → New Arrivals

const Home = () => {
  return (
    <div>
      <Hero />
      <Collaborations />
      <NewArrivals />
    </div>
  );
};

export default Home;
