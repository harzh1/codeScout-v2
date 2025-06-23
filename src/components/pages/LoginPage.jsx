import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../../utils/api";

const LoginPage = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login(formData.email, formData.password);
      setCurrentPage("dashboard");
    } catch (err) {
      if (err.message === "Network Error") {
        setError(
          "Cannot connect to server. Please check your network or if the server is running."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to the backend endpoint for Google authentication
    window.location.href = `${API_URL}/users/google?redirect_uri=${window.location.origin}/auth/callback`;
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
        <form onSubmit={onSubmit} className="card-bg p-8 rounded-lg">
          {error && (
            <p className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
              {error}
            </p>
          )}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg transition-colors mb-4 disabled:bg-gray-500"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-600" />
            <span className="mx-2 text-gray-400">OR</span>
            <hr className="flex-grow border-gray-600" />
          </div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Sign in with Google
          </button>
          <p className="text-center mt-4 text-gray-400">
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage("register");
              }}
              className="text-sky-400 hover:underline"
            >
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
