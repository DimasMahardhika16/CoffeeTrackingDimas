import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Authentication() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleAuthenticate(e) {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!trimmedPassword || trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (isAuthenticating) return;

    try {
      setIsAuthenticating(true);
      setError(null);
      await login(trimmedEmail, trimmedPassword);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.message);
      setError("Email or password is incorrect.");
    } finally {
      setIsAuthenticating(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleAuthenticate} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 p-2 rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 p-2 rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-950 text-white py-2 rounded-md hover:bg-orange-900"
            disabled={isAuthenticating}
          >
            {isAuthenticating ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
