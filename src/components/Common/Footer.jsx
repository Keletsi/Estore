import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTiktok, FaWhatsapp } from 'react-icons/fa6';

const WHATSAPP_URL = "https://wa.me/27835783618";

const Footer = () => {
  return (
    <footer className="border-t py-12 bg-gray-50">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 lg:px-0">
        {/* Newsletter Section */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4 font-semibold">Newsletter</h3>
          <p className="text-gray-500 mb-4">
            Be the first to hear about new products, exclusive events, and online offers.
          </p>
          <p className="font-medium text-sm text-gray-600 mb-6">
            Sign up and get 10% off your first order.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
            />
            <button
              type="submit"
              className="bg-gray-700 text-white px-4 rounded-r-md text-sm font-medium hover:bg-gray-600"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Shop Section */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4 font-semibold">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="/shop?category=men" className="hover:text-gray-800 transition-colors">Men's Collection</Link>
            </li>
            <li>
              <Link to="/shop?category=women" className="hover:text-gray-800 transition-colors">Women's Collection</Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-gray-800 transition-colors">All Products</Link>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4 font-semibold">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="/track" className="hover:text-gray-800 transition-colors">Track Order</Link>
            </li>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 transition-colors">
                WhatsApp Us
              </a>
            </li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4 font-semibold">Follow Us</h3>
          <div className="flex space-x-4 text-gray-600">
            <a
              href="https://www.facebook.com/TallBoyWear"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-gray-800"
            >
              <FaFacebookF className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/tallboywear/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-gray-800"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.tiktok.com/@tallboywear"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="hover:text-gray-800"
            >
              <FaTiktok className="w-5 h-5" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:text-gray-800"
            >
              <FaWhatsapp className="w-5 h-5" />
            </a>
          </div>
          <p className="text-gray-500 mt-4">WhatsApp Us</p>
          <p>
            <FaWhatsapp className="inline-block mr-2" />
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 transition-colors">
              +27 83 578 3618
            </a>
          </p>
        </div>
      </div>
      <div className="container mx-auto mt-12 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-gray-500 text-sm tracking-tighter text-center">
          © {new Date().getFullYear()} TallBoy Clothing. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
