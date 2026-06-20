// =============================================================
// FinSmart — resources.js
// Resource Hub page: fetch guides + external links, filter
// ES Module
// =============================================================

import { initNav } from "./nav.js";
import { populateFooterTimestamps } from "./lastmod.js";

const guidesGrid = document.querySelector("#guides-grid");
const guidesEmpty = document.querySelector("#guides-empty");
const externalList = document.querySelector("#external-list");
const filterButtons = document.querySelectorAll(".filter-btn");

const STORAGE_KEY = "finsmart.guidesFilter.v1";
let allGuides = [];
let currentFilter = "all";

function guideCardHTML(g) {
  return `
    <article class="guide-card" data-topic="${g.topic}">
      <span class="topic">${g.topic}</span>
      <h3>${g.title}</h3>
      <p>${g.description}</p>
      <div class="card-actions">
        <a class="fs-action fs-action-link" href="${g.link}">Read guide</a>
        <a class="fs-action fs-action-link" href="${g.download}" download>Download template</a>
      </div>
    </article>
  `;
}

function externalCardHTML(e) {
  return `
    <article class="external-card">
      <a href="${e.url}" target="_blank" rel="noopener noreferrer">${e.name}</a>
      <p>${e.description}</p>
    </article>
  `;
}

function renderGuides() {
  const list = currentFilter === "all"
    ? allGuides
    : allGuides.filter(g => g.topic === currentFilter);

  guidesGrid.innerHTML = list.map(guideCardHTML).join("");
  guidesEmpty.classList.toggle("hidden", list.length > 0);
}

function setFilter(topic) {
  currentFilter = topic;
  localStorage.setItem(STORAGE_KEY, topic);
  filterButtons.forEach(b => b.classList.toggle("active", b.dataset.filter === topic));
  renderGuides();
}

filterButtons.forEach(filterButton => {
  filterButton.addEventListener("click", () => setFilter(filterButton.dataset.filter));
});

async function init() {
  initNav();
  populateFooterTimestamps();

  // Restore last filter
  const savedFilter = localStorage.getItem(STORAGE_KEY);
  if (savedFilter) currentFilter = savedFilter;
  filterButtons.forEach(b => b.classList.toggle("active", b.dataset.filter === currentFilter));

  try {
    const response = await fetch("data/resources.json?v=5");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    allGuides = Array.isArray(data.guides) ? data.guides : [];
    const externals = Array.isArray(data.external) ? data.external : [];

    renderGuides();

    // array method: .map()
    externalList.innerHTML = externals.map(externalCardHTML).join("");
  } catch (err) {
    console.error("Failed to load resources:", err);
    guidesGrid.innerHTML = `<p class="empty-message">Sorry, we couldn't load resources right now.</p>`;
  }
}

init();
