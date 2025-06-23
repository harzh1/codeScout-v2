import React from "react";

const HomePage = ({ setCurrentPage }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center p-4">
      <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
        codeScout
      </h1>
      <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto font-light">
        Your terminal for competitive programming. Track contests, analyze
        performance, and crush your rating goals.
      </p>
      <div>
        <button
          onClick={() => setCurrentPage("register")}
          className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-sky-500/30"
        >
          Get Started
        </button>
      </div>
    </div>
  </div>
);

export default HomePage;
