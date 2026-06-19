// =============================================================
// FinSmart — nav.js
// Shared hamburger / nav toggle logic for all pages
// ES Module
// =============================================================

export function initNav() {
  const hamburger = document.querySelector("#hamburger");
  const nav = document.querySelector("#primary-nav");
  if (!hamburger || !nav) return;

  hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open", !expanded);
  });

  // Close menu on link click (mobile)
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      hamburger.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    });
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      hamburger.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
      hamburger.focus();
    }
  });
}
