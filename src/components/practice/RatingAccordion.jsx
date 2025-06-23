import React, { useState } from "react";

const RatingAccordion = ({ ladder, solvedProblems, onToggleProblem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const solvedCount = ladder.problems.filter((p) =>
    solvedProblems.has(p.id)
  ).length;
  const totalCount = ladder.problems.length;
  const progress = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;

  return (
    <div className="card-bg rounded-lg mb-4 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center bg-gray-800/40 hover:bg-gray-700/60 transition-colors"
      >
        <div className="text-left">
          <h3 className="text-xl font-bold">Rating {ladder.rating}</h3>
          <p className="text-sm text-gray-400">
            {solvedCount} / {totalCount} solved
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-24 md:w-32 bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-sky-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <svg
            className={`w-6 h-6 transform transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="bg-gray-900/30 animate-fade-in p-1 md:p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-3 w-12"></th>
                  <th className="p-3">Problem</th>
                  <th className="p-3">Platform</th>
                  <th className="p-3">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {ladder.problems.map((problem) => (
                  <tr
                    key={problem.id}
                    className={`border-b border-gray-800 transition-colors ${
                      solvedProblems.has(problem.id)
                        ? "bg-green-500/10 hover:bg-green-500/20"
                        : "hover:bg-gray-700/50"
                    }`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={solvedProblems.has(problem.id)}
                        onChange={() => onToggleProblem(problem.id)}
                        className="form-checkbox h-5 w-5 rounded bg-gray-800 border-gray-600 text-sky-500 focus:ring-sky-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3">
                      <a
                        href={problem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`hover:text-sky-400 hover:underline ${
                          solvedProblems.has(problem.id)
                            ? "line-through text-gray-500"
                            : ""
                        }`}
                      >
                        {problem.name}
                      </a>
                    </td>
                    <td className="p-3 text-gray-400">{problem.oj}</td>
                    <td className="p-3 text-gray-400 font-mono">
                      {problem.difficulty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingAccordion;
