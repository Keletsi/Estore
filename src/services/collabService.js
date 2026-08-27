import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const collabsRef = collection(db, "collaborations");

const mapCollab = (docSnap) => {
  const data = docSnap.data();
  return {
    docId: docSnap.id,
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
  };
};

export const getCollaborations = async () => {
  try {
    const snapshot = await getDocs(collabsRef);
    const collabs = snapshot.docs.map(mapCollab);
    return collabs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } catch (error) {
    console.error("Error fetching collaborations:", error);
    throw error;
  }
};

export const getCollaborationById = async (id) => {
  try {
    const docRef = doc(db, "collaborations", id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return mapCollab(snapshot);
  } catch (error) {
    console.error("Error fetching collaboration:", error);
    throw error;
  }
};

export const addCollaboration = async (collabData) => {
  try {
    const docRef = await addDoc(collabsRef, {
      ...collabData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding collaboration:", error);
    throw error;
  }
};

export const updateCollaboration = async (docId, collabData) => {
  try {
    await updateDoc(doc(db, "collaborations", docId), {
      ...collabData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating collaboration:", error);
    throw error;
  }
};

export const deleteCollaboration = async (docId) => {
  try {
    await deleteDoc(doc(db, "collaborations", docId));
  } catch (error) {
    console.error("Error deleting collaboration:", error);
    throw error;
  }
};

export const getProductsByIds = async (productIds = []) => {
  if (!productIds.length) return [];
  const results = await Promise.all(
    productIds.map(async (pid) => {
      try {
        const snap = await getDoc(doc(db, "products", pid));
        if (!snap.exists()) return null;
        const data = snap.data();
        return {
          id: snap.id,
          _id: snap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        };
      } catch (error) {
        console.error("Error fetching collab product:", pid, error);
        return null;
      }
    })
  );
  return results.filter(Boolean);
};
