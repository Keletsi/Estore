// mockProducts.js
// Swap this out for a real API call later:
// const products = await fetch('/api/products').then(r => r.json());

export const mockProducts = [
  { _id: "1",  name: "Classic White Tee",       price: 29,  category: "tshirts",    type: "top-wear",   images: [{ url: "https://picsum.photos/seed/p1/400/500" }],  createdAt: "2024-01-10" },
  { _id: "2",  name: "Slim Fit Chinos",          price: 59,  category: "jeans",      type: "bottom-wear", images: [{ url: "https://picsum.photos/seed/p2/400/500" }],  createdAt: "2024-02-01" },
  { _id: "3",  name: "Linen Shirt",              price: 49,  category: "tshirts",    type: "top-wear",   images: [{ url: "https://picsum.photos/seed/p3/400/500" }],  createdAt: "2024-03-15" },
  { _id: "4",  name: "Jogger Pants",             price: 44,  category: "jeans",      type: "bottom-wear", images: [{ url: "https://picsum.photos/seed/p4/400/500" }],  createdAt: "2024-01-20" },
  { _id: "5",  name: "Floral Wrap Dress",        price: 79,  category: "collaboration", type: "top-wear", images: [{ url: "https://picsum.photos/seed/p5/400/500" }],  createdAt: "2024-02-10" },
  { _id: "6",  name: "High Waist Jeans",         price: 69,  category: "jeans",      type: "bottom-wear", images: [{ url: "https://picsum.photos/seed/p6/400/500" }],  createdAt: "2024-03-01" },
  { _id: "7",  name: "Silk Blouse",              price: 89,  category: "collaboration", type: "top-wear", images: [{ url: "https://picsum.photos/seed/p7/400/500" }],  createdAt: "2024-03-20" },
  { _id: "8",  name: "Pleated Midi Skirt",       price: 64,  category: "matric-jeans", type: "bottom-wear", images: [{ url: "https://picsum.photos/seed/p8/400/500" }],  createdAt: "2024-01-05" },
  { _id: "9",  name: "Oversized Hoodie",         price: 55,  category: "tshirts",    type: "top-wear",   images: [{ url: "https://picsum.photos/seed/p9/400/500" }],  createdAt: "2024-02-28" },
  { _id: "10", name: "Tailored Blazer",          price: 120, category: "collaboration", type: "top-wear", images: [{ url: "https://picsum.photos/seed/p10/400/500" }], createdAt: "2024-03-10" },
  { _id: "11", name: "Cargo Shorts",             price: 39,  category: "jeans",      type: "bottom-wear", images: [{ url: "https://picsum.photos/seed/p11/400/500" }], createdAt: "2024-01-30" },
  { _id: "12", name: "Ribbed Knit Sweater",      price: 74,  category: "tshirts",    type: "top-wear",   images: [{ url: "https://picsum.photos/seed/p12/400/500" }], createdAt: "2024-02-15" },
];
