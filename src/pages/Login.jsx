import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, PasswordInput, TextInput } from "@mantine/core";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    try {
      const { role } = await login(email, password);

      if (role === "admin") {
        navigate("/admin/dashboard-admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setErrMsg("Email atau password salah");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-grey-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold font-mono text-center">Login</h2>
        <h2 className="font-mono text-center mb-5">Hellow Fellas!</h2>

        {errMsg && <p className="text-red-600 mb-4">{errMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <TextInput
              label="Email"
              type="email"
              placeholder="Enter your email @gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <PasswordInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end mt-2 mb-2">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-900 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <Button
              type="submit"
              variant="filled"
              size="sm"
              radius={"md"}
              fullWidth
              color="Burlywood"
            >
              Login
            </Button>
          </div>
        </form>

        <p className="text-center mt-4 text-sm font-mono">
          Don&apos;t have account?{" "}
          <Link to="/register" className="text-blue-900 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
