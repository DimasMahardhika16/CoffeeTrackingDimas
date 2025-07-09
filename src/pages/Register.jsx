import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { Button, PasswordInput, TextInput } from "@mantine/core";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    try {
      const res = await signUp(email, password);
      const user = res.user;

      // Simpan data pengguna ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "user",
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Register error:", error.message);
      setErrMsg("Gagal mendaftar. Coba lagi.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center font-mono">Register</h2>
        <h2 className="font-mono text-center mb-5">
          Please Create Your Account If You New Member
        </h2>

        {errMsg && <p className="text-red-600 mb-4">{errMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <TextInput
              label="Email"
              placeholder="Enter your email @gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <PasswordInput
              label="Password"
              placeholder="Enter Your Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="filled"
            radius={"md"}
            size="sm"
            fullWidth
            color="Burlywood"
          >
            Register
          </Button>
        </form>

        <p className="text-center mt-4 text-sm font-mono">
          Do You Have Account?{" "}
          <Link to="/login" className="text-blue-900 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
