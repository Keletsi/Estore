import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductGrid from "../components/Products/ProductGrid";
import { getAllProducts } from "../services/productService";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [sortBy, setSortBy] = useState("newest");
  const [selectedGender, setSelectedGender] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialCategory === "men" || initialCategory === "women") {
      setSelectedGender(initialCategory);
    }
  }, [initialCategory]);

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

    if (selectedGender !== "all") {
      results = results.filter(p => p.gender === selectedGender);
    }

    if (selectedType !== "all") {
      results = results.filter(p => p.type === selectedType);
    }

    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      results = results.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
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
  }, [products, sortBy, selectedGender, selectedType, priceRange, searchQuery]);

  const clearFilters = () => {
    setSelectedGender("all");
    setSelectedType("all");
    setPriceRange([0, 1000]);
    setSearchQuery("");
    setSortBy("newest");
  };

  const hasActiveFilters = selectedGender !== "all" || selectedType !== "all" || 
    priceRange[0] > 0 || priceRange[1] < 1000 || searchQuery;

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
      <div className="container mx-auto px-24 text-center text-gray-500 py-12">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          {selectedGender === "men" ? "Men's Collection" : 
           selectedGender === "women" ? "Women's Collection" : "Shop All"}
        </h1>
        <p className="text-gray-500 mt-1">
          {filteredAndSorted.length} product{filteredAndSorted.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">Filters</h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-500 hover:text-black underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
              />
            </div>

            {/* Gender */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
              <div className="space-y-2">
                {[
                  { value: "all", label: "All" },
                  { value: "men", label: "Men" },
                  { value: "women", label: "Women" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedGender(opt.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedGender === opt.value
                        ? "bg-black text-white"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
              <div className="space-y-2">
                {[
                  { value: "all", label: "All" },
                  { value: "top-wear", label: "Top Wear" },
                  { value: "bottom-wear", label: "Bottom Wear" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedType(opt.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedType === opt.value
                        ? "bg-black text-white"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Price Range: R{priceRange[0]} - R{priceRange[1]}
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-black"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-1/2 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-black"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                    className="w-1/2 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500 mb-3">Quick Links</p>
              <div className="space-y-1">
                <Link to="/collection/men" className="block text-sm text-gray-600 hover:text-black">
                  Men's Collection
                </Link>
                <Link to="/collection/women" className="block text-sm text-gray-600 hover:text-black">
                  Women's Collection
                </Link>
                <Link to="/sale?category=men" className="block text-sm text-[#ea2e0e] font-medium hover:underline">
                  Men's Sale
                </Link>
                <Link to="/sale?category=women" className="block text-sm text-[#ea2e0e] font-medium hover:underline">
                  Women's Sale
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {selectedGender !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {selectedGender === "men" ? "Men" : "Women"}
                  <button onClick={() => setSelectedGender("all")} className="hover:text-gray-600">×</button>
                </span>
              )}
              {selectedType !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {selectedType === "top-wear" ? "Top Wear" : "Bottom Wear"}
                  <button onClick={() => setSelectedType("all")} className="hover:text-gray-600">×</button>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 whitespace-nowrap">{filteredAndSorted.length} items</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredAndSorted.length > 0 ? (
            <ProductGrid products={filteredAndSorted} />
          ) : (
            <div className="text-center py-24 text-gray-400">
              <p className="text-lg">No products found.</p>
              <p className="text-sm mt-1">Try adjusting your filters.</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-black hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
