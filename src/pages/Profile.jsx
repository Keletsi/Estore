import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserOrders } from "../services/orderService";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

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

    fetchOrders();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!currentUser) return null;

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">My Account</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Account Details</h2>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="text-gray-500">Email:</span>{" "}
            <span className="font-medium">{currentUser.email}</span>
          </p>
          {currentUser.displayName && (
            <p className="text-sm">
              <span className="text-gray-500">Name:</span>{" "}
              <span className="font-medium">{currentUser.displayName}</span>
            </p>
          )}
          {currentUser.role && (
            <p className="text-sm">
              <span className="text-gray-500">Account Type:</span>{" "}
              <span className="font-medium capitalize">{currentUser.role}</span>
            </p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Order History</h2>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-24 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-500 mb-4">No orders yet</p>
            <button
              onClick={() => navigate("/")}
              className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-100 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                  <div>
                    <p className="text-sm font-medium">Order #{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) : "Date unavailable"}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    statusColors[order.status] || "bg-gray-100 text-gray-800"
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3 overflow-x-auto">
                  {order.items?.slice(0, 4).map((item, idx) => (
                    <img
                      key={idx}
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded-md flex-shrink-0"
                    />
                  ))}
                  {order.items?.length > 4 && (
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      +{order.items.length - 4} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <p className="text-sm text-gray-500">{order.items?.length || 0} item(s)</p>
                  <p className="text-sm font-semibold">R{order.totalPrice?.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {currentUser.role === "admin" && (
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Admin</h2>
          <button
            onClick={() => navigate("/admin")}
            className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Open Admin Panel
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
