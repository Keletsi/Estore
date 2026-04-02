import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import Searchbar from "./Searchbar";
import CartDrawer from "../Layout/CartDrawer";
import { useCart } from "../../context/CartContext";

const NAV_LINKS = [
  { label: "MEN",         to: "/collection/men" },
  { label: "WOMEN",       to: "/collection/women" },
  { label: "TOP WEAR",    to: "/collection/top-wear" },
  { label: "BOTTOM WEAR", to: "/collection/bottom-wear" },
];

const Navbar = () => {
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cartCount } = useCart();

  const toggleCartDrawer = () => setDrawerOpen((prev) => !prev);
  const toggleNavDrawer  = () => setNavDrawerOpen((prev) => !prev);

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <div>
          <Link to="/" className="text-2xl font-medium">Keth</Link>
        </div>

        <div className="hidden md:flex space-x-8">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to}
              className="text-gray-700 hover:text-black text-sm font-medium uppercase transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex space-x-4 items-center">
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          <button onClick={toggleCartDrawer} className="relative hover:text-black">
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#ea2e0e] text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </button>

          <div className="overflow-hidden">
            <Searchbar />
          </div>

          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} ToggleCartDrawer={toggleCartDrawer} />

      <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} onClick={toggleNavDrawer}
                className="block text-gray-600 hover:text-black transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
