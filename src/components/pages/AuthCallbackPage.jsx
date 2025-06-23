import React, { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AuthCallbackPage = ({ setCurrentPage }) => {
  const { setSession } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Set the token in our auth context/local storage
      setSession(token);
      // Clean up the URL by removing the token parameter
      window.history.replaceState({}, document.title, "/");
      // Redirect to the dashboard
      setCurrentPage("dashboard");
    } else {
      // If no token is found, redirect to the login page
      setCurrentPage("login");
    }
  }, [setSession, setCurrentPage]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-center text-xl">Authenticating...</div>
    </div>
  );
};

export default AuthCallbackPage;
