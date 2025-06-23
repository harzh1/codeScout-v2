import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  CODEFORCES_API_URL,
  LEETCODE_API_URL,
  CODECHEF_API_URL,
} from "../../utils/api";
import RatingCard from "./RatingCard";

const PerformanceWidgets = ({ user, platforms }) => {
  const [platformData, setPlatformData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const cacheKey = user ? `codeScout_performance_${user.id}` : null;

  const getCodeforcesRank = (rating) => {
    if (rating >= 3000) return "Int. Grandmaster";
    if (rating >= 2400) return "Grandmaster";
    if (rating >= 2100) return "Master";
    if (rating >= 1900) return "Candidate Master";
    if (rating >= 1600) return "Expert";
    if (rating >= 1400) return "Specialist";
    if (rating >= 1200) return "Pupil";
    return "Newbie";
  };

  const getCodeforcesColor = (rank) => {
    const colors = {
      Newbie: "#9ca3af",
      Pupil: "#4ade80",
      Specialist: "#22d3ee",
      Expert: "#60a5fa",
      "Candidate Master": "#c084fc",
      Master: "#facc15",
      "Int. Grandmaster": "#f87171",
      Grandmaster: "#f87171",
    };
    return colors[rank] || "#fff";
  };

  const isCacheValid = (timestamp) => {
    if (!timestamp) return false;
    const cacheDate = new Date(timestamp);
    const today = new Date();
    return (
      cacheDate.getFullYear() === today.getFullYear() &&
      cacheDate.getMonth() === today.getMonth() &&
      cacheDate.getDate() === today.getDate()
    );
  };

  const processAndSetData = (data, timestamp) => {
    setPlatformData(data);
    setLastUpdated(timestamp ? new Date(timestamp) : null);
  };

  const fetchAllData = async () => {
    if (!platforms || platforms.length === 0) return;
    setLoading(true);
    setError("");
    const data = {};

    for (const platform of platforms) {
      try {
        if (platform.platformUrl === "codeforces.com" && platform.username) {
          const res = await fetch(
            `${CODEFORCES_API_URL}/user.rating?handle=${platform.username}`
          );
          const json = await res.json();
          if (json.status === "OK" && json.result.length > 0) {
            const contests = json.result;
            const n = contests.length;
            const last = contests[n - 1];
            const prev = n > 1 ? contests[n - 2] : null;
            const change = prev ? last.newRating - prev.newRating : 0;
            const rank = getCodeforcesRank(last.newRating);
            data.codeforces = {
              platformName: "Codeforces",
              username: platform.username,
              rating: last.newRating,
              ratingChange: change,
              rank,
              color: getCodeforcesColor(rank),
            };
          }
        } else if (
          platform.platformUrl === "leetcode.com" &&
          platform.username
        ) {
          const res = await fetch(
            `${LEETCODE_API_URL}/${platform.username}/contest`
          );
          const json = await res.json();
          if (json.contestParticipation) {
            const contests = json.contestParticipation;
            const n = contests.length;
            const ratingChange =
              n >= 2
                ? parseInt(contests[n - 1].rating) -
                  parseInt(contests[n - 2].rating)
                : 0;
            data.leetcode = {
              platformName: "LeetCode",
              username: platform.username,
              rating: parseInt(json.contestRating),
              ratingChange,
              rank: `Top ${json.contestGlobalRanking}%`,
              color: "#facc15",
            };
          }
        } else if (
          platform.platformUrl === "codechef.com" &&
          platform.username
        ) {
          const res = await fetch(`${CODECHEF_API_URL}/${platform.username}`);
          const json = await res.json();
          if (json.success && json.profile) {
            const rating = json.current_rating || 0;
            const ratingChange = 0; // The new API doesn't provide rating history
            data.codechef = {
              platformName: "CodeChef",
              username: platform.username,
              rating,
              ratingChange,
              rank: json.stars || "",
              color: "#d97706",
            };
          }
        }
      } catch (err) {
        console.error(`Error fetching ${platform.platformUrl} data:`, err);
        setError(
          `Failed to fetch data for ${platform.platformUrl}. The API may be down or the handle is incorrect.`
        );
      }
    }

    const newTimestamp = new Date().getTime();
    if (cacheKey) {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ timestamp: newTimestamp, data })
      );
    }
    processAndSetData(data, newTimestamp);
    setLoading(false);
  };

  useEffect(() => {
    if (!cacheKey || !platforms || platforms.length === 0) {
      processAndSetData({}, null);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
          const { timestamp, data } = JSON.parse(cachedItem);
          if (isCacheValid(timestamp)) {
            processAndSetData(data, timestamp);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to read performance cache", e);
      }

      await fetchAllData();
    };

    loadData();
  }, [platforms, cacheKey]);

  if (!platforms || platforms.length === 0) {
    return (
      <div className="card-bg p-8 rounded-lg">
        <h2 className="text-2xl font-bold">Performance Stats</h2>
        <p className="text-gray-400 mt-4">
          Add your platform handles in the 'Settings' page to see your stats.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold">Performance Stats</h2>
        <div className="flex items-center gap-4">
          {lastUpdated && !loading && (
            <span className="text-sm text-gray-500">
              Last updated: {format(lastUpdated, "p")}
            </span>
          )}
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-500 disabled:bg-gray-500 disabled:cursor-wait text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.899 2.186l-1.884.628A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm12 1a1 1 0 011 1v6a1 1 0 01-1 1h-5a1 1 0 010-2h2.001a5.002 5.002 0 00-8.09-3.418L6.102 8.186A7.002 7.002 0 0115 4.101V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <p className="bg-red-500/20 text-red-400 p-3 rounded mb-4">{error}</p>
      )}

      {loading && Object.keys(platformData).length === 0 ? (
        <div className="card-bg p-8 rounded-lg text-center">
          Loading performance data...
        </div>
      ) : Object.keys(platformData).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          {platformData.codeforces && (
            <RatingCard {...platformData.codeforces} />
          )}
          {platformData.leetcode && <RatingCard {...platformData.leetcode} />}
          {platformData.codechef && <RatingCard {...platformData.codechef} />}
        </div>
      ) : (
        !loading && (
          <div className="card-bg p-8 rounded-lg">
            <p className="text-gray-400 mt-4">
              Could not fetch any data for the provided handles. Please check
              them and try refreshing.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default PerformanceWidgets;
