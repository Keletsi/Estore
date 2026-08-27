import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const AddProduct = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    gender: "men",
    type: "top-wear",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }

      if (!form.name || !form.price || !form.description) {
        throw new Error("Please fill in all required fields");
      }

      if (!imageFile) {
        throw new Error("Please select a product image");
      }

      const imageUrl = await uploadImage(imageFile);

      const productData = {
        name: form.name,
        price: parseFloat(form.price),
        description: form.description,
        gender: form.gender,
        type: form.type,
        category: form.gender,
        images: [{ url: imageUrl }],
        createdAt: serverTimestamp(),
      };

      console.log("Adding product to Firestore:", productData);
      const docRef = await addDoc(collection(db, "products"), productData);
      console.log("Product added with ID:", docRef.id);

      setSuccess(`Product added successfully! (ID: ${docRef.id})`);
      setForm({
        name: "",
        price: "",
        description: "",
        gender: "men",
        type: "top-wear",
      });
      setImageFile(null);
      setImagePreview("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Add New Product</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
            placeholder="e.g., Classic White Tee"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (R) *
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
            placeholder="29.99"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
            placeholder="Product description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
            >
              <option value="top-wear">Top Wear</option>
              <option value="bottom-wear">Bottom Wear</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
          />
          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-40 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;