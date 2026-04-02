import React from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CartContents from "../Cart/CartContents";
import { useCart } from "../../context/CartContext";

const CartDrawer = ({ drawerOpen, ToggleCartDrawer }) => {
  const { cartItems, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    ToggleCartDrawer();
    navigate("/checkout");
  };

  return (
    <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 h-full bg-white shadow-xl transform transition-transform duration-300 flex flex-col z-50 ${
      drawerOpen ? "translate-x-0" : "translate-x-full"
    }`}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h2 className="text-base font-semibold">Your Cart</h2>
        <button onClick={ToggleCartDrawer} className="text-gray-400 hover:text-black transition-colors">
          <IoMdClose className="h-5 w-5" />
        </button>
      </div>

      {/* Items */}
      <div className="flex-grow overflow-y-auto px-5 py-4">
        <CartContents />
      </div>

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="px-5 py-4 border-t bg-white">
          <div className="flex justify-between text-sm mb-4">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold">R{cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            Checkout
          </button>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Shipping & taxes calculated at checkout
          </p>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
