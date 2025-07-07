import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function Authentication(props) {
  const { handleCloseModal } = props;
  const [isRegistration, setIsRegistration] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);

  const { signUp, login } = useAuth();

  async function handleAuthenticate() {
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

      if (isRegistration) {
        await signUp(trimmedEmail, trimmedPassword);
      } else {
        await login(trimmedEmail, trimmedPassword);
      }

      handleCloseModal();
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setIsAuthenticating(false);
    }
  }

  return (
    <>
      <h2 className="sign-up-text">{isRegistration ? "Sign Up" : "Login"}</h2>
      <p className="mb-2">
        {isRegistration ? "Create an account" : "Sign in to your account!"}
      </p>
      {error && <p>❌ {error}</p>}
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="Email"
        className="border-2 rounded-md mb-3"
      />
      <input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="******"
        type="password"
        className="border-2 rounded-md"
      />
      <button
        onClick={handleAuthenticate}
        className="border-2 rounded-md w-25 mt-3 hover:bg-blue-400 cursor-pointer"
      >
        {isAuthenticating ? "Authenticating..." : "Submit"}
      </button>
      <hr />
      <div className="register-content">
        <p>
          {isRegistration
            ? "Already have an account?"
            : "Don't have an account?"}
        </p>
        <button
          className="border-2 rounded-md w-25 hover:bg-blue-400 cursor-pointer"
          onClick={() => {
            setIsRegistration(!isRegistration);
          }}
        >
          {isRegistration ? "Sign in" : "Sign up"}
        </button>
      </div>
    </>
  );
}
