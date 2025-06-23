import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./components/context/AuthContext.jsx";

// Import Pages
import HomePage from "./components/pages/HomePage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import DashboardPage from "./components/pages/DashboardPage";
import ContestsPage from "./components/pages/ContestsPage";
import PracticePage from "./components/pages/PracticePage";
import SettingsPage from "./components/pages/SettingsPage";
import AuthCallbackPage from "./components/pages/AuthCallbackPage";

// Import Components
import FloatingNav from "./components/common/FloatingNav";
import ReloginModal from "./components/common/ReloginModal"; // Import the new modal

function App() {
  const [currentPage, setCurrentPage] = useState(
    window.location.pathname.substring(1) || "home"
  );
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const { token, loading, showReloginModal, setShowReloginModal } =
    useContext(AuthContext);

  useEffect(() => {
    if (
      !loading &&
      token &&
      (currentPage === "home" ||
        currentPage === "login" ||
        currentPage === "register" ||
        currentPage === "")
    ) {
      setCurrentPage("dashboard");
    }
  }, [token, loading, currentPage]);

  // Handler for the modal's button to hide it and go to the login page
  const handleLoginRedirect = () => {
    setShowReloginModal(false);
    setCurrentPage("login");
  };

  const renderPage = () => {
    if (currentPage === "auth/callback") {
      return <AuthCallbackPage setCurrentPage={setCurrentPage} />;
    }

    if (token) {
      switch (currentPage) {
        case "contests":
          return <ContestsPage />;
        case "practice":
          return <PracticePage />;
        case "settings":
          return <SettingsPage setCurrentPage={setCurrentPage} />;
        case "dashboard":
        case "home":
        default:
          return <DashboardPage />;
      }
    }

    switch (currentPage) {
      case "login":
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case "register":
        return <RegisterPage setCurrentPage={setCurrentPage} />;
      case "contests":
        return <ContestsPage />;
      case "home":
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen text-gray-200 aurora-bg relative">
        <FloatingNav
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isExpanded={isNavExpanded}
          setIsExpanded={setIsNavExpanded}
        />
        <div
          className="transition-all duration-300 ease-in-out"
          style={{ paddingLeft: isNavExpanded ? "17rem" : "6rem" }}
        >
          <main
            key={currentPage}
            className="p-4 md:p-8 lg:p-12 animate-fade-in"
          >
            {renderPage()}
          </main>
        </div>
      </div>
      {/* Render the modal conditionally at the top level of the app */}
      <ReloginModal
        isOpen={showReloginModal}
        onLoginRedirect={handleLoginRedirect}
      />
    </>
  );
}

export default App;
