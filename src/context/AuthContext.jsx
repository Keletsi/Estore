import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const normalizeAdminEmails = () =>
  (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

const createUserDocument = async (user) => {
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  const adminEmails = normalizeAdminEmails();
  const isLocalAdmin = adminEmails.includes((user.email || "").trim().toLowerCase());

  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    role: isLocalAdmin ? "admin" : "user",
    updatedAt: serverTimestamp(),
  };

  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      ...userData,
      createdAt: serverTimestamp(),
    });
    return;
  }

  const existingRole = userDoc.data()?.role;
  if (existingRole !== userData.role) {
    await setDoc(userDocRef, userData, { merge: true });
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await createUserDocument(user);
    return user;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          const adminEmails = normalizeAdminEmails();
          const isAdmin = adminEmails.includes((user.email || "").trim().toLowerCase());

          if (isAdmin && userData.role !== "admin") {
            await setDoc(doc(db, "users", user.uid), { role: "admin", email: user.email, updatedAt: serverTimestamp() }, { merge: true });
            userData.role = "admin";
          }

          if (!userData.email && user.email) {
            userData.email = user.email;
          }

          setCurrentUser({ ...user, ...userData });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    register,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
