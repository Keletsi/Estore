import React from "react";
import { Link } from "react-router-dom";
import mensImg from "../../assets/mens-collection.webp";
import womensImg from "../../assets/womens-collection.webp";

const GenderCollectionSection = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Men's Collection */}
        <Link
          to="/shop?category=men"
          className="relative group overflow-hidden rounded-lg block"
        >
          <div className="aspect-[3/4] w-full overflow-hidden">
            <img
              src={mensImg}
              alt="Men's Collection"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
          <div className="absolute bottom-8 left-8">
            <p className="text-white text-sm font-medium uppercase tracking-widest mb-1">
              New Season
            </p>
            <h2 className="text-white text-3xl font-semibold">Men's Collection</h2>
            <span className="inline-block mt-3 text-white text-sm border-b border-white pb-0.5">
              Shop Now →
            </span>
          </div>
        </Link>

        {/* Women's Collection */}
        <Link
          to="/shop?category=women"
          className="relative group overflow-hidden rounded-lg block"
        >
          <div className="aspect-[3/4] w-full overflow-hidden">
            <img
              src={womensImg}
              alt="Women's Collection"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
          <div className="absolute bottom-8 left-8">
            <p className="text-white text-sm font-medium uppercase tracking-widest mb-1">
              New Season
            </p>
            <h2 className="text-white text-3xl font-semibold">Women's Collection</h2>
            <span className="inline-block mt-3 text-white text-sm border-b border-white pb-0.5">
              Shop Now →
            </span>
          </div>
        </Link>

      </div>
    </section>
  );
};

export default GenderCollectionSection;
