import React from "react";

const RatingCard = ({
  platformName,
  username,
  rating,
  ratingChange,
  rank,
  color,
}) => (
  <div
    className="card-bg p-6 rounded-lg text-center"
    style={{ borderColor: color }}
  >
    {/* Responsive Platform Name */}
    <h3 className="text-xl md:text-2xl font-bold text-sky-400 mb-2">
      {platformName}
    </h3>
    <p className="font-mono text-gray-300 mb-4">{username || "N/A"}</p>

    {/* Responsive Rating Text */}
    <p
      className="text-4xl md:text-5xl font-bold font-firacode tracking-tighter"
      style={{ color: color || "#fff" }}
    >
      {rating || "N/A"}
    </p>

    {ratingChange !== null && typeof ratingChange !== "undefined" && (
      <p
        className={`font-mono ${
          ratingChange > 0 ? "text-green-400" : "text-red-400"
        }`}
      >
        {ratingChange > 0 ? `+${ratingChange}` : ratingChange}
      </p>
    )}
    {rank && <p className="text-gray-400 mt-2 text-sm">{rank}</p>}
  </div>
);

export default RatingCard;
