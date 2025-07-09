import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@mantine/core";

export default function NotFound() {
  const { globalUser, globalData } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    if (globalUser) {
      if (globalData?.role === "admin") {
        navigate("/admin/dashboard-admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - What Are U Looking For?</h1>
      <Button
        onClick={handleBack}
        variant="filled"
        radius={10}
        color="Burlywood"
      >
        {globalUser ? "Back to Dashboard" : "Back to Login"}
      </Button>
    </div>
  );
}
