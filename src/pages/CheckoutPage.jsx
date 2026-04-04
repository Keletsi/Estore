import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/orderService";

const SHIPPING_COST = 50;
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder";

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("checkout");
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", province: "", postalCode: "",
    payment: "card",
  });
  const [errors, setErrors] = useState({});

  const total = cartTotal + SHIPPING_COST;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    script.onerror = () => console.error("Failed to load Paystack");
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const required = ["firstName", "lastName", "email", "address", "city", "province", "postalCode"];
    const newErrors = {};
    required.forEach((field) => {
      if (!form[field].trim()) newErrors[field] = "Required";
    });
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      const shippingInfo = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        province: form.province,
        postalCode: form.postalCode,
      };

      const orderTotal = total * 100;

      if (form.payment === "card") {
        if (!window.PaystackPop) {
          setErrors({ submit: "Payment system not loaded. Please refresh the page." });
          setLoading(false);
          return;
        }

        const reference = `KTH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        window.PaystackPop.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email: form.email,
          amount: orderTotal,
          currency: "ZAR",
          ref: reference,
          channels: ["card"],
          metadata: {
            custom_fields: [
              { display_name: "Customer Name", variable_name: "customer_name", value: `${form.firstName} ${form.lastName}` },
              { display_name: "Phone", variable_name: "phone", value: form.phone },
            ]
          },
          callback: function(response) {
            createOrder(currentUser?.uid || "guest", cartItems, total, shippingInfo, {
              paymentRef: response.reference,
              paymentStatus: "paid",
            }).then(() => {
              clearCart();
              setStep("confirmed");
            }).catch((err) => {
              setErrors({ submit: "Order creation failed. Contact support with ref: " + response.reference });
            }).finally(() => {
              setLoading(false);
            });
          },
          onClose: function() {
            setLoading(false);
          },
        }).openIframe();
      } else {
        await createOrder(currentUser?.uid || "guest", cartItems, total, shippingInfo, {
          paymentStatus: "pending",
        });
        clearCart();
        setStep("confirmed");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setErrors({ submit: "Failed to create order. Please try again." });
    } finally {
      if (form.payment === "eft") {
        setLoading(false);
      }
    }
  };

  if (cartItems.length === 0 && step !== "confirmed") {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-md">
        <h2 className="text-2xl font-semibold mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products before checking out.</p>
        <Link to="/" className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-900 transition-colors">
          Shop Now
        </Link>
      </div>
    );
  }

  if (step === "confirmed") {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Order Confirmed!</h2>
        <p className="text-gray-500 mb-2">Thank you, {form.firstName}. Your order has been placed.</p>
        <p className="text-gray-400 text-sm mb-8">A confirmation will be sent to {form.email}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/track" className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-900 transition-colors">
            Track Order
          </Link>
          <Link to="/" className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-50 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-300"
    }`;

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">

      <div className="mb-8">
        <Link to="/" className="text-sm text-gray-400 hover:text-black transition-colors">← Back to shop</Link>
        <h1 className="text-2xl font-semibold mt-3">Checkout</h1>
      </div>

      {errors.submit && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-10">

          <div className="flex-1 space-y-8">

            <section>
              <h2 className="text-base font-semibold mb-4 pb-2 border-b">Contact information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">First name</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} className={inputClass("firstName")} />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Last name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} className={inputClass("lastName")} />
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-600 block mb-1">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass("email")} />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-600 block mb-1">Phone (optional)</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className={inputClass("phone")} />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-4 pb-2 border-b">Shipping address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-600 block mb-1">Street address</label>
                  <input name="address" value={form.address} onChange={handleChange} className={inputClass("address")} />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">City</label>
                  <input name="city" value={form.city} onChange={handleChange} className={inputClass("city")} />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Province</label>
                  <input name="province" value={form.province} onChange={handleChange} className={inputClass("province")} />
                  {errors.province && <p className="text-xs text-red-500 mt-1">{errors.province}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Postal code</label>
                  <input name="postalCode" value={form.postalCode} onChange={handleChange} className={inputClass("postalCode")} />
                  {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-4 pb-2 border-b">Payment</h2>

              <div className="flex gap-3 mb-5">
                {["card", "eft"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, payment: method }))}
                    className={`flex-1 py-2.5 text-sm border rounded-md font-medium transition-colors ${
                      form.payment === method ? "bg-black text-white border-black" : "border-gray-300 text-gray-600 hover:border-black"
                    }`}
                  >
                    {method === "card" ? "Credit / Debit Card" : "EFT / Bank Transfer"}
                  </button>
                ))}
              </div>

              {form.payment === "card" && (
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                  <p className="font-medium text-gray-800 mb-2">Paystack Secure Payment</p>
                  <p>You will be redirected to a secure payment page to enter your card details after placing your order.</p>
                  <p className="text-xs text-gray-400 mt-2">We accept Visa, Mastercard, and Verve cards.</p>
                </div>
              )}

              {form.payment === "eft" && (
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-800 mb-2">Bank details</p>
                  <p>Bank: <span className="text-gray-900">FNB</span></p>
                  <p>Account name: <span className="text-gray-900">Keth Clothing (Pty) Ltd</span></p>
                  <p>Account number: <span className="text-gray-900">62012345678</span></p>
                  <p>Branch code: <span className="text-gray-900">250655</span></p>
                  <p className="text-xs text-gray-400 mt-2">Use your order number as reference. Orders are processed once payment is confirmed.</p>
                </div>
              )}
            </section>
          </div>

          <div className="lg:w-80">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
              <h2 className="text-base font-semibold mb-4">Order summary</h2>

              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg" />
                      <span className="absolute -top-1.5 -right-1.5 bg-gray-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.size} · {item.color}</p>
                    </div>
                    <span className="text-sm font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>R{SHIPPING_COST.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>Total</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" disabled={loading || (form.payment === "card" && !paystackLoaded)}
                className="w-full bg-black text-white py-3.5 rounded-md font-semibold hover:bg-gray-900 transition-colors mt-6 disabled:opacity-50">
                {loading ? "Processing..." : paystackLoaded ? "Place Order" : "Loading Payment..."}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                By placing your order you agree to our terms and conditions.
              </p>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
