import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { globalUser, globalData, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;
  if (!globalUser) return <Navigate to="/login" />;
  if (adminOnly && globalData?.role !== "admin")
    return <Navigate to="/dashboard" />;

  return children;
}
