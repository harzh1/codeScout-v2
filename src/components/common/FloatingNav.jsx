import React, { useContext } from "react";
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
}) => {
  const { token, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    setCurrentPage("home"); // Redirect to home after logout
  };

  // Sub-component for navigation items for cleanliness
  const NavItem = ({ icon, text, pageName }) => (
    <li
      className={`flex items-center p-3 my-1 cursor-pointer rounded-lg transition-all duration-200 group relative ${
        !isExpanded ? "justify-center" : ""
      } ${
        currentPage === pageName
          ? "bg-blue-500/80 text-white"
          : "text-gray-300 hover:bg-gray-700/80 hover:text-white"
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
      {/* Tooltip for collapsed state */}
      {!isExpanded && (
        <span className="absolute left-full ml-4 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-gray-800 text-xs font-bold transition-all duration-100 scale-0 group-hover:scale-100 origin-left">
          {text}
        </span>
      )}
    </li>
  );

  return (
    <aside
      className={`fixed top-5 left-5 bg-gray-900/50 backdrop-blur-xl text-white shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-50 rounded-2xl border border-white/10 ${
        isExpanded ? "w-64" : "w-20"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center justify-center p-4 h-20 border-b border-white/10">
        <div className="relative h-full flex items-center w-full">
          {/* Expanded Logo */}
          <span
            className={`font-bold text-2xl transition-opacity duration-200 whitespace-nowrap ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            <span>code</span>
            <span className="text-sky-400">Scout</span>
          </span>
          {/* Collapsed Logo */}
          <span
            className={`font-bold text-2xl absolute left-1/2 -translate-x-1/2 transition-opacity duration-200 ${
              isExpanded ? "opacity-0" : "opacity-100"
            }`}
          >
            c<span className="text-sky-400">S</span>
          </span>
        </div>
      </div>
      <ul className="flex-1 p-2">
        {token ? (
          <>
            <NavItem
              pageName="dashboard"
              icon={<GridIcon />}
              text="Dashboard"
            />
            <NavItem
              pageName="contests"
              icon={<TrophyIcon />}
              text="Contests"
            />
            <NavItem
              pageName="practice"
              icon={<PracticeIcon />}
              text="Practice Sheet"
            />
            <NavItem
              pageName="settings"
              icon={<SettingsIcon />}
              text="Settings"
            />
          </>
        ) : (
          <>
            <NavItem pageName="home" icon={<HomeIcon />} text="Home" />
            <NavItem
              pageName="contests"
              icon={<TrophyIcon />}
              text="Contests"
            />
          </>
        )}
      </ul>
      <div className="p-2 border-t border-white/10">
        {token ? (
          <li
            onClick={handleLogout}
            className={`flex items-center p-3 my-1 cursor-pointer rounded-lg transition-all duration-200 group relative text-gray-300 hover:bg-red-500/80 hover:text-white ${
              !isExpanded ? "justify-center" : ""
            }`}
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
        ) : (
          <NavItem pageName="login" icon={<LoginIcon />} text="Login" />
        )}
      </div>
    </aside>
  );
};

export default FloatingNav;
