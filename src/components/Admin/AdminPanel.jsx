import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import {
  getCollaborations,
  addCollaboration,
  updateCollaboration,
  deleteCollaboration,
} from "../../services/collabService";
import { HiPlus, HiPencil, HiTrash, HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";

const AdminPanel = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [currentUser, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setProducts([]);
    setOrders([]);
    try {
      const productsSnap = await getDocs(collection(db, "products"));
      const ordersSnap = await getDocs(collection(db, "orders"));
      const productsList = productsSnap.docs.map(d => {
        const data = d.data();
        return { 
          docId: d.id,
          id: data._id || d.id,
          _id: data._id || d.id,
          ...data 
        };
      });
      const ordersList = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      productsList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      ordersList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setProducts(productsList);
      setOrders(ordersList);
    } catch (err) {
      console.error("fetchData error:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-semibold mb-4">Admin Access Required</h2>
        <p className="text-gray-500 mb-6">You need admin privileges to access this page.</p>
        <button onClick={() => navigate("/")} className="bg-gray-800 text-white px-6 py-2 rounded-md">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <p className="text-sm text-gray-500">Logged in as: {currentUser.email}</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")}><HiX className="h-5 w-5" /></button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess("")}><HiX className="h-5 w-5" /></button>
        </div>
      )}

      <div className="flex gap-4 mb-8 border-b">
        {["products", "add-product", "collabs", "orders"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? "border-gray-800 text-gray-900"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            {tab === "products" ? "All Products" : tab === "add-product" ? "Add Product" : tab === "collabs" ? "Collaborations" : "Orders"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      ) : activeTab === "products" ? (
        <ProductsTab products={products} onDelete={fetchData} onError={showError} onSuccess={showSuccess} />
      ) : activeTab === "add-product" ? (
        <AddProductTab onSuccess={fetchData} onError={showError} onSuccessMsg={showSuccess} />
      ) : activeTab === "collabs" ? (
        <CollabsTab products={products} onError={showError} onSuccess={showSuccess} />
      ) : (
        <OrdersTab orders={orders} onError={showError} onSuccess={showSuccess} />
      )}
    </div>
  );
};

const AddProductTab = ({ onSuccess, onError, onSuccessMsg }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    description: "",
    category: "tshirts",
    type: "top-wear",
    brand: "",
    material: "",
    sizes: "S,M,L,XL",
    colors: "Black,White,Navy",
    stock: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      onError("Maximum 5 images allowed");
      return;
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const urls = [];
    for (const file of images) {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push({ url });
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!form.name || !form.price) {
        throw new Error("Name and price are required");
      }

      if (images.length === 0) {
        throw new Error("At least one image is required");
      }

      const imageUrls = await uploadImages();

      const productData = {
        name: form.name,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        description: form.description,
        type: form.type,
        category: form.category,
        brand: form.brand,
        material: form.material,
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean).map(s => ({ name: s, available: true })),
        colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean).map((name) => ({
          name,
          hex: getColorHex(name),
          available: true,
        })),
        images: imageUrls,
        stock: form.stock ? parseInt(form.stock) : 0,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "products"), productData);
      console.log("Product added with ID:", docRef.id);
      onSuccess();
      onSuccessMsg("Product added successfully!");
      
      setForm({
        name: "",
        price: "",
        originalPrice: "",
        description: "",
        category: "tshirts",
        type: "top-wear",
        brand: "",
        material: "",
        sizes: "S,M,L,XL",
        colors: "Black,White,Navy",
        stock: "",
      });
      setImages([]);
      setImagePreviews([]);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (R) *</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
            placeholder="299.99"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (R)</label>
          <input
            type="number"
            name="originalPrice"
            value={form.originalPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
            placeholder="399.99"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
            placeholder="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
            placeholder="e.g., TallBoy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
          <input
            type="text"
            name="material"
            value={form.material}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
            placeholder="e.g., 100% Cotton"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
          >
            <option value="tshirts">T-Shirts</option>
            <option value="collaboration">Collaborations</option>
            <option value="baseball-jackets">Baseball Jackets</option>
            <option value="hockey-tops">Hockey Tops</option>
            <option value="jeans">Jeans</option>
            <option value="matric-jeans">Matric Jeans</option>
            <option value="top-wear">Top Wear</option>
            <option value="bottom-wear">Bottom Wear</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma-separated)</label>
          <input
            type="text"
            name="sizes"
            value={form.sizes}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
            placeholder="S,M,L,XL"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma-separated)</label>
          <input
            type="text"
            name="colors"
            value={form.colors}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
            placeholder="Black,White,Navy"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
          placeholder="Product description..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Images * (max 5)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
        />
        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img src={preview} alt="" className="w-24 h-28 object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <HiX className="h-3 w-3" />
                </button>
              </div>
            ))}
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
  );
};

