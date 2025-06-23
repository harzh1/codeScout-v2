import React, { useState, useEffect } from "react";
import { isToday, isTomorrow, isAfter, addDays } from "date-fns";
import {
  CONTEST_API_URL,
  CONTEST_USERNAME,
  CONTEST_API_KEY,
} from "../../utils/api";
import ContestCard from "../contests/ContestCard";

const ContestsPage = () => {
  const [contests, setContests] = useState({
    today: [],
    tomorrow: [],
    later: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("today");

  useEffect(() => {
    const cacheKey = "codeScout_contests";

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

    const loadContests = async () => {
      setLoading(true);
      setError("");

      // Try to load from cache first
      try {
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
          const { timestamp, data } = JSON.parse(cachedItem);
          if (isCacheValid(timestamp)) {
            setContests(data);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to read from cache", e);
      }

      // Fetch from API if cache is invalid or missing
      try {
        const platforms = [
          "leetcode.com",
          "codeforces.com",
          "codechef.com",
          "atcoder.jp",
        ];
        const requests = platforms.map((p) =>
          fetch(
            `${CONTEST_API_URL}?username=${CONTEST_USERNAME}&api_key=${CONTEST_API_KEY}&resource=${p}&upcoming=true&format=json`
          )
        );
        const responses = await Promise.all(requests);

        let allContests = [];
        for (const res of responses) {
          if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
          const data = await res.json();
          allContests = [...allContests, ...(data.objects || [])];
        }

        const today = [],
          tomorrow = [],
          later = [];
        allContests.forEach((contest) => {
          const startTime = new Date(contest.start);
          if (isToday(startTime)) today.push(contest);
          else if (isTomorrow(startTime)) tomorrow.push(contest);
          else if (isAfter(startTime, addDays(new Date(), 1)))
            later.push(contest);
        });

        const sortByStartTime = (a, b) => new Date(a.start) - new Date(b.start);
        const newContestsData = {
          today: today.sort(sortByStartTime),
          tomorrow: tomorrow.sort(sortByStartTime),
          later: later.sort(sortByStartTime),
        };

        setContests(newContestsData);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            timestamp: new Date().getTime(),
            data: newContestsData,
          })
        );
      } catch (err) {
        setError("Failed to fetch contests. The API might be down.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadContests();
  }, []);

  const renderContests = (contestList) => {
    if (contestList.length === 0) {
      return (
        <p className="text-gray-400 pl-4 mt-4">
          No contests scheduled for this period.
        </p>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
        {contestList.map((c) => (
          <ContestCard key={c.id} contest={c} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-5xl font-bold mb-10 text-center">Contest Schedule</h1>
      {loading ? (
        <div className="text-center text-xl">Loading contests...</div>
      ) : error ? (
        <div className="text-center text-xl text-red-500">{error}</div>
      ) : (
        <div>
          <div className="flex justify-center border-b border-white/10 mb-6">
            <button
              onClick={() => setActiveTab("today")}
              className={`px-4 py-2 text-lg transition-colors ${
                activeTab === "today"
                  ? "text-sky-400 border-b-2 border-sky-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveTab("tomorrow")}
              className={`px-4 py-2 text-lg transition-colors ${
                activeTab === "tomorrow"
                  ? "text-sky-400 border-b-2 border-sky-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Tomorrow
            </button>
            <button
              onClick={() => setActiveTab("later")}
              className={`px-4 py-2 text-lg transition-colors ${
                activeTab === "later"
                  ? "text-sky-400 border-b-2 border-sky-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Later
            </button>
          </div>
          <div>
            {activeTab === "today" && renderContests(contests.today)}
            {activeTab === "tomorrow" && renderContests(contests.tomorrow)}
            {activeTab === "later" && renderContests(contests.later)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestsPage;
