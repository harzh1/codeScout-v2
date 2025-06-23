import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ratingLadders } from "../../data/problemLadders";
import RatingAccordion from "../practice/RatingAccordion";

const PracticePage = () => {
  const { user } = useContext(AuthContext);
  const [solvedProblems, setSolvedProblems] = useState(new Set());

  // Load solved problems from localStorage when the component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      try {
        const stored = localStorage.getItem(
          `codeScout_solved_problems_${user.id}`
        );
        if (stored) {
          setSolvedProblems(new Set(JSON.parse(stored)));
        }
      } catch (e) {
        console.error("Failed to parse solved problems from localStorage", e);
        setSolvedProblems(new Set());
      }
    }
  }, [user]);

  // Handle toggling a problem's solved status and update localStorage
  const handleToggleProblem = (problemId) => {
    const newSolvedProblems = new Set(solvedProblems);
    if (newSolvedProblems.has(problemId)) {
      newSolvedProblems.delete(problemId);
    } else {
      newSolvedProblems.add(problemId);
    }
    setSolvedProblems(newSolvedProblems);
    if (user?.id) {
      localStorage.setItem(
        `codeScout_solved_problems_${user.id}`,
        JSON.stringify(Array.from(newSolvedProblems))
      );
    }
  };

  return (
    <div>
      <h1 className="text-5xl font-bold mb-6 text-center">CP Practice Sheet</h1>
      <p className="text-center text-gray-400 mb-10 max-w-3xl mx-auto font-light">
        A curated list of problems to practice for competitive programming,
        inspired by the famous A2OJ ladders and TLE-Eliminators sheet. Track
        your progress here.
      </p>
      <div>
        {ratingLadders.map((ladder) => (
          <RatingAccordion
            key={ladder.rating}
            ladder={ladder}
            solvedProblems={solvedProblems}
            onToggleProblem={handleToggleProblem}
          />
        ))}
      </div>
    </div>
  );
};

export default PracticePage;
