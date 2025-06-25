import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../../utils/api";
import CodingPlatforms from "../settings/CodingPlatforms";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";

const SettingsPage = ({ setCurrentPage }) => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState({ firstName: "", lastName: "" });
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUserData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [profileRes, platformsRes] = await Promise.all([
        axios.get(`${API_URL}/users/${user.id}`),
        axios.get(`${API_URL}/users/${user.id}/platforms`),
      ]);
      setProfile(profileRes.data);
      setPlatforms(platformsRes.data);
    } catch (err) {
      setError("Could not load user data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      await axios.patch(`${API_URL}/users/${user.id}`, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        profileUpdate: true, // Flag to indicate this is a profile update
      });
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000); // Clear message after 3 seconds
    } catch (err) {
      setError("Failed to update profile.");
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setError("");
    try {
      await axios.delete(`${API_URL}/users/${user.id}`);
      logout(); // Log out the user from the frontend
      setCurrentPage("home"); // Redirect to home page
    } catch (err) {
      setError("Failed to delete account. Please try again.");
      console.error(err);
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading Settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-8">Settings</h1>
      <div className="space-y-8">
        {/* Profile Information Card */}
        <div className="card-bg p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          {success && (
            <div className="bg-green-500/20 text-green-400 p-3 rounded-lg mb-4">
              {success}
            </div>
          )}
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName || ""}
                  onChange={handleProfileChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName || ""}
                  onChange={handleProfileChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email || ""}
                disabled
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 cursor-not-allowed"
              />
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Coding Platforms */}
        <CodingPlatforms
          user={user}
          platforms={platforms}
          onUpdate={fetchUserData}
        />

        {/* Account Management Card */}
        <div className="card-bg p-6 rounded-lg border border-red-500/30">
          <h2 className="text-2xl font-bold mb-2">Account Management</h2>
          <p className="text-gray-400 mb-4">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Delete Account
          </button>
        </div>
        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mt-4 text-center">
            {error}
          </div>
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        loading={deleteLoading}
      />
    </div>
  );
};

export default SettingsPage;
