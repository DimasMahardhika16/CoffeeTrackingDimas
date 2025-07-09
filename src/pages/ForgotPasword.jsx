import { useState } from "react";
import { Link } from "react-router-dom";
import { TextInput, Button } from "@mantine/core";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { resetPassword } = useAuth(); // pastikan fungsi ini tersedia di context
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await resetPassword(email);
      setMessage("Link reset password telah dikirim ke email kamu.");
    } catch (err) {
      console.error("Reset error:", err.message);
      setError("Gagal mengirim email. Coba lagi.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cyan-300 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold font-mono text-center mb-4">
          Forgot Password
        </h2>

        {message && <p className="text-green-600 mb-3 text-sm">{message}</p>}
        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="filled"
            size="sm"
            radius="md"
            fullWidth
          >
            Send Reset Link
          </Button>
        </form>

        <p className="text-center mt-4 text-sm font-mono">
          Remember Password?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
