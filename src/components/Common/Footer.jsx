

/*const Footer = () => {
  return (
    <Footer className="border-t py-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 lg:px-0 ">
            <div>
                <h3 className="text-lg text-gray-800 mb-4">Newsletter</h3>
                <p className="text-gray-500 mb-4">
                    Be the first to hear about new products, exclusive events and online offers
                </p>
                <p>
                    sign up and get 10% off your fist order
                </p>
                <form className="flex">
                    <input
                    type="email"
                    placeholder="Enter your email"
                    className="p-3 w-full text-sm border-t border-l border-gray-300 rounded-l-md focus:outline-none focus:ring:-2 focus-ring-gray-500 transition-all"
                    />

                </form>
            </div>

        </div>

    </Footer>
  )
}

export default Footer;*/
/*import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 lg:px-0">
       
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Newsletter</h3>
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
              className="p-3 w-full text-sm border-t border-l border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 rounded-r-md text-sm font-medium hover:bg-gray-800"
            >
              Subscribe
            </button>
          </form>
        </div>

       
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
               <Link to="#" className="hover:text-gray-600 transition-colors">Men Bottom Wear</Link>
            </li>
            <li>
               <Link to="#" className="hover:text-gray-600 transition-colors">Women Bottom Wear</Link>
            </li>
            <li>
               <Link to="#" className="hover:text-gray-600 transition-colors">Men Top wear</Link>
            </li>
            <li>
               <Link to="#" className="hover:text-gray-600 transition-colors">Women Top wear</Link>
            </li>
            
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-500">
            <li><a href="#">Contact us</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Features</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-gray-800 mb-4">Follow Us</h3>
          <ul className="space-y-2 text-gray-500">
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Twitter</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer; */
import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa';

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
              className="bg-black text-white px-4 rounded-r-md text-sm font-medium hover:bg-gray-800"
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
              <Link to="#" className="hover:text-gray-800 transition-colors">Men Bottom Wear</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-800 transition-colors">Women Bottom Wear</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-800 transition-colors">Men Top Wear</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-800 transition-colors">Women Top Wear</Link>
            </li>
          </ul>
        </div>

        {/* Support Section (copied structure from Shop) */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4 font-semibold">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-800 transition-colors">Contact Us</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-800 transition-colors">FAQ</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-800 transition-colors">Features</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-800 transition-colors">Help Center</Link>
            </li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4 font-semibold">Follow Us</h3>
          <div className="flex space-x-4 text-gray-600">
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">
              <FaFacebookF className="w-5 h-5" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">
              <FaTwitter className="w-5 h-5" />
            </a>
          </div>
          <p className="text-gray-500">WhatsApp Us</p>
          <p><FaWhatsapp className="inline-block mr-2"/>078 876 9876</p>
        </div>
      </div>
      <div className="container mx-auto mt-12 lg:px-0 border-t border-gray-200 pt-6 ">
        <p className="text-gray-500 text-sm tracking-tighter text-center">
            Copyright 2025, CompileTab , All Right Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;


