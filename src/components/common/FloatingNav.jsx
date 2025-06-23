import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  HomeIcon,
  TrophyIcon,
  GridIcon,
  PracticeIcon,
  SettingsIcon,
  LoginIcon,
  LogoutIcon,
} from "./Icons";

const FloatingNav = ({
  currentPage,
  setCurrentPage,
  isExpanded,
  setIsExpanded,
  isMobileNavOpen,
  setIsMobileNavOpen,
}) => {
  const { token, logout } = useContext(AuthContext);

  // This effect now correctly closes the mobile nav panel ONLY when a navigation item is clicked (i.e., currentPage changes).
  useEffect(() => {
    if (isMobileNavOpen) {
      setIsMobileNavOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleLogout = () => {
    logout();
    setCurrentPage("home");
  };

  const MobileNavItem = ({ icon, text, pageName }) => (
    <li
      className={`flex items-center p-3 my-1 cursor-pointer rounded-lg transition-colors group ${
        currentPage === pageName
          ? "bg-blue-500/80 text-white"
          : "text-gray-300 hover:bg-gray-700/80"
      }`}
      onClick={() => setCurrentPage(pageName)}
    >
      {icon}
      <span className="ml-4">{text}</span>
    </li>
  );

  const DesktopNavItem = ({ icon, text, pageName }) => (
    <li
      className={`flex items-center p-3 my-1 cursor-pointer rounded-lg transition-all duration-200 group relative ${
        !isExpanded ? "justify-center" : ""
      } ${
        currentPage === pageName
          ? "bg-blue-500/80 text-white"
          : "text-gray-300 hover:bg-gray-700/80"
      }`}
      onClick={() => setCurrentPage(pageName)}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${
          isExpanded ? "w-40 ml-4" : "w-0"
        }`}
      >
        {text}
      </span>
      {!isExpanded && (
        <span className="absolute left-full ml-4 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-gray-800 text-xs font-bold transition-all duration-100 scale-0 group-hover:scale-100 origin-left">
          {text}
        </span>
      )}
    </li>
  );

  return (
    <>
      {isMobileNavOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMobileNavOpen(false)}
        ></div>
      )}

      <aside
        className={`
                    fixed bg-gray-900/80 backdrop-blur-xl text-white shadow-2xl flex flex-col z-50
                    h-full w-64 md:h-auto md:w-20
                    ${isMobileNavOpen ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0
                    md:top-5 md:left-5 md:rounded-2xl md:border md:border-white/10
                    md:hover:w-64
                    transition-all duration-300 ease-in-out 
                `}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex items-center justify-between p-4 h-20 border-b border-white/10">
          <div className="relative h-full flex items-center w-full">
            <span
              className={`font-bold text-2xl whitespace-nowrap md:transition-opacity md:duration-200 ${
                isExpanded || isMobileNavOpen ? "opacity-100" : "md:opacity-0"
              }`}
            >
              <span>code</span>
              <span className="text-sky-400">Scout</span>
            </span>
            <span
              className={`hidden md:block font-bold text-2xl absolute left-1/2 -translate-x-1/2 transition-opacity duration-200 ${
                isExpanded ? "opacity-0" : "opacity-100"
              }`}
            >
              c<span className="text-sky-400">S</span>
            </span>
          </div>
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMobileNavOpen(false)}
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
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <ul className="md:hidden flex-1 p-2">
          {token ? (
            <>
              <MobileNavItem
                pageName="dashboard"
                icon={<GridIcon />}
                text="Dashboard"
              />
              <MobileNavItem
                pageName="contests"
                icon={<TrophyIcon />}
                text="Contests"
              />
              <MobileNavItem
                pageName="practice"
                icon={<PracticeIcon />}
                text="Practice Sheet"
              />
              <MobileNavItem
                pageName="settings"
                icon={<SettingsIcon />}
                text="Settings"
              />
            </>
          ) : (
            <>
              <MobileNavItem pageName="home" icon={<HomeIcon />} text="Home" />
              <MobileNavItem
                pageName="contests"
                icon={<TrophyIcon />}
                text="Contests"
              />
            </>
          )}
        </ul>

        <ul className="hidden md:block flex-1 p-2">
          {token ? (
            <>
              <DesktopNavItem
                pageName="dashboard"
                icon={<GridIcon />}
                text="Dashboard"
              />
              <DesktopNavItem
                pageName="contests"
                icon={<TrophyIcon />}
                text="Contests"
              />
              <DesktopNavItem
                pageName="practice"
                icon={<PracticeIcon />}
                text="Practice Sheet"
              />
              <DesktopNavItem
                pageName="settings"
                icon={<SettingsIcon />}
                text="Settings"
              />
            </>
          ) : (
            <>
              <DesktopNavItem pageName="home" icon={<HomeIcon />} text="Home" />
              <DesktopNavItem
                pageName="contests"
                icon={<TrophyIcon />}
                text="Contests"
              />
            </>
          )}
        </ul>

        <div className="p-2 border-t border-white/10">
          {token ? (
            <>
              {/* Mobile Logout Button */}
              <li
                onClick={handleLogout}
                className="md:hidden flex items-center p-3 my-1 cursor-pointer rounded-lg group text-gray-300 hover:bg-red-500/80 hover:text-white"
              >
                <LogoutIcon />
                <span className="ml-4">Logout</span>
              </li>
              {/* Desktop Logout Button */}
              <li
                onClick={handleLogout}
                className="hidden md:flex items-center p-3 my-1 cursor-pointer rounded-lg group text-gray-300 hover:bg-red-500/80 hover:text-white justify-center relative"
              >
                <LogoutIcon />
                <span
                  className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${
                    isExpanded ? "w-40 ml-4" : "w-0"
                  }`}
                >
                  Logout
                </span>
                {!isExpanded && (
                  <span className="absolute left-full ml-4 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-gray-800 text-xs font-bold transition-all duration-100 scale-0 group-hover:scale-100 origin-left">
                    Logout
                  </span>
                )}
              </li>
            </>
          ) : (
            <>
              <div className="md:hidden">
                <MobileNavItem
                  pageName="login"
                  icon={<LoginIcon />}
                  text="Login"
                />
              </div>
              <div className="hidden md:block">
                <DesktopNavItem
                  pageName="login"
                  icon={<LoginIcon />}
                  text="Login"
                />
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default FloatingNav;
