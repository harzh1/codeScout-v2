import React from "react";

const ReloginModal = ({ isOpen, onLoginRedirect }) => {
  // The modal doesn't render if it's not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
      <div className="card-bg rounded-lg p-8 m-4 max-w-sm w-full shadow-lg text-center">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4">
          Session Expired
        </h3>
        <p className="text-gray-300 mb-6">
          Your session has timed out. Please log in again to continue.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onLoginRedirect}
            className="py-2 px-6 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReloginModal;