const ProductsTab = ({ products, onDelete, onError, onSuccess }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const perPage = 12;
  
  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p._id?.toLowerCase().includes(search.toLowerCase())
  );
  
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    const docId = product.docId;
    setDeletingId(docId);
    try {
      if (product.images?.[0]?.url) {
        try {
          const imgRef = ref(storage, product.images[0].url);
          await deleteObject(imgRef);
        } catch (e) {}
      }
      await deleteDoc(doc(db, "products", docId));
      console.log("DELETED:", docId);
      setDeletingId(null);
      onDelete();
      onSuccess("Deleted");
    } catch (err) {
      console.error("Delete error:", err);
      setDeletingId(null);
      onError("Failed to delete: " + err.message);
    }
  };

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-700 w-64"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginated.map((product) => {
          const id = product._id || product.id;
          const isDeleting = deletingId === id;
          if (isDeleting) return null;
          return (
            <div key={id} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
                {product.images?.[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-400 mb-1">{id}</p>
                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                <p className="text-sm font-semibold mt-1">R{product.price?.toFixed(2)}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                  >
                    <HiTrash className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {paginated.length === 0 && (
        <p className="text-center text-gray-500 py-8">No products found</p>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            <HiChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            <HiChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {editingProduct && (
        <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSuccess={onDelete} onError={onError} onSuccessMsg={onSuccess} />
      )}
    </div>
  );
};

const EditProductModal = ({ product, onClose, onSuccess, onError, onSuccessMsg }) => {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price?.toString() || "",
    description: product.description || "",
    category: product.category || product.gender || "tshirts",
    type: product.type || "top-wear",
    sizes: product.sizes?.map(s => typeof s === 'string' ? s : s.name).join(", ") || "S,M,L,XL",
    colors: product.colors?.map(c => c.name).join(", ") || "Black,White",
    stock: product.stock?.toString() || "0",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productId = product.docId;
      const updatedData = {
        name: form.name,
        price: parseFloat(form.price),
        description: form.description,
        type: form.type,
        category: form.category,
        sizes: form.sizes.split(",").map(s => s.trim()).filter(Boolean).map(s => ({ name: s, available: true })),
        colors: form.colors.split(",").map(c => c.trim()).filter(Boolean).map(name => ({ name, hex: getColorHex(name), available: true })),
        stock: parseInt(form.stock) || 0,
      };
      await updateDoc(doc(db, "products", productId), updatedData);
      if (onSuccessMsg) onSuccessMsg("Product updated!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      onError("Failed to update: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Product</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (R) *</label>
              <input name="price" value={form.price} onChange={handleChange} required type="number" step="0.01" className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input name="stock" value={form.stock} onChange={handleChange} type="number" className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700">
                <option value="tshirts">T-Shirts</option>
                <option value="collaboration">Collaborations</option>
                <option value="baseball-jackets">Baseball Jackets</option>
                <option value="hockey-tops">Hockey Tops</option>
                <option value="jeans">Jeans</option>
                <option value="matric-jeans">Matric Jeans</option>
                <option value="top-wear">Top Wear</option>
                <option value="bottom-wear">Bottom Wear</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700">
                <option value="top-wear">Top Wear</option>
                <option value="bottom-wear">Bottom Wear</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
            <input name="sizes" value={form.sizes} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700" placeholder="S,M,L,XL" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma separated)</label>
            <input name="colors" value={form.colors} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700" placeholder="Black,White,Navy" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="flex-1 bg-gray-800 text-white py-2.5 rounded-md font-medium hover:bg-gray-700 disabled:opacity-50">
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-md font-medium hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrdersTab = ({ orders, onError, onSuccess }) => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const perPage = 10;

  const filtered = orders.filter((o) =>
    statusFilter === "all" || o.status === statusFilter
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      onSuccess("Order status updated");
    } catch (err) {
      onError("Failed to update status");
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-gray-700"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Order ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Items</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Total</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{order.shippingInfo?.firstName} {order.shippingInfo?.lastName}</p>
                      <p className="text-gray-500 text-xs">{order.shippingInfo?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{order.items?.length || 0}</td>
                  <td className="px-4 py-3 font-semibold">R{order.totalPrice?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || "bg-gray-100"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      {expandedOrder === order.id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            <HiChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            <HiChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {expandedOrder && (() => {
        const order = orders.find(o => o.id === expandedOrder);
        if (!order) return null;
        return (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setExpandedOrder(null)}>
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Order #{order.id.slice(-8).toUpperCase()}</h3>
                <button onClick={() => setExpandedOrder(null)} className="text-gray-500 hover:text-black">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-medium mb-2">Shipping Address:</p>
                  <p className="text-sm">{order.shippingInfo?.firstName} {order.shippingInfo?.lastName}</p>
                  <p className="text-sm">{order.shippingInfo?.address}</p>
                  <p className="text-sm">{order.shippingInfo?.city}, {order.shippingInfo?.province} {order.shippingInfo?.postalCode}</p>
                  <p className="text-sm">{order.shippingInfo?.email}</p>
                  <p className="text-sm">{order.shippingInfo?.phone}</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Order Items:</p>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="text-sm flex items-center gap-2 mb-2">
                      <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-500">Qty: {item.quantity} - R{item.price}</p>
                      </div>
                    </div>
                  ))}
                  <p className="font-medium mt-2 border-t pt-2">Total: R{order.totalPrice?.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t">
                <label className="font-medium mr-2">Update Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-gray-700"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

const CollabsTab = ({ products, onError, onSuccess }) => {
  const [collabs, setCollabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | "new" | collab object
  const [deletingId, setDeletingId] = useState(null);

  const loadCollabs = async () => {
    setLoading(true);
    try {
      setCollabs(await getCollaborations());
    } catch (err) {
      console.error("loadCollabs error:", err);
      onError("Failed to load collaborations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (collab) => {
    if (!window.confirm(`Delete collaboration "${collab.title}"?`)) return;
    setDeletingId(collab.docId);
    try {
      if (collab.imageUrl) {
        try {
          await deleteObject(ref(storage, collab.imageUrl));
        } catch (e) {}
      }
      await deleteCollaboration(collab.docId);
      onSuccess("Collaboration deleted");
      await loadCollabs();
    } catch (err) {
      console.error("Delete collab error:", err);
      onError("Failed to delete: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          Collaborations shown on the home page. If none exist, the section stays hidden.
        </p>
        <button
          onClick={() => setEditing("new")}
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <HiPlus className="h-4 w-4" /> New Collaboration
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-56 animate-pulse" />
          ))}
        </div>
      ) : collabs.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No collaborations yet</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {collabs.map((collab) => (
            <div key={collab.docId} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                {collab.imageUrl ? (
                  <img src={collab.imageUrl} alt={collab.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </div>
              <div className="p-3">
                {collab.tag && (
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{collab.tag}</p>
                )}
                <h3 className="font-medium text-sm truncate">{collab.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {(collab.productIds?.length || 0)} product{(collab.productIds?.length || 0) === 1 ? "" : "s"}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditing(collab)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                  >
                    <HiPencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(collab)}
                    disabled={deletingId === collab.docId}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <HiTrash className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <CollabForm
          collab={editing === "new" ? null : editing}
          products={products}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            loadCollabs();
          }}
          onError={onError}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
};

const CollabForm = ({ collab, products, onClose, onSaved, onError, onSuccess }) => {
  const [form, setForm] = useState({
    title: collab?.title || "",
    tag: collab?.tag || "",
    description: collab?.description || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(collab?.imageUrl || "");
  const [selectedIds, setSelectedIds] = useState(new Set(collab?.productIds || []));
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const toggleProduct = (docId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId);
      else next.add(docId);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      onError("Title is required");
      return;
    }
    setSaving(true);
    try {
      let imageUrl = collab?.imageUrl || "";
      if (imageFile) {
        const storageRef = ref(storage, `collaborations/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const collabData = {
        title: form.title.trim(),
        tag: form.tag.trim(),
        description: form.description.trim(),
        imageUrl,
        productIds: [...selectedIds],
      };

      if (collab) {
        await updateCollaboration(collab.docId, collabData);
      } else {
        await addCollaboration(collabData);
      }
      onSuccess(collab ? "Collaboration updated!" : "Collaboration added!");
      onSaved();
    } catch (err) {
      console.error("Save collab error:", err);
      onError("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{collab ? "Edit Collaboration" : "New Collaboration"}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g., TallBoy × TBW"
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
            <input
              name="tag"
              value={form.tag}
              onChange={handleChange}
              placeholder="e.g., Limited Drop / Out Now / Coming Soon"
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Collab Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-700"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Collab preview" className="mt-3 w-full max-w-xs aspect-video object-cover rounded-lg border" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Products in this collaboration ({selectedIds.size} selected)
            </label>
            {products.length === 0 ? (
              <p className="text-sm text-gray-500">No products found. Add products first.</p>
            ) : (
              <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto divide-y divide-gray-100">
                {products.map((product) => (
                  <label
                    key={product.docId}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(product.docId)}
                      onChange={() => toggleProduct(product.docId)}
                      className="h-4 w-4 accent-gray-700"
                    />
                    {product.images?.[0]?.url && (
                      <img src={product.images[0].url} alt="" className="w-8 h-10 object-cover rounded" />
                    )}
                    <span className="text-sm text-gray-700 truncate">{product.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gray-800 text-white py-2.5 rounded-md font-medium hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : collab ? "Save Changes" : "Add Collaboration"}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-md font-medium hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function getColorHex(colorName) {
  const colors = {
    black: "#000000", white: "#F5F5F5", navy: "#1E3A8A", red: "#D7263D",
    blue: "#3B82F6", green: "#22C55E", yellow: "#EAB308", pink: "#EC4899",
    gray: "#6B7280", grey: "#6B7280", brown: "#92400E", purple: "#A855F7",
    orange: "#F97316", beige: "#F5F5DC", cream: "#FFFDD0",
  };
  return colors[colorName.toLowerCase()] || "#6B7280";
}

export default AdminPanel;
