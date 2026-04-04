import React from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-24 text-gray-400">
        <p className="text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <Link
          key={product._id}
          to={`/product/${product._id}`}
          className="group block"
        >
          {/* Image */}
          <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4]">
            <img
              src={product.images[0]?.url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Quick view overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs text-center py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              Quick View
            </div>
          </div>

          {/* Info */}
          <div className="mt-3 px-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">R{product.price?.toFixed(2)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
