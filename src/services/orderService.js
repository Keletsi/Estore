import { 
  collection, 
  addDoc, 
  getDocs, 
  doc,
  getDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";

const ordersRef = collection(db, "orders");

export const createOrder = async (userId, cartItems, totalPrice, shippingInfo, paymentInfo = {}) => {
  try {
    const orderData = {
      userId,
      items: cartItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image,
      })),
      totalPrice,
      status: "pending",
      shippingInfo,
      paymentRef: paymentInfo.paymentRef || null,
      paymentStatus: paymentInfo.paymentStatus || "pending",
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(ordersRef, orderData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  try {
    const snapshot = await getDocs(collection(db, "orders"));
    const allOrders = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      };
    });
    return allOrders
      .filter(o => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const getOrderById = async (orderId) => {
  try {
    const snapshot = await getDoc(doc(db, "orders", orderId));
    if (!snapshot.exists()) return null;
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};