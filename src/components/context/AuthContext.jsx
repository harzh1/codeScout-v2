import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../utils/api";
import { simpleJwtDecode } from "../../utils/helpers";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReloginModal, setShowReloginModal] = useState(false); // State to control the modal

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const setSession = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    const decoded = simpleJwtDecode(token);
    if (decoded) {
      setUser({ id: decoded.userId, email: decoded.email });
    }
  };

  // This useEffect now runs only once to set up the interceptor and check initial token
  useEffect(() => {
    // Axios response interceptor to handle 401 errors globally
    const interceptor = axios.interceptors.response.use(
      (response) => response, // Directly return successful responses
      (error) => {
        // Check if the error is a 401 Unauthorized response, which signals an invalid/expired token
        if (error.response && error.response.status === 401) {
          logout(); // Log out the user
          setShowReloginModal(true); // Show the relogin modal
        }
        return Promise.reject(error); // Reject the promise for other errors
      }
    );

    // Check for existing token on initial app load
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decoded = simpleJwtDecode(storedToken);
      // Check if token exists and is expired by comparing 'exp' with current time
      if (decoded && decoded.exp * 1000 < Date.now()) {
        logout();
        setShowReloginModal(true);
      } else if (decoded) {
        setSession(storedToken);
      } else {
        logout(); // If token is malformed
      }
    }
    setLoading(false);

    // Cleanup function to eject the interceptor when the app unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/users/login`, { email, password });
    setSession(res.data.token);
    setShowReloginModal(false); // Hide modal on successful login
  };

  const register = async (firstName, lastName, email, password) => {
    const res = await axios.post(`${API_URL}/users/signup`, {
      firstName,
      lastName,
      email,
      password,
    });
    setSession(res.data.token);
    setShowReloginModal(false); // Hide modal on successful registration
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        register,
        logout,
        setSession,
        showReloginModal,
        setShowReloginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
