import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../../utils/api";
import PerformanceWidgets from "../dashboard/PerformanceWidgets";
import TodaysContests from "../dashboard/TodaysContests";

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [profileRes, platformsRes] = await Promise.all([
          axios.get(`${API_URL}/users/${user.id}`),
          axios.get(`${API_URL}/users/${user.id}/platforms`),
        ]);
        setProfile(profileRes.data);
        setPlatforms(platformsRes.data);
      } catch (err) {
        setError("Could not load user data. Please try refreshing the page.");
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  if (loading) {
    return <div className="text-center text-xl">Loading Dashboard...</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        {/* FIX: Reduced title size on mobile for a more compact look */}
        <h1 className="text-3xl md:text-5xl font-bold">Dashboard</h1>
        {profile && (
          <div className="flex items-center gap-4">
            {/* FIX: Reduced welcome message size on mobile */}
            <p className="text-base md:text-xl text-gray-400">
              Welcome,{" "}
              <span className="font-bold text-sky-400">
                {profile.firstName}
              </span>
            </p>
            {profile.image && (
              <img
                src={profile.image}
                alt="profile"
                className="w-12 h-12 rounded-full border-2 border-sky-400 object-cover"
              />
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <PerformanceWidgets user={user} platforms={platforms} />
        </div>
        <div className="xl:col-span-1 space-y-8">
          <TodaysContests />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
