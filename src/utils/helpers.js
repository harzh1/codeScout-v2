// This file contains helper functions that can be reused across the application.

/**
 * Decodes a JWT token payload without using an external library.
 * @param {string} token - The JWT token.
 * @returns {object|null} The decoded payload object or null if decoding fails.
 */
export const simpleJwtDecode = (token) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) throw new Error("Invalid JWT token: Missing payload");

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return null;
  }
};

/**
 * Formats a UTC date string into a readable format for the IST timezone.
 * @param {string} dateString - The UTC date string from the API.
 * @param {boolean} [timeOnly=false] - If true, returns only the time part.
 * @returns {string} The formatted date string.
 */
export const formatInIST = (dateString, timeOnly = false) => {
  // Ensure the date string is parsed as UTC
  const utcDateString =
    dateString.endsWith("Z") || dateString.includes("+00:00")
      ? dateString
      : dateString.replace(" ", "T") + "Z";

  const date = new Date(utcDateString);

  if (isNaN(date)) {
    console.warn(`Invalid date string received: ${dateString}`);
    return "Invalid Date";
  }

  const timePartOptions = {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  if (timeOnly) {
    const timePart = new Intl.DateTimeFormat("en-US", timePartOptions).format(
      date
    );
    return `${timePart} IST`;
  }

  const datePartOptions = {
    ...timePartOptions,
    month: "short",
    day: "numeric",
    year: "2-digit",
  };
  // This format gives "MMM D, YY, H:MM AM/PM"
  const formattedDate = new Intl.DateTimeFormat(
    "en-US",
    datePartOptions
  ).format(date);
  // Replace the comma after the year with " at " for better readability
  return formattedDate.replace(/,([^,]*)$/, " at$1 IST");
};

/**
 * Calculates the duration between two date strings and formats it.
 * @param {string} startString - The start date string.
 * @param {string} endString - The end date string.
 * @returns {string} Formatted duration (e.g., "2d 4h", "3h", "30m").
 */
export const formatDuration = (startString, endString) => {
  const start = new Date(
    startString.endsWith("Z") ? startString : startString + "Z"
  );
  const end = new Date(endString.endsWith("Z") ? endString : endString + "Z");

  if (isNaN(start) || isNaN(end)) return "";
  let diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) return "";

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  diffMs -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  diffMs -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(diffMs / (1000 * 60));

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  // Only show minutes if the duration is less than a day
  if (minutes > 0 && days === 0) {
    parts.push(`${minutes}m`);
  }

  return parts.join(" ");
};
