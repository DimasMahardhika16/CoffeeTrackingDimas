import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";

// REGISTER USER
export const register = async (email, password) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    role: "user",
    lastActive: Timestamp.now(),
  });
};

// LOGIN USER (ambil role juga)
export const login = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, "users", cred.user.uid));
  const userData = userDoc.data();

  return {
    user: cred.user,
    role: userData?.role || "user",
    isAdmin: userData?.role === "admin",
  };
};

// LOGOUT
export const logout = () => signOut(auth);

// UPDATE LAST ACTIVE
export const touchLastActive = (uid) =>
  updateDoc(doc(db, "users", uid), { lastActive: Timestamp.now() });

// ADD COFFEE LOG
export const addLog = (uid, coffeeType, amountML) =>
  addDoc(collection(db, "coffee_logs"), {
    userId: uid,
    date: Timestamp.now(),
    coffeeType,
    amountML,
  });

// FETCH USER'S COFFEE LOGS
export const fetchLogsForUser = async (uid) => {
  const q = query(collection(db, "coffee_logs"), where("userId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// FETCH ALL USERS
export const fetchAllUsers = async () => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// DELETE USER & THEIR COFFEE LOGS
export const deleteUser = async (uid) => {
  await deleteDoc(doc(db, "users", uid));
  const q = query(collection(db, "coffee_logs"), where("userId", "==", uid));
  const snap = await getDocs(q);
  const deletePromises = snap.docs.map((d) =>
    deleteDoc(doc(db, "coffee_logs", d.id))
  );
  await Promise.all(deletePromises);
};
