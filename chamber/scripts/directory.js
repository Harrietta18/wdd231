// --- 1. Dynamic Footer Info Requirements ---
document.getElementById("currentYearDisplay").textContent = new Date().getFullYear();
document.getElementById("lastModifiedStamp").textContent = `Last Modification: ${document.lastModified}`;

// --- 2. Mobile Responsive Hamburger Menu Logic ---
const toggleMenuBtn = document.getElementById("toggleMenuBtn");
const navigationMenu = document.querySelector(".navigation-menu");

toggleMenuBtn.addEventListener("click", () => {
    navigationMenu.classList.toggle("open");
    
    // Switch button symbol between hamburger (☰) and close (✕) for better UX
    if (navigationMenu.classList.contains("open")) {
        toggleMenuBtn.textContent = "✕";
        toggleMenuBtn.setAttribute("aria-label", "Close Navigation Menu");
    } else {
        toggleMenuBtn.textContent = "☰";
        toggleMenuBtn.setAttribute("aria-label", "Open Navigation Menu");
    }
});

// --- 3. Data Fetch & Rendering Setup ---
const dataUrl = "data/members.json";
const directoryViewer = document.getElementById("directoryDisplayBox");

async function fetchMembers() {
    try {
        const response = await fetch(dataUrl);
        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        renderDirectory(data);
    } catch (error) {
        console.error("Failed to load directory data:", error);
        directoryViewer.innerHTML = `<p class="error-msg">Unable to load business records at this time.</p>`;
    }
}

function renderDirectory(members) {
    directoryViewer.innerHTML = ""; // Clear existing placeholder html

    members.forEach(member => {
        // Translate membership numbers into readable labels
        let tierLabel = "Standard Member";
        if (member.membershipLevel === 2) tierLabel = "Silver Partner";
        if (member.membershipLevel === 3) tierLabel = "Gold Partner";

        // Create standard card markup
        const card = document.createElement("section");
        card.className = `business-card tier-${member.membershipLevel}`;

        card.innerHTML = `
            <img src="${member.image}" alt="${member.name} branding" loading="lazy">
            <div class="card-info">
                <h3>${member.name}</h3>
                <p class="industry-badge">${member.industry}</p>
                <p class="address">📍 ${member.address}</p>
                <p class="phone">📞 ${member.phone}</p>
                <p class="membership-badge">Level: ${tierLabel}</p>
                <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
            </div>
        `;
        directoryViewer.appendChild(card);
    });
}

// --- 4. View Switcher Toggle System (Grid vs. List) ---
const gridViewBtn = document.getElementById("switchToGrid");
const listViewBtn = document.getElementById("switchToList");

gridViewBtn.addEventListener("click", () => {
    directoryViewer.classList.add("grid-layout-active");
    directoryViewer.classList.remove("list-layout-active");
    
    // Accessibility & UI updates
    gridViewBtn.classList.add("active-state");
    listViewBtn.classList.remove("active-state");
});

listViewBtn.addEventListener("click", () => {
    directoryViewer.classList.add("list-layout-active");
    directoryViewer.classList.remove("grid-layout-active");
    
    // Accessibility & UI updates
    listViewBtn.classList.add("active-state");
    gridViewBtn.classList.remove("active-state");
});

// Initialize directory load
fetchMembers();