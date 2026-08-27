import React, { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../services/productService";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts.slice(0, 8));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    
    const handleVisibility = () => {
      if (!document.hidden) {
        fetchProducts();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", fetchProducts);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", fetchProducts);
    };
  }, []);

  const buttonStyle =
    "p-3 rounded-full border bg-white/70 backdrop-blur-md text-gray-800 shadow-md hover:bg-white transition duration-200";

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;

    if (direction === "left") container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    else container.scrollBy({ left: scrollAmount, behavior: "smooth" });

    setTimeout(() => {
      setIsAtStart(container.scrollLeft <= 0);
      setIsAtEnd(container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10);
    }, 300);
  };

  if (loading) {
    return (
      <section className="py-12 relative">
        <div className="container mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        </div>
        <div className="container mx-auto overflow-x-scroll flex space-x-6 px-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[250px]">
              <div className="h-[300px] bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-12 relative">
      <div className="container mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover the latest styles straight off the runway — freshly added to keep your wardrobe on the cutting edge of fashion.
        </p>
      </div>

      <div className="relative container mx-auto">
        <div
          className={`absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent pointer-events-none transition-opacity duration-300 ${
            isAtStart ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        <div
          className={`absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent pointer-events-none transition-opacity duration-300 ${
            isAtEnd ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto px-8 scrollbar-hide scroll-smooth"
          onScroll={(e) => {
            const container = e.target;
            setIsAtStart(container.scrollLeft <= 0);
            setIsAtEnd(container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10);
          }}
        >
          {products.map((product) => {
            if (product._id !== product.id) {
              console.log("ID MISMATCH! id:", product.id, "_id:", product._id, "name:", product.name);
            }
            return <div key={product._id} className="flex-shrink-0 w-[250px] relative group">
              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className="w-full h-[300px] object-cover rounded-lg border"
              />

              <div
                className="absolute bottom-0 left-0 right-0 bg-white/40 backdrop-blur-lg text-gray-900 
                           p-3 rounded-b-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition duration-300"
              >
                <Link to={`/product/${product._id}`} className="block text-center" data-id={product._id}>
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="mt-1 font-medium">R{product.price?.toFixed(2)}</p>
                </Link>
              </div>
            </div>;
          })}
        </div>

        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col space-y-4">
          <button
            className={`${buttonStyle} ${isAtStart ? "opacity-40 cursor-not-allowed" : "opacity-100"}`}
            disabled={isAtStart}
            onClick={() => handleScroll("left")}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            className={`${buttonStyle} ${isAtEnd ? "opacity-40 cursor-not-allowed" : "opacity-100"}`}
            disabled={isAtEnd}
            onClick={() => handleScroll("right")}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;