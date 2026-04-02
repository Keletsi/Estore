import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useCart } from "../../context/CartContext";

const CartContents = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-400">
        <p className="text-lg">Your cart is empty</p>
        <p className="text-sm mt-1">Add items to get started</p>
      </div>
    );
  }

  return (
    <div>
      {cartItems.map((item) => (
        <div
          key={`${item.productId}-${item.size}-${item.color}`}
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start space-x-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">
                {item.size && `Size: ${item.size}`}
                {item.size && item.color && " | "}
                {item.color && `Color: ${item.color}`}
              </p>
              <p className="text-gray-700 font-medium mt-0.5">
                R{(item.price * item.quantity).toFixed(2)}
              </p>

              {/* Quantity controls */}
              <div className="flex items-center mt-2 border rounded-md w-fit">
                <button
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.size,
                      item.color,
                      item.quantity - 1
                    )
                  }
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-lg rounded-l-md"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.size,
                      item.color,
                      item.quantity + 1
                    )
                  }
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-lg rounded-r-md"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Delete */}
          <button
            onClick={() =>
              removeFromCart(item.productId, item.size, item.color)
            }
            className="mt-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <RiDeleteBin3Line className="h-5 w-5" />
          </button>
        </div>
      ))}

      {/* Total */}
      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <span className="text-gray-500 text-sm">Subtotal</span>
        <span className="text-lg font-semibold text-gray-900">
          R{cartTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default CartContents;
