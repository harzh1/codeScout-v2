import React, { useState, useEffect } from "react";
import { isToday } from "date-fns";
import {
  CONTEST_API_URL,
  CONTEST_USERNAME,
  CONTEST_API_KEY,
} from "../../utils/api";
import { formatInIST, formatDuration } from "../../utils/helpers";

// A smaller card variant for the dashboard
const ContestListCard = ({ contest }) => {
  const platformNames = {
    "leetcode.com": "LEETCODE",
    "codeforces.com": "CODEFORCES",
    "codechef.com": "CODECHEF",
    "atcoder.jp": "ATCODER",
  };
  const platformName = platformNames[contest.resource] || "UNKNOWN";
  const duration = formatDuration(contest.start, contest.end);

  return (
    <a
      href={contest.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/70 transition-colors"
    >
      <div className="flex justify-between items-center">
        <div className="overflow-hidden pr-2">
          <span className="font-semibold text-sky-400 text-sm">
            {platformName}
          </span>
          {/* Responsive Contest Title */}
          <h4 className="font-bold text-base truncate">{contest.event}</h4>
          {duration && <p className="text-xs text-gray-400 mt-1">{duration}</p>}
        </div>
        <div className="text-right flex-shrink-0">
          {/* Responsive Start Time */}
          <p className="font-mono text-base">
            {formatInIST(contest.start, true)}
          </p>
          <p className="text-xs text-gray-400">Starts</p>
        </div>
      </div>
    </a>
  );
};

const TodaysContests = () => {
  const [todaysContests, setTodaysContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cacheKey = "codeScout_todays_contests";

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

      try {
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
          const { timestamp, data } = JSON.parse(cachedItem);
          if (isCacheValid(timestamp)) {
            setTodaysContests(data);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to read from cache", e);
      }

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

        const today = allContests
          .filter((contest) => isToday(new Date(contest.start)))
          .sort((a, b) => new Date(a.start) - new Date(b.start));

        setTodaysContests(today);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            timestamp: new Date().getTime(),
            data: today,
          })
        );
      } catch (err) {
        setError("Failed to fetch contests.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadContests();
  }, []);

  return (
    <div className="card-bg p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Today's Contests</h2>
      {loading ? (
        <p>Loading contests...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : todaysContests.length > 0 ? (
        <div className="space-y-3">
          {todaysContests.map((c) => (
            <ContestListCard key={c.id} contest={c} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No contests scheduled for today.</p>
      )}
    </div>
  );
};

export default TodaysContests;
