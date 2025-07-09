import { Routes, Route } from "react-router-dom";
import UserDashboard from "./UserDashboard";
import ProtectedRoute from "../routes/ProtectedRoute";

export default function UserRoutes() {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
