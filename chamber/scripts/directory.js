// --- 1. Dynamic Footer Info Requirements ---
document.getElementById("currentYear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = `Last Modification: ${document.lastModified}`;

// --- 2. Data Fetch & Rendering Setup ---
const dataUrl = "data/members.json";
const directoryViewer = document.getElementById("directoryViewer");

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
        let tierLabel = "Regular Member";
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

// --- 3. View Switcher Toggle System (Grid vs. List) ---
const gridViewBtn = document.getElementById("gridViewBtn");
const listViewBtn = document.getElementById("listViewBtn");

gridViewBtn.addEventListener("click", () => {
    directoryViewer.classList.add("grid-layout");
    directoryViewer.classList.remove("list-layout");
    
    // Accessibility & UI updates
    gridViewBtn.classList.add("active-toggle");
    listViewBtn.classList.remove("active-toggle");
});

listViewBtn.addEventListener("click", () => {
    directoryViewer.classList.add("list-layout");
    directoryViewer.classList.remove("grid-layout");
    
    // Accessibility & UI updates
    listViewBtn.classList.add("active-toggle");
    gridViewBtn.classList.remove("active-toggle");
});

// Initialize directory load
fetchMembers();