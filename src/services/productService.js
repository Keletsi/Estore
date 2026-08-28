import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  addDoc 
} from "firebase/firestore";
import { db } from "../firebase";

const productsRef = collection(db, "products");

export const getAllProducts = async () => {
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      _id: doc.id,
      ...data,
      // prefer explicit category, fall back to legacy gender field
      category: data.category || data.gender || undefined,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getProductById = async (id) => {
  try {
    console.log("getProductById called with id:", id, "Firestore project:", db.app.options.projectId);
    const docRef = doc(db, "products", id);
    console.log("docRef path:", docRef.path);
    
    const snapshot = await getDoc(docRef);
    console.log("snapshot exists:", snapshot.exists(), "snapshot id:", snapshot.id, "snapshot ref:", snapshot.ref.path);
    if (!snapshot.exists()) return null;
    const data = snapshot.data();
    return {
      id: snapshot.id,
      _id: snapshot.id,
      ...data,
      // normalize category for backward compatibility
      category: data.category || data.gender || undefined,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const debugListAllProducts = async () => {
  const snapshot = await getDocs(productsRef);
  console.log("=== All products in Firestore ===");
  console.log("Count:", snapshot.size);
  snapshot.docs.forEach(doc => console.log("ID:", doc.id, "Name:", doc.data().name));
  alert("Products: " + snapshot.docs.map(d => d.id + " (" + d.data().name + ")").join(", "));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getProductsByCategory = async (category, type = null) => {
  try {
    let q;
    if (type) {
      q = query(
        productsRef,
        where("category", "==", category),
        where("type", "==", type)
      );
    } else {
      q = query(
        productsRef,
        where("category", "==", category)
      );
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        _id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      };
    });
  } catch (error) {
    console.error("Error fetching products by category with index, falling back:", error);
    const snapshot = await getDocs(productsRef);
    const products = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        _id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      };
    });
    return products.filter(p => (p.category || p.gender) === category && (!type || p.type === type));
  }
};

export const getNewArrivals = async (limitCount = 8) => {
  try {
    console.log("getNewArrivals - db project:", db.app.options.projectId);
    const snapshot = await getDocs(productsRef);
    console.log("getNewArrivals found:", snapshot.size, "docs", snapshot.docs.map(d => d.id));
    const products = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        _id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      };
    });
    return products
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limitCount);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    throw error;
  }
};

export const addProduct = async (productData, adminUid) => {
  try {
    const adminDoc = await getDoc(doc(db, "users", adminUid));
    if (!adminDoc.exists() || adminDoc.data().role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }
    
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};