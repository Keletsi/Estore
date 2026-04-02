/*import React from 'react'

const selectedProduct = {
      name:"stylish Jacket",
      price:"120",
      originalPrice :150,
      description: "This is a stylish jacket reserved for every occassion",
      brand:"Keth",
      material:"wool",
      sizes: ["S","M","L","XL"],
      color: ["Red","Black"],
      images:[{
      url:"https://picsum.photos/500/500?random=1",
      altText:"Stylish Jacket 1"

      },
      {
      url:"https://picsum.photos/500/500?random=2",
      altText:"Stylish Jacket 2"

      },
      {
      url:"https://picsum.photos/500/500?random=3",
      altText:"Stylish Jacket 2"
      },

    ]

};

const ProductDetails = () => {
  return (
    <div className="p-6">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
            <div className="flex fle-col md-flex-row">
            <div className="hidden md:flex flex-col space-y-4 mr-6"> 
            {selectedProduct.images.map((image,index)=>(
             <img 
             key={index}
             src={image.url} 
             alt={image.altText || `Thumbnail $(index)`}
             className="w-20 h-20 object-cover rounded-lg cursor-pointer border"/>

            ))}
            </div>
            <div className="md:w-1/2">
            <div className="mb-4">
             <img
              src={selectedProduct.images[0]?.url}
              alt="Main Product"
              className="w-full h-auto object-cover rounded-lg"
             />
            </div>
            </div>
            
            <div className="md:hidden flex overscroll-x-scroll space-x=4 mb-4">
             {selectedProduct.images.map((image,index)=>(
             <img 
             key={index}
             src={image.url} 
             alt={image.altText || `Thumbnail $(index)`}
             className="w-20 h-20 object-cover rounded-lg cursor-pointer border"/>

            ))}
            </div>
         
            <div className="md:w-1/2" md:ml-10>
            <h1 className="text-2xl md:text-3xl font-semibod mb-2">{selectedProduct.name}</h1>
             <p className="text-lg text-gray-600 mb-1 line-through">
            {selectedProduct.originalPrice && `$(selectedProduct.originalPrice)`}
             </p>
            </div>
            </div>
        </div>
      
    </div>
  )
}

export default ProductDetails */
/*import React, { useState } from 'react';
import ProductGrid from './ProductGrid';

const selectedProduct = {
  name: "Stylish Jacket",
  price: 120,
  originalPrice: 150,
  description: "This is a stylish jacket reserved for every occasion",
  brand: "Keth",
  material: "Wool",
  sizes: ["S", "M", "L", "XL"],
  colors: [
    { name: "Red", hex: "#D7263D" },
    { name: "Black", hex: "#000000" },
    { name: "Blue", hex: "#1E3A8A" }
  ],
  images: [
    { url: "https://picsum.photos/500/500?random=1", altText: "Stylish Jacket 1" },
    { url: "https://picsum.photos/500/500?random=2", altText: "Stylish Jacket 2" },
    { url: "https://picsum.photos/500/500?random=3", altText: "Stylish Jacket 3" },
  ]
};
const similarProducts = [
   {
    _id: 1,
    name: "Product 1",
    price: 100,
    image:[{
      url: "https://picsum.photos/500/500?random=1", altText: "Stylish Jacket 3"
    }],
   },
   {
    _id: 2,
    name: "Product 3",
    price: 100,
    image:[{
      url: "https://picsum.photos/500/500?random=3", altText: "Stylish Jacket 3"
    }],
   },
   {
    _id: 3,
    name: "Product 2",
    price: 100,
    image:[{
      url: "https://picsum.photos/500/500?random=2", altText: "Stylish Jacket 3"
    }],
   },

]

const ProductDetails = () => {
  const [mainImage, setMainImage] = useState(selectedProduct.images[0].url);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">

        <div className="flex flex-col md:flex-row gap-6">

         
          <div className="hidden md:flex flex-col space-y-4">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer border"
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          
          <div className="md:w-1/2">
            <img
              src={mainImage}
              alt="Main Product"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          
          <div className="md:w-1/2 md:ml-10">

           
            <h2 className="text-2xl font-bold text-black mb-3 uppercase tracking-wide">
              Best Selling
            </h2>

            
            <h1 className="text-3xl font-semibold mb-2">
              {selectedProduct.name}
            </h1>

            
            <div className="flex items-center gap-3 mb-3">
              <p className="text-2xl font-bold text-black">${selectedProduct.price}</p>
              <p className="text-lg text-gray-500 line-through">${selectedProduct.originalPrice}</p>
            </div>

           
            <p className="text-gray-700 mb-4">{selectedProduct.description}</p>

         
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Color</h3>
              <div className="flex gap-3">
                {selectedProduct.colors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full cursor-pointer border ${
                      selectedColor === color.name ? "ring-2 ring-black" : ""
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

           
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Size</h3>
              <div className="flex gap-3 flex-wrap">
                {selectedProduct.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size ? "bg-black text-white" : "bg-white text-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

         
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={decreaseQty}
                  className="w-8 h-8 flex items-center justify-center border rounded-md"
                >
                  -
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  onClick={increaseQty}
                  className="w-8 h-8 flex items-center justify-center border rounded-md"
                >
                  +
                </button>
              </div>
            </div>

           
            <button className="w-full bg-black text-white py-3 rounded-md font-semibold hover:opacity-80 transition">
              Add to Cart
            </button>

          
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Characteristics</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>Brand: {selectedProduct.brand}</li>
                <li>Material: {selectedProduct.material}</li>
                <li>Great for all occasions</li>
                <li>Lightweight & Comfortable</li>
              </ul>
            </div>

          </div>
        </div>
        <div className="mt-20">
         <h2 className="text-2xl text-center font-medium mb-4">You may also like</h2>
         <ProductGrid product={similarProduct} similar/>
        </div>
      </div>
    </div>
  );
};
export default ProductDetails;*/
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const selectedProduct = {
  name: "Stylish Jacket",
  price: 120,
  originalPrice: 150,
  description: "This is a stylish jacket reserved for every occasion",
  brand: "Keth",
  material: "Wool",
  sizes: ["S", "M", "L", "XL"],
  colors: [
    { name: "Red", hex: "#D7263D" },
    { name: "Black", hex: "#000000" },
    { name: "Blue", hex: "#1E3A8A" }
  ],
  images: [
    { url: "https://picsum.photos/500/500?random=1", altText: "Stylish Jacket 1" },
    { url: "https://picsum.photos/500/500?random=2", altText: "Stylish Jacket 2" },
    { url: "https://picsum.photos/500/500?random=3", altText: "Stylish Jacket 3" },
  ]
};

