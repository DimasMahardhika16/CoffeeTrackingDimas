import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../config/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [globalUser, setGlobalUser] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Buat dokumen user baru dengan field default
    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      role: "user",
      lastActive: serverTimestamp(),
      coffeeConsumptionHistory: {}, // tambahkan default kosong
    });

    return cred;
  };

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "users", cred.user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      throw new Error("Data user tidak ditemukan");
    }

    // ✅ Update lastActive saat user login
    await updateDoc(userRef, {
      lastActive: serverTimestamp(),
    });

    const data = snap.data();
    setGlobalData(data);

    return {
      uid: cred.user.uid,
      email: cred.user.email,
      role: data.role || "user",
    };
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const logout = () => {
    setGlobalUser(null);
    setGlobalData(null);
    return signOut(auth);
  };

  // ✅ Tambahan: untuk sinkronisasi manual setelah update firestore
  const refreshUserData = async () => {
    if (!auth.currentUser) return;

    const userRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setGlobalData(data);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setGlobalUser(user);

      if (!user) {
        setGlobalData(null);
        return;
      }

      setIsLoading(true);
      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          await setDoc(userRef, {
            email: user.email,
            role: "user",
            lastActive: serverTimestamp(),
            coffeeConsumptionHistory: {},
          });
          setGlobalData({
            email: user.email,
            role: "user",
            coffeeConsumptionHistory: {},
          });
        } else {
          const data = docSnap.data();
          setGlobalData(data);

          await updateDoc(userRef, { lastActive: serverTimestamp() });
        }
      } catch (err) {
        console.error("AuthContext error:", err);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    globalUser,
    globalData, // { email, role, coffeeConsumptionHistory }
    setGlobalData,
    isLoading,
    signUp,
    login,
    logout,
    resetPassword,
    refreshUserData, // ✅ expose function baru
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
