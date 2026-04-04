import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserOrders } from "../services/orderService";

const statusSteps = {
  pending: { label: "Order Placed", desc: "Your order has been received" },
  processing: { label: "Processing", desc: "We are preparing your order" },
  shipped: { label: "Shipped", desc: "On the way to you" },
  delivered: { label: "Delivered", desc: "Order received" },
};

const statusColors = {
  pending: "bg-yellow-500",
  processing: "bg-blue-500",
  shipped: "bg-purple-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const OrderTracking = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      const userOrders = await getUserOrders(currentUser.uid);
      setOrders(userOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchOrder = () => {
    if (!orderId.trim()) return;
    const found = orders.find(o => o.id.toLowerCase().includes(orderId.toLowerCase()));
    setSearchResult(found || null);
  };

  const displayOrders = searchResult ? [searchResult] : orders;

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Track Your Order</h1>
        <p className="text-gray-500 mb-6">Please sign in to track your orders</p>
        <Link to="/login" className="bg-black text-white px-6 py-2 rounded-md font-medium">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Link to="/profile" className="text-sm text-gray-500 hover:text-black mb-4 inline-block">
        ← Back to Profile
      </Link>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Track Your Order</h1>
        <button onClick={fetchOrders} className="text-sm border px-3 py-1 rounded hover:bg-gray-50">
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter order ID to search..."
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-black"
          />
          <button
            onClick={searchOrder}
            className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800"
          >
            Search
          </button>
        </div>
        {searchResult && (
          <button onClick={() => { setSearchResult(null); setOrderId(""); }} className="text-sm text-gray-500 mt-2">
            Clear search
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-100 rounded-lg h-32 animate-pulse" />
          ))}
        </div>
      ) : displayOrders.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-500 mb-4">
            {searchResult ? "Order not found" : "No orders yet"}
          </p>
          <Link to="/" className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {displayOrders.map(order => {
            const currentIdx = Object.keys(statusSteps).indexOf(order.status);
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-lg font-medium">Order #{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-sm text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric"
                      }) : "Date unavailable"}
                    </p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
                    statusColors[order.status] || "bg-gray-100"
                  } text-white`}>
                    {order.status}
                  </span>
                </div>

                <div className="relative">
                  <div className="flex justify-between">
                    {Object.entries(statusSteps).map(([status, info], idx) => (
                      <div key={status} className="flex flex-col items-center relative z-10">
                        <div className={`w-4 h-4 rounded-full ${
                          idx <= currentIdx ? statusColors[order.status] || "bg-green-500" : "bg-gray-200"
                        }`} />
                        <p className="text-xs mt-2 font-medium">{info.label}</p>
                        <p className="text-xs text-gray-500 hidden sm:block">{info.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-1.5 left-0 right-0 h-0.5 bg-gray-200 -z-0">
                    <div className={`h-full ${statusColors[order.status]} transition-all`} 
                      style={{ width: `${(currentIdx / (Object.keys(statusSteps).length - 1)) * 100}%` }} 
                    />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <p className="text-sm font-medium mb-3">Items:</p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-20 object-cover rounded-md"
                        />
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium">R{item.price?.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between">
                  <span className="text-gray-500">Total:</span>
                  <span className="font-semibold">R{order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;