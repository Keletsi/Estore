import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import ProductGrid from "../components/Products/ProductGrid";
import { getAllProducts, getProductsByCategory } from "../services/productService";

const CATEGORY_CONFIG = {
  all:         { label: "All Products",  filter: null },
  men:         { label: "Men",            filter: (p) => p.gender === "men" },
  women:       { label: "Women",          filter: (p) => p.gender === "women" },
  "top-wear":  { label: "Top Wear",       filter: (p) => p.type === "top-wear" },
  "bottom-wear":{ label: "Bottom Wear",  filter: (p) => p.type === "bottom-wear" },
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
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [sortBy, setSortBy] = useState("newest");
  const [typeFilter, setTypeFilter] = useState("all");

  const config = CATEGORY_CONFIG[category];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        let fetchedProducts;
        if (searchQuery) {
          fetchedProducts = await getAllProducts();
        } else if (category === "men" || category === "women") {
          fetchedProducts = await getProductsByCategory(category);
          if (typeFilter !== "all") {
            fetchedProducts = fetchedProducts.filter(p => p.type === typeFilter);
          }
        } else if (category === "all" || !category) {
          fetchedProducts = await getAllProducts();
          if (typeFilter !== "all") {
            fetchedProducts = fetchedProducts.filter((p) => p.type === typeFilter);
          }
        } else {
          fetchedProducts = await getAllProducts();
          if (config?.filter) {
            fetchedProducts = fetchedProducts.filter(config.filter);
          }
          if (typeFilter !== "all") {
            fetchedProducts = fetchedProducts.filter((p) => p.type === typeFilter);
          }
        }
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, typeFilter, config, searchQuery]);

  const filteredAndSorted = useMemo(() => {
    let results = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(p => 
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query) ||
        p.type?.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        results.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "newest":
      default:
        results.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    return results;
  }, [products, sortBy, searchQuery]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 aspect-[3/4] rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center text-gray-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="mb-8">
        {searchQuery ? (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">Search Results</h1>
            <p className="text-gray-500 mt-1">
              {filteredAndSorted.length} result{filteredAndSorted.length !== 1 ? "s" : ""} for "{searchQuery}"
            </p>
            <Link to="/collection/all" className="text-sm text-gray-500 hover:text-black mt-2 inline-block">
              ← Clear search
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">
              {config?.label ?? "All Products"}
            </h1>
            <p className="text-gray-500 mt-1">
              {filteredAndSorted.length} product{filteredAndSorted.length !== 1 ? "s" : ""}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-gray-200">

        {(category === "men" || category === "women") && !searchQuery && (
          <div className="flex gap-2 flex-wrap">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  typeFilter === f.value
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 ml-auto">
          <label className="text-sm text-gray-500 whitespace-nowrap">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-gray-700 transition-colors cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredAndSorted.length > 0 ? (
        <ProductGrid products={filteredAndSorted} />
      ) : (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg">No products found.</p>
          <p className="text-sm mt-1">
            {searchQuery ? "Try a different search term." : "Try a different filter or category."}
          </p>
          {searchQuery && (
            <Link to="/collection/all" className="text-sm text-black hover:underline mt-2 inline-block">
              Browse all products
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionPage;
