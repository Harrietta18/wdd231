// =============================================================
// FinSmart — tools.js
// Tools page: budget + savings calculators with localStorage
// ES Module
// =============================================================

import { initNav } from "./nav.js";
import { populateFooterTimestamps } from "./lastmod.js";

// ---- DOM ----
const budgetForm = document.querySelector("#budget-form");
const budgetResults = document.querySelector("#budget-results");
const savingsForm = document.querySelector("#savings-form");
const savingsResults = document.querySelector("#savings-results");
const budgetResetBtn = document.querySelector("#budget-reset");
const savingsResetBtn = document.querySelector("#savings-reset");

const BUDGET_KEY = "finsmart.budget.v1";
const SAVINGS_KEY = "finsmart.savings.v1";

// ---- Helpers ----
const numberFmt = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 });

function fmt(amount) {
  return `Naira ${numberFmt.format(amount)}`;
}

function readNumber(input) {
  const v = parseFloat(input.value);
  return Number.isFinite(v) && v >= 0 ? v : 0;
}

function loadForm(form, key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (!saved) return;
    Object.entries(saved).forEach(([name, value]) => {
      const field = form.elements.namedItem(name);
      if (field && value != null) field.value = value;
    });
  } catch (err) {
    console.warn("Could not load saved form data:", err);
  }
}

function saveForm(form, key) {
  const data = {};
  Array.from(form.elements).forEach(el => {
    if (el.name) data[el.name] = el.value;
  });
  localStorage.setItem(key, JSON.stringify(data));
}

// ---- Budget Estimator ----
budgetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveForm(budgetForm, BUDGET_KEY);

  const income = readNumber(budgetForm.income) + readNumber(budgetForm.scholarship);
  const fixed =
    readNumber(budgetForm.rent) +
    readNumber(budgetForm.tuition) +
    readNumber(budgetForm.utilities) +
    readNumber(budgetForm.transit) +
    readNumber(budgetForm.groceries) +
    readNumber(budgetForm.other);

  const remaining = income - fixed;
  const savingsTarget = income * 0.2;
  const savingsShortfall = Math.max(0, savingsTarget - remaining);
  const status = remaining >= savingsTarget
    ? { label: "You're on track with the 50/30/20 rule.", tone: "ok" }
    : { label: `You need ${fmt(savingsShortfall)} more to hit the 20% savings target.`, tone: "warn" };

  const pctRemaining = income > 0 ? Math.max(0, Math.min(100, (remaining / income) * 100)) : 0;
  const pctFixed = income > 0 ? Math.max(0, Math.min(100, (fixed / income) * 100)) : 0;

  budgetResults.innerHTML = `
    <h3>Your Monthly Budget Snapshot</h3>
    <div class="result-row"><span>Total income</span><strong>${fmt(income)}</strong></div>
    <div class="result-row"><span>Total fixed expenses</span><strong>${fmt(fixed)}</strong></div>
    <div class="result-row ${status.tone === "warn" ? "warning" : ""}">
      <span>Money left over</span><strong>${fmt(remaining)}</strong>
    </div>
    <div class="result-row"><span>Savings target (20%)</span><strong>${fmt(savingsTarget)}</strong></div>

    <p class="result-note"><strong>${status.label}</strong></p>

    <p>Fixed expenses as % of income</p>
    <progress class="result-meter" value="${pctFixed}" max="100">${pctFixed.toFixed(1)}%</progress>
    <p class="result-note-tight">Remaining as % of income</p>
    <progress class="result-meter" value="${pctRemaining}" max="100">${pctRemaining.toFixed(1)}%</progress>
  `;
  budgetResults.classList.add("visible");
});

budgetResetBtn.addEventListener("click", () => {
  localStorage.removeItem(BUDGET_KEY);
  budgetResults.classList.remove("visible");
  budgetResults.innerHTML = "";
});

// ---- Savings Goal ----
savingsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveForm(savingsForm, SAVINGS_KEY);

  const target = readNumber(savingsForm.target);
  const current = Math.min(readNumber(savingsForm.current), target);
  const monthly = readNumber(savingsForm.monthly);

  if (monthly <= 0) {
    savingsResults.innerHTML = `<p class="warning">Please enter a positive monthly savings amount.</p>`;
    savingsResults.classList.add("visible");
    return;
  }

  const remaining = Math.max(0, target - current);
  const months = Math.ceil(remaining / monthly);
  const years = (months / 12).toFixed(1);
  const pctDone = target > 0 ? Math.min(100, (current / target) * 100) : 0;

  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + months);
  const dateStr = targetDate.toLocaleDateString("en-NG", { month: "long", year: "numeric" });

  savingsResults.innerHTML = `
    <h3>Your Emergency Savings Plan</h3>
    <div class="result-row"><span>Target amount</span><strong>${fmt(target)}</strong></div>
    <div class="result-row"><span>Already saved</span><strong>${fmt(current)}</strong></div>
    <div class="result-row"><span>Remaining</span><strong>${fmt(remaining)}</strong></div>
    <div class="result-row"><span>Months to reach goal</span><strong>${months} month${months === 1 ? "" : "s"} (~${years} yr)</strong></div>
    <div class="result-row"><span>Estimated completion</span><strong>${dateStr}</strong></div>

    <p class="result-note">Progress toward your goal</p>
    <progress class="result-meter" value="${pctDone}" max="100">${pctDone.toFixed(1)}%</progress>
    <p class="result-percent">${pctDone.toFixed(1)}% complete</p>
  `;
  savingsResults.classList.add("visible");
});

savingsResetBtn.addEventListener("click", () => {
  localStorage.removeItem(SAVINGS_KEY);
  savingsResults.classList.remove("visible");
  savingsResults.innerHTML = "";
});

// ---- Live save (blur) for persistence ----
[budgetForm, savingsForm].forEach(form => {
  form.addEventListener("input", () => {
    const key = form === budgetForm ? BUDGET_KEY : SAVINGS_KEY;
    saveForm(form, key);
  });
});

// ---- Init ----
function init() {
  initNav();
  populateFooterTimestamps();
  loadForm(budgetForm, BUDGET_KEY);
  loadForm(savingsForm, SAVINGS_KEY);
}

init();
