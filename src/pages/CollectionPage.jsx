import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import ProductGrid from "../components/Products/ProductGrid";
import { mockProducts } from "../data/mockProducts";

// Category config — maps URL param to filter values
const CATEGORY_CONFIG = {
  men:         { label: "Men",         filter: (p) => p.gender === "men" },
  women:       { label: "Women",       filter: (p) => p.gender === "women" },
  "top-wear":  { label: "Top Wear",    filter: (p) => p.type === "top-wear" },
  "bottom-wear":{ label: "Bottom Wear",filter: (p) => p.type === "bottom-wear" },
};

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc",   label: "Name: A–Z" },
];

const TYPE_FILTERS = [
  { value: "all",         label: "All" },
  { value: "top-wear",    label: "Top Wear" },
  { value: "bottom-wear", label: "Bottom Wear" },
];

const CollectionPage = () => {
  const { category } = useParams(); // e.g. "men", "women", "top-wear"

  const [sortBy, setSortBy]       = useState("newest");
  const [typeFilter, setTypeFilter] = useState("all");

  const config = CATEGORY_CONFIG[category];

  const filteredAndSorted = useMemo(() => {
    let results = [...mockProducts];

    // 1. Apply category filter from URL
    if (config) {
      results = results.filter(config.filter);
    }

    // 2. Apply type sub-filter
    if (typeFilter !== "all") {
      results = results.filter((p) => p.type === typeFilter);
    }

    // 3. Sort
    switch (sortBy) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return results;
  }, [category, sortBy, typeFilter, config]);

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          {config?.label ?? "All Products"}
        </h1>
        <p className="text-gray-500 mt-1">
          {filteredAndSorted.length} product{filteredAndSorted.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters + Sort bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-gray-200">

        {/* Type filter pills — only show for men/women categories */}
        {(category === "men" || category === "women") && (
          <div className="flex gap-2 flex-wrap">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  typeFilter === f.value
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-300 hover:border-black"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Spacer when no type filter */}
        {category !== "men" && category !== "women" && <div />}

        {/* Sort dropdown */}
        <div className="flex items-center gap-3 ml-auto">
          <label className="text-sm text-gray-500 whitespace-nowrap">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-black transition-colors cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product grid */}
      {filteredAndSorted.length > 0 ? (
        <ProductGrid products={filteredAndSorted} />
      ) : (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg">No products found.</p>
          <p className="text-sm mt-1">Try a different filter or category.</p>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;
