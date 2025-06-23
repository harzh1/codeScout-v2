import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../../utils/api";

const CodingPlatforms = ({ platforms, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [platformUsernames, setPlatformUsernames] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // A fixed list of supported platforms for the UI
  const supportedPlatforms = [
    { name: "Codeforces", url: "codeforces.com" },
    { name: "LeetCode", url: "leetcode.com" },
    { name: "CodeChef", url: "codechef.com" },
    { name: "AtCoder", url: "atcoder.jp" },
  ];

  // Initialize the state with usernames from the backend
  useEffect(() => {
    const initialUsernames = {};
    supportedPlatforms.forEach((p) => {
      const existingPlatform = platforms.find(
        (backendPlatform) => backendPlatform.platformUrl === p.url
      );
      initialUsernames[p.url] = existingPlatform
        ? existingPlatform.username
        : "";
    });
    setPlatformUsernames(initialUsernames);
  }, [platforms]);

  const handleSave = async () => {
    setLoading(true);
    // Loop through the edited usernames and send update requests
    for (const [platformUrl, newUsername] of Object.entries(
      platformUsernames
    )) {
      try {
        // Using PATCH to update user details
        await axios.patch(`${API_URL}/users/${user.id}`, {
          platformUrl,
          username: newUsername,
        });
      } catch (err) {
        console.error(`Failed to update handle for ${platformUrl}`, err);
        // You might want to show an error message to the user here
      }
    }
    onUpdate(); // Trigger parent component to refetch all user data
    setIsEditing(false);
    setLoading(false);
  };

  const handleUsernameChange = (url, value) => {
    setPlatformUsernames((prev) => ({ ...prev, [url]: value }));
  };

  return (
    <div className="card-bg p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Coding Platforms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {supportedPlatforms.map((p) => (
          <div key={p.url}>
            <label className="text-sm font-semibold text-gray-400">
              {p.name}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={platformUsernames[p.url] || ""}
                onChange={(e) => handleUsernameChange(p.url, e.target.value)}
                className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`${p.name} handle`}
              />
            ) : (
              <p className="text-base font-mono mt-1 p-2 bg-gray-800/50 rounded h-10 flex items-center">
                {platformUsernames[p.url] || (
                  <span className="text-gray-500">Not set</span>
                )}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="clearfix">
        {isEditing ? (
          <div className="flex flex-col md:flex-row gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500 transition-colors"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 md:flex-initial bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="float-right bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Edit Handles
          </button>
        )}
      </div>
    </div>
  );
};

export default CodingPlatforms;
