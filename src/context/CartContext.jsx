import React, { createContext, useContext, useState, useEffect } from "react";

const CART_STORAGE_KEY = "ecommerce_cart";

const CartContext = createContext();

const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to storage:", error);
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCartFromStorage);

  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  const addToCart = (product, quantity = 1, size = null, color = null) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.productId === product._id &&
          item.size === size &&
          item.color === color
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id &&
          item.size === size &&
          item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url || product.imageUrl,
          size,
          color,
          quantity,
        },
      ];
    });
  };

  // Remove item entirely
  const removeFromCart = (productId, size, color) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId &&
            item.size === size &&
            item.color === color)
      )
    );
  };

  // Update quantity
  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easy access
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
