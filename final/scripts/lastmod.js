// =============================================================
// FinSmart — lastmod.js
// Populates #currentYearDisplay and #lastModifiedStamp
// Uses document.lastModified (set automatically by the static host)
// ES Module
// =============================================================

export function populateFooterTimestamps() {
  const yearEl = document.getElementById("currentYearDisplay");
  const stampEl = document.getElementById("lastModifiedStamp");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (stampEl) {
    let raw = document.lastModified || "";
    // document.lastModified returns "MM/DD/YYYY HH:MM:SS" in en-US locale
    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) {
      const opts = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
      raw = parsed.toLocaleDateString("en-US", opts);
    }
    stampEl.textContent = `Last Updated: ${raw}`;
  }
}
