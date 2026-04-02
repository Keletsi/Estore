/*import React from 'react'

const NewArrivals = () => {
    const NewArrivals = [
        {
            _id : 1,
            name : "stylish jacket",
            images : [
                {
                    url : "https://picsum.photos/500/500?random=1",
                    altText: "stylish Jacket",

            }
        ]

        },
        {
            _id : 2,
            name : "stylish jacket",
            images : [
                {
                    url : "https://picsum.photos/500/500?random=2",
                    altText: "stylish Jacket",

            }
        ]

        },
        {
            _id : 3,
            name : "stylish jacket",
            images : [
                {
                    url : "https://picsum.photos/500/500?random=3",
                    altText: "stylish Jacket",

            }
        ]

        },
        {
            _id : 4,
            name : "stylish jacket",
            images : [
                {
                    url : "https://picsum.photos/500/500?random=4",
                    altText: "stylish Jacket",

            }
        ]

        },
        {
            _id : 5,
            name : "stylish jacket",
            images : [
                {
                    url : "https://picsum.photos/500/500?random=5",
                    altText: "stylish Jacket",

            }
        ]

        },
        {
            _id : 6,
            name : "stylish jacket",
            images : [
                {
                    url : "https://picsum.photos/500/500?random=6",
                    altText: "stylish Jacket",

            }
        ]

        },
        {
            _id : 7,
            name : "stylish jacket",
            images : [
                {
                    url : "https://picsum.photos/500/500?random=7",
                    altText: "stylish Jacket",

            }
        ]

        },
        {
            _id : 8,
            name : "stylish jacket",
            images : [
                {
                    url : "https://picsum.photos/500/500?random=8",
                    altText: "stylish Jacket",

            }
        ]
        }  
    ];
  return (
    <section>
        <div className="container mx-auto text-center mb-10 realtive">
          <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
          <p className="text-lg text-gray-600 mb-8">Discover the lastest styles straight off the runway. freshly added to keep your wadrobe on the cutting  edge of fashion.</p>
          <div className="absolute right-0 bottom-[-30px] flex space-2-x">
            <button className="p-2 rounded border bg-white text-black">
             <FiChevronLeft className="text-2xl"/>
            </button>
            <button className="p-2 rounded border bg-white text-black">
             <FiChevronRight className="text-2xl"/>
             </button>

          </div>
        </div>
        <div className="container mx-auto overflow-x-scroll flex space-x-6 relative">
         {NewArrivals.map((product)=>(
         <div key={product.id}>
            <img src={product.images[0]?.url} alt={product.images[0]?altText || product.name} />
         </div>
        ))}
        </div>
    </section>
  )
}

export default <NewArrivals></NewArrivals> */

import React, { useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const newArrivals = [
    { _id: 1, name: "Stylish Jacket", price: 79.99, images: [{ url: "https://picsum.photos/500/500?random=1" }] },
    { _id: 2, name: "Modern Hoodie", price: 59.99, images: [{ url: "https://picsum.photos/500/500?random=2" }] },
    { _id: 3, name: "Casual Shirt", price: 39.99, images: [{ url: "https://picsum.photos/500/500?random=3" }] },
    { _id: 4, name: "Trendy Coat", price: 89.99, images: [{ url: "https://picsum.photos/500/500?random=4" }] },
    { _id: 5, name: "Denim Jacket", price: 69.99, images: [{ url: "https://picsum.photos/500/500?random=5" }] },
    { _id: 6, name: "Leather Jacket", price: 109.99, images: [{ url: "https://picsum.photos/500/500?random=6" }] },
    { _id: 7, name: "Puffer Jacket", price: 99.99, images: [{ url: "https://picsum.photos/500/500?random=7" }] },
    { _id: 8, name: "Sporty Jacket", price: 49.99, images: [{ url: "https://picsum.photos/500/500?random=8" }] },
  ];

  const buttonStyle =
    "p-3 rounded-full border bg-white/70 backdrop-blur-md text-black shadow-md hover:bg-white transition duration-200";

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;

    if (direction === "left") container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    else container.scrollBy({ left: scrollAmount, behavior: "smooth" });

    // Update blur states
    setTimeout(() => {
      setIsAtStart(container.scrollLeft <= 0);
      setIsAtEnd(container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10);
    }, 300);
  };

  return (
    <section className="py-12 relative">
      {/* Header */}
      <div className="container mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover the latest styles straight off the runway — freshly added to keep your wardrobe on the cutting edge of fashion.
        </p>
      </div>

      {/* Scrollable Products */}
      <div className="relative container mx-auto">
        {/* Left blur effect */}
        <div
          className={`absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent pointer-events-none transition-opacity duration-300 ${
            isAtStart ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        {/* Right blur effect */}
        <div
          className={`absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent pointer-events-none transition-opacity duration-300 ${
            isAtEnd ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto px-8 scrollbar-hide scroll-smooth"
          onScroll={(e) => {
            const container = e.target;
            setIsAtStart(container.scrollLeft <= 0);
            setIsAtEnd(container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10);
          }}
        >
          {newArrivals.map((product) => (
            <div key={product._id} className="flex-shrink-0 w-[250px] relative group">
              <img
                src={product.images[0]?.url}
                alt={product.name}
                className="w-full h-[300px] object-cover rounded-lg border"
              />

              {/* Blurry overlay — visible on mobile, hover on desktop */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-white/40 backdrop-blur-lg text-gray-900 
                           p-3 rounded-b-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition duration-300"
              >
                <Link to={`/product/${product._id}`} className="block text-center">
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="mt-1 font-medium">R{product.price.toFixed(2)}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Chevron Buttons (left side, responsive) */}
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




