import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ShopPage from "./pages/ShopPage";
import CollectionPage from "./pages/CollectionPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderTracking from "./pages/OrderTracking";
import AdminPanel from "./components/Admin/AdminPanel";
import AdminRoute from "./components/Admin/AdminRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="sale" element={<ShopPage />} />
          <Route path="collection" element={<CollectionPage />} />
          <Route path="collection/all" element={<CollectionPage />} />
          <Route path="collection/:category" element={<CollectionPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="track" element={<OrderTracking />} />
        </Route>
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
