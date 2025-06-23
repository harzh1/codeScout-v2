import React from "react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="card-bg rounded-lg p-8 m-4 max-w-sm w-full shadow-lg text-center animate-fade-in">
        <h3 className="text-2xl font-bold text-red-500 mb-4">Are you sure?</h3>
        <p className="text-gray-300 mb-6">
          This action cannot be undone. All your data will be permanently
          deleted.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="py-2 px-6 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="py-2 px-6 bg-red-600 hover:bg-red-500 rounded-lg transition-colors flex items-center gap-2"
          >
            {loading && (
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
            )}
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
