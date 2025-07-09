import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import ProtectedRoute from "../routes/ProtectedRoute";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
