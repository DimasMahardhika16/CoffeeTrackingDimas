import { useAuth } from "../context/AuthContext";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const { globalUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const header = (
    <header className="border-4 flex justify-between items-center p-6 bg-white shadow-md">
      <div className="font-mono font-bold text-xl">
        <h1>Caffeine Fellas</h1>
        <p className="text-sm font-normal">For Enjoy & Relax Coffee</p>
      </div>
      <div className="flex items-center gap-4">
        {globalUser && (
          <>
            <span className="text-sm font-medium">{globalUser.email}</span>
            <Button color="Burlywood" variant="filled" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </div>
    </header>
  );

  const footer = (
    <footer className="rounded-lg border-4 text-center text-sm font-mono text-black">
      <p className="font-bold font-mono">
        <span className="font-bold font-mono ml-4">Caffeine Fellas</span> was
        made by Dimas
      </p>
    </footer>
  );

  return (
    <div className="content">
      {header}
      <main className="border-4 rounded-md p-4 min-h-screen mt-4 mb-4">
        {children}
      </main>
      {footer}
    </div>
  );
}
