import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, getProductsByCategory, debugListAllProducts } from "../services/productService";
import ProductGrid from "../components/Products/ProductGrid";
import { useCart } from "../context/CartContext";

const productDetails = {
  sizes: ["XS", "S", "M", "L", "XL"],
  colors: [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#F5F5F5" },
    { name: "Navy",  hex: "#1E3A8A" },
  ],
  brand: "TallBoy",
  material: "Premium Cotton",
  description:
    "Crafted for everyday wear and elevated occasions alike. Made with premium materials that feel as good as they look — lightweight, breathable, and built to last.",
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [similar, setSimilar] = useState([]);

  const [mainImage, setMainImage]         = useState(0);
  const [selectedSize, setSelectedSize]   = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity]           = useState(1);
  const [toast, setToast]                 = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("URL id param:", id, "URL:", window.location.href);
        if (!id) {
          setError("Product ID is missing");
          return;
        }
        const fetchedProduct = await getProductById(id);
        if (!fetchedProduct) {
          setError("Product not found");
          return;
        }
        setProduct(fetchedProduct);

        if (fetchedProduct.gender) {
          const similarProducts = await getProductsByCategory(fetchedProduct.gender);
          setSimilar(similarProducts.filter(p => p._id !== id).slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
        <button onClick={() => navigate(-1)} className="text-sm underline text-gray-500 hover:text-black">
          ← Go back
        </button>
        <div className="mt-4">
          <button 
            onClick={async () => {
              const all = await debugListAllProducts();
              alert("All products: " + JSON.stringify(all.map(p => ({ id: p.id, name: p.name }))));
            }} 
            className="text-xs underline text-gray-400"
          >
            Debug: List all products
          </button>
        </div>
      </div>
    );
  }

  const images = [
    { url: product.images?.[0]?.url, alt: product.name },
    { url: product.images?.[0]?.url?.replace("/seed/", "/seed/b"), alt: `${product.name} side` },
    { url: product.images?.[0]?.url?.replace("/seed/", "/seed/c"), alt: `${product.name} back` },
  ].filter(img => img.url);

  const discountedPrice = product.price;
  const originalPrice   = Math.round(product.price * 1.25);
  const discount        = originalPrice > 0 ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;

  const showToast = (type) => {
    setToast(type);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) { showToast("error"); return; }
    addToCart(product, quantity, selectedSize, selectedColor);
    showToast("added");
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) { showToast("error"); return; }
    addToCart(product, quantity, selectedSize, selectedColor);
    navigate("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">

      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toast === "added" ? "bg-gray-800 text-white" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {toast === "added" ? "✓ Added to cart" : "Please select a size and color"}
        </div>
      )}

      <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <Link to={`/collection/${product.gender}`} className="hover:text-black transition-colors capitalize">
          {product.gender}
        </Link>
        <span>/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-10">

        <div className="flex flex-col-reverse md:flex-row gap-4 md:w-1/2">
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
            {images.map((img, i) => (
              <button key={i} onClick={() => setMainImage(i)}
                className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                  mainImage === i ? "border-gray-800" : "border-transparent"
                }`}>
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1 rounded-xl overflow-hidden bg-gray-100 aspect-[3/4]">
            <img src={images[mainImage]?.url} alt={images[mainImage]?.alt} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            {productDetails.brand}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold">R{discountedPrice?.toFixed(2)}</span>
            {originalPrice > discountedPrice && (
              <>
                <span className="text-base text-gray-400 line-through">R{originalPrice?.toFixed(2)}</span>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {product.description || productDetails.description}
          </p>

          <div className="mb-5">
            <p className="text-sm font-semibold mb-2">
              Color{selectedColor ? `: ${selectedColor}` : <span className="text-gray-400 font-normal"> — select one</span>}
            </p>
            <div className="flex gap-3">
              {(product.colors || productDetails.colors).map((c) => {
                const isAvailable = c.available !== false;
                return (
                  <button key={c.name} title={c.name} onClick={() => isAvailable && setSelectedColor(c.name)}
                    disabled={!isAvailable}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === c.name ? "border-gray-800 scale-110" : "border-gray-200 hover:border-gray-400"
                    } ${!isAvailable ? "opacity-30 cursor-not-allowed" : ""}`}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold mb-2">
              Size{selectedSize ? `: ${selectedSize}` : <span className="text-gray-400 font-normal"> — select one</span>}
            </p>
            <div className="flex gap-2 flex-wrap">
              {(product.sizes || productDetails.sizes).map((s) => {
                const sizeName = typeof s === 'string' ? s : s.name;
                const isAvailable = s.available !== false;
                return (
                  <button key={sizeName} onClick={() => isAvailable && setSelectedSize(sizeName)}
                    disabled={!isAvailable}
                    className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                      selectedSize === sizeName ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-700 border-gray-300 hover:border-gray-800"
                    } ${!isAvailable ? "opacity-30 cursor-not-allowed line-through" : ""}`}
                  >
                    {sizeName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold mb-2">Quantity</p>
            <div className="flex items-center border border-gray-300 rounded-md w-fit">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-lg hover:bg-gray-50 rounded-l-md">−</button>
              <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-lg hover:bg-gray-50 rounded-r-md">+</button>
            </div>
          </div>

          <button onClick={handleAddToCart}
            className="w-full bg-gray-800 text-white py-3.5 rounded-md font-semibold hover:bg-gray-700 transition-colors mb-3">
            Add to Cart
          </button>
          <button onClick={handleBuyNow}
            className="w-full border border-gray-800 text-black py-3.5 rounded-md font-semibold hover:bg-gray-50 transition-colors">
            Buy Now
          </button>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold mb-3">Details</h3>
            <ul className="text-sm text-gray-600 space-y-1.5">
              <li><span className="text-gray-900 font-medium">Brand:</span> {productDetails.brand}</li>
              <li><span className="text-gray-900 font-medium">Material:</span> {productDetails.material}</li>
              <li><span className="text-gray-900 font-medium">Category:</span> <span className="capitalize">{product.type || "top-wear"}</span></li>
              <li><span className="text-gray-900 font-medium">Gender:</span> <span className="capitalize">{product.gender}</span></li>
            </ul>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-semibold text-center mb-8">You may also like</h2>
          <ProductGrid products={similar} />
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;