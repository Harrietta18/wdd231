// =============================================================
// FinSmart — main.js
// Home page: nav toggle, tip fetching, filtering, tip-dialog, localStorage
// ES Module
// =============================================================

import { initNav } from "./nav.js";
import { populateFooterTimestamps } from "./lastmod.js";

// ---- DOM references ----
const tipsGrid = document.querySelector("#tips-grid");
const emptyMessage = document.querySelector("#empty-message");
const filterButtons = document.querySelectorAll(".filter-btn");
const tipTitleEl = document.querySelector("#tip-title");
const tipSummaryEl = document.querySelector("#tip-summary");
const tipReadMoreBtn = document.querySelector("#tip-read-more");

const favCountEl = document.querySelector("#fav-count");
const favPluralEl = document.querySelector("#fav-plural");
const showFavsBtn = document.querySelector("#show-favs");
const showAllBtn = document.querySelector("#show-all");

const tipDialog = document.querySelector("#tip-modal");
const modalTitle = document.querySelector("#modal-title");
const modalBody = document.querySelector("#modal-body");
const modalCategory = document.querySelector("#modal-category");
const modalFavBtn = document.querySelector("#modal-fav");

// ---- App state ----
const STORAGE_KEY = "finsmart.favorites.v1";
let allTips = [];
let currentFilter = "all";
let showingFavorites = false;
let currentModalTip = null;

// ---- Helpers ----
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFavorites(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx === -1) favs.push(id);
  else favs.splice(idx, 1);
  saveFavorites(favs);
  updateFavCount();
  renderTips();
  syncModalFavButton();
}

function updateFavCount() {
  const count = getFavorites().length;
  favCountEl.textContent = count;
  favPluralEl.textContent = count === 1 ? "" : "s";
}

function pickTipOfTheDay(tips) {
  // Deterministic-ish "Tip of the Day" based on day-of-year
  if (!tips.length) return null;
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return tips[day % tips.length];
}

// ---- Render tip card ----
function tipCardHTML(tip) {
  const fav = isFavorite(tip.id);
  return `
    <article class="tip-card" data-id="${tip.id}" data-category="${tip.category}">
      <span class="category">${tip.category}</span>
      <h3>${tip.title}</h3>
      <p>${tip.summary}</p>
      <div class="card-actions">
        <button class="fs-action fs-action-link" data-action="read" type="button">Read more</button>
        <button class="fs-action fs-action-link" data-action="fav" type="button"
                aria-pressed="${fav}">
          ${fav ? "Saved" : "Save"}
        </button>
      </div>
    </article>
  `;
}

function renderTips() {
  let tipsToShow = allTips;

  if (showingFavorites) {
    const favIds = getFavorites();
    tipsToShow = allTips.filter(t => favIds.includes(t.id));
  } else if (currentFilter !== "all") {
    tipsToShow = allTips.filter(t => t.category === currentFilter);
  }

  // array method: .map()
  tipsGrid.innerHTML = tipsToShow.map(tipCardHTML).join("");

  emptyMessage.classList.toggle("hidden", tipsToShow.length > 0);
  showAllBtn.classList.toggle("hidden", !showingFavorites);
  showFavsBtn.classList.toggle("hidden", showingFavorites);
}

// ---- tip-dialog ----
function openModal(tip) {
  currentModalTip = tip;
  modalTitle.textContent = tip.title;
  modalBody.textContent = tip.body;
  modalCategory.textContent = tip.category;
  tipDialog.hidden = false;
  document.body.classList.add("tip-dialog-open");
  syncModalFavButton();
  tipDialog.querySelector(".tip-dialog-close").focus();
}

function closeModal() {
  tipDialog.hidden = true;
  document.body.classList.remove("tip-dialog-open");
  currentModalTip = null;
}

function syncModalFavButton() {
  if (!currentModalTip) return;
  const fav = isFavorite(currentModalTip.id);
  modalFavBtn.textContent = fav ? "Remove from favorites" : "Save to favorites";
}

function trapFocus(e) {
  if (tipDialog.hidden) return;
  const focusable = tipDialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.key === "Tab") {
    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  }
}

// ---- Filter handlers ----
function setFilter(category) {
  currentFilter = category;
  showingFavorites = false;
  filterButtons.forEach(filterButton => {
    filterButton.classList.toggle("active", filterButton.dataset.filter === category);
  });
  renderTips();
}

// ---- Tips grid delegation ----
tipsGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".tip-card");
  if (!card) return;
  const id = Number(card.dataset.id);
  const tip = allTips.find(t => t.id === id);
  if (!tip) return;

  if (e.target.dataset.action === "fav") {
    toggleFavorite(id);
  } else {
    openModal(tip);
  }
});

// ---- Filter buttons ----
filterButtons.forEach(filterButton => {
  filterButton.addEventListener("click", () => setFilter(filterButton.dataset.filter));
});

// ---- Tip of the day + read more ----
tipReadMoreBtn.addEventListener("click", () => {
  const tip = pickTipOfTheDay(allTips);
  if (tip) openModal(tip);
});

// ---- Favorites toggle ----
showFavsBtn.addEventListener("click", () => {
  showingFavorites = true;
  filterButtons.forEach(b => b.classList.remove("active"));
  renderTips();
});
showAllBtn.addEventListener("click", () => {
  showingFavorites = false;
  setFilter("all");
});

// ---- tip-dialog close handlers ----
tipDialog.addEventListener("click", (e) => {
  if (e.target.matches("[data-close-modal]")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !tipDialog.hidden) closeModal();
  trapFocus(e);
});
modalFavBtn.addEventListener("click", () => {
  if (currentModalTip) toggleFavorite(currentModalTip.id);
});

// ---- Init ----
async function init() {
  initNav();
  populateFooterTimestamps();
  updateFavCount();

  try {
    const response = await fetch("data/tips.json?v=5");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    allTips = Array.isArray(data.tips) ? data.tips : [];

    // Set tip of the day
    const today = pickTipOfTheDay(allTips);
    if (today) {
      tipTitleEl.textContent = today.title;
      tipSummaryEl.textContent = today.summary;
    }

    renderTips();
  } catch (err) {
    console.error("Failed to load tips:", err);
    tipsGrid.innerHTML = `<p class="empty-message">Sorry, we couldn't load tips right now. Please try again later.</p>`;
  }
}

init();