const similarProducts = [
  {
    _id: 1,
    name: "Product 1",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=4", altText: "Product 1" }],
  },
  {
    _id: 2,
    name: "Product 2",
    price: 90,
    images: [{ url: "https://picsum.photos/500/500?random=5", altText: "Product 2" }],
  },
  {
    _id: 3,
    name: "Product 3",
    price: 110,
    images: [{ url: "https://picsum.photos/500/500?random=6", altText: "Product 3" }],
  },
];

const newArrivals = [
  {
    _id: 101,
    name: "Leather Jacket",
    price: 350,
    images: [{ url: "https://picsum.photos/500/500?random=10" }],
  },
  {
    _id: 102,
    name: "Summer Dress",
    price: 200,
    images: [{ url: "https://picsum.photos/500/500?random=11" }],
  },
  {
    _id: 103,
    name: "Sneakers",
    price: 150,
    images: [{ url: "https://picsum.photos/500/500?random=12" }],
  },
];

const ProductDetails = () => {
  const [mainImage, setMainImage] = useState(selectedProduct.images[0].url);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">

        <div className="flex flex-col md:flex-row gap-6">

          {/* Thumbnails */}
          <div className="hidden md:flex flex-col space-y-4">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer border"
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="md:w-1/2">
            <img
              src={mainImage}
              alt="Main Product"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 md:ml-10">

            {/* Best Selling */}
            <h2 className="text-2xl font-bold text-black mb-3 uppercase tracking-wide">
              Best Selling
            </h2>

            <h1 className="text-3xl font-semibold mb-2">
              {selectedProduct.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-3">
              <p className="text-2xl font-bold text-black">${selectedProduct.price}</p>
              <p className="text-lg text-gray-500 line-through">
                ${selectedProduct.originalPrice}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-4">{selectedProduct.description}</p>

            {/* Color */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Color</h3>
              <div className="flex gap-3">
                {selectedProduct.colors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full cursor-pointer border ${selectedColor === color.name ? "ring-2 ring-black" : ""}`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Size</h3>
              <div className="flex gap-3 flex-wrap">
                {selectedProduct.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${selectedSize === size ? "bg-black text-white" : "bg-white text-black"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center gap-4">
                <button onClick={decreaseQty} className="w-8 h-8 flex items-center justify-center border rounded-md">-</button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button onClick={increaseQty} className="w-8 h-8 flex items-center justify-center border rounded-md">+</button>
              </div>
            </div>

            {/* Add to Cart */}
            <button className="w-full bg-black text-white py-3 rounded-md font-semibold hover:opacity-80 transition">
              Add to Cart
            </button>

            {/* Characteristics */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Characteristics</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>Brand: {selectedProduct.brand}</li>
                <li>Material: {selectedProduct.material}</li>
                <li>Great for all occasions</li>
                <li>Lightweight & Comfortable</li>
              </ul>
            </div>

          </div>
        </div>

        {/* You May Also Like — HORIZONTAL SCROLL */}
        <div className="mt-20">
          <h2 className="text-2xl text-center font-medium mb-4">You may also like</h2>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {similarProducts.map((product) => (
              <div key={product._id} className="flex-shrink-0 w-[250px] relative group">
                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  className="w-full h-[300px] object-cover rounded-lg border"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white/40 backdrop-blur-lg text-gray-900 p-3 rounded-b-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition duration-300">
                  <Link to={`/product/${product._id}`} className="block text-center">
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="mt-1 font-medium">R{product.price.toFixed(2)}</p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Arrivals — same style */}
        <div className="mt-20">
          <h2 className="text-2xl text-center font-medium mb-4">New Arrivals</h2>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {newArrivals.map((product) => (
              <div key={product._id} className="flex-shrink-0 w-[250px] relative group">
                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  className="w-full h-[300px] object-cover rounded-lg border"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white/40 backdrop-blur-lg text-gray-900 p-3 rounded-b-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition duration-300">
                  <Link to={`/product/${product._id}`} className="block text-center">
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="mt-1 font-medium">R{product.price.toFixed(2)}</p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;





