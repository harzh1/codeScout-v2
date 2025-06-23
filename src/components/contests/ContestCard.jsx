import React from "react";
import { formatInIST, formatDuration } from "../../utils/helpers";

const ContestCard = ({ contest }) => {
  const platformNames = {
    "leetcode.com": "LEETCODE",
    "codeforces.com": "CODEFORCES",
    "codechef.com": "CODECHEF",
    "atcoder.jp": "ATCODER",
  };
  const platformName = platformNames[contest.resource] || "UNKNOWN";
  const duration = formatDuration(contest.start, contest.end);

  return (
    <div className="card-bg p-5 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20 hover:border-blue-500/50 rounded-lg min-h-[17rem]">
      {/* Card Content */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-lg text-sky-400">
            {platformName}
          </span>
          {duration && (
            <span className="text-sm font-mono bg-gray-700/50 px-2 py-1 rounded">
              {duration}
            </span>
          )}
        </div>

        {/* The h3 tag is changed here: removed h-16, added break-words and more margin-bottom */}
        <h3 className="text-xl font-bold mb-4 break-words">{contest.event}</h3>

        <div className="text-sm text-gray-400 space-y-1">
          <p>
            <strong>Starts:</strong> {formatInIST(contest.start)}
          </p>
          <p>
            <strong>Ends:</strong> {formatInIST(contest.end)}
          </p>
        </div>
      </div>

      {/* Go to Contest Button */}
      <a
        href={contest.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg mt-4 transition-colors"
      >
        Go to Contest
      </a>
    </div>
  );
};

export default ContestCard;
