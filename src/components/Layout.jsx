import { useState } from "react";
import Authentication from "./Authentication";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import { Button } from "@mantine/core";

export default function Layout(props) {
  const { children } = props;
  const [showModal, setShowModal] = useState(false);
  const { globalUser, logout } = useAuth();

  const header = (
    <header className="border-4">
      <div className="font-mono font-bold p-7 text-xl">
        <h1>Caffeine Fellas</h1>
        <p>For Enjoy & Relax Coffee</p>
      </div>
      {globalUser ? (
        <Button onClick={logout}>
          <p>Logout</p>
        </Button>
      ) : (
        <Button
          className="mr-8"
          color="rgba(112, 46, 8, 1)"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <p>Sign Up For Free</p>
          <i className="fa-solid fa-mug-saucer mr-4 ml-4"></i>
        </Button>
      )}
    </header>
  );

  const footer = (
    <footer className="rounded-lg border-4">
      <p className="ml-5 font-bold font-mono">
        <span className="text-gradient">Caffeine Fellas</span> was made by Dimas{" "}
      </p>
    </footer>
  );

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <>
      {showModal && (
        <Modal handleCloseModal={handleCloseModal}>
          <Authentication handleCloseModal={handleCloseModal} />
        </Modal>
      )}
      {header}
      <main className="border-4 rounded-md">{children}</main>
      {footer}
    </>
  );
}
