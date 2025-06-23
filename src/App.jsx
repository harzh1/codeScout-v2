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
import ReloginModal from "./components/common/ReloginModal";

// A new simple header component that only appears on mobile screens.
const MobileHeader = ({ onMenuClick }) => (
  <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-16 bg-gray-900/80 backdrop-blur-xl border-b border-white/10">
    <div className="font-bold text-2xl">
      <span>code</span>
      <span className="text-sky-400">Scout</span>
    </div>
    <button
      onClick={onMenuClick}
      className="p-2 text-gray-300 hover:text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16m-7 6h7"
        />
      </svg>
    </button>
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState(
    window.location.pathname.substring(1) || "home"
  );
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
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
        <MobileHeader onMenuClick={() => setIsMobileNavOpen(true)} />

        <FloatingNav
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isExpanded={isNavExpanded}
          setIsExpanded={setIsNavExpanded}
          isMobileNavOpen={isMobileNavOpen}
          setIsMobileNavOpen={setIsMobileNavOpen}
        />

        {/* Main content area with responsive and dynamic padding */}
        <div
          className={`
            pt-16 md:pt-0 
            transition-all duration-300 ease-in-out
            ${isNavExpanded ? "md:pl-64" : "md:pl-20"}
          `}
        >
          <main
            key={currentPage}
            className="p-4 md:p-8 lg:p-12 animate-fade-in min-h-screen"
          >
            {renderPage()}
          </main>
        </div>
      </div>
      <ReloginModal
        isOpen={showReloginModal}
        onLoginRedirect={handleLoginRedirect}
      />
    </>
  );
}

export default App;
