// LogoutButton.jsx
import React from "react";
import { Button } from "react-bootstrap";
import { useUser } from "../UserContext";

const LogoutButton = () => {
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // Redirect to login page after logout
  };

  return (
    <Button variant="danger" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
