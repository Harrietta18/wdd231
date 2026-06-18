import { attractions } from '../data/discover.mjs';

    // 1. Handle Visitor Message using localStorage
    const visitorMsgElement = document.getElementById("visitor-msg");
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();

    if (!lastVisit) {
        visitorMsgElement.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const timeDiff = now - parseInt(lastVisit);
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysDiff = Math.floor(timeDiff / msPerDay);

        if (timeDiff < msPerDay) {
            visitorMsgElement.textContent = "Back so soon! Awesome!";
        } else {
            const dayText = (daysDiff === 1) ? "day" : "days";
            visitorMsgElement.textContent = `You last visited ${daysDiff} ${dayText} ago.`;
        }
    }
    localStorage.setItem('lastVisit', now);

    // 2. Render Discovery Cards
    const container = document.getElementById("discover-grid-container");
    if (container) {
        container.innerHTML = ""; // Clear any placeholders
        attractions.forEach((item, index) => {
            const card = document.createElement("article");
            card.className = "discover-card";
            card.style.gridArea = `item${index + 1}`; // Dynamic Grid Area Assignment

            card.innerHTML = `
                <h2>${item.name}</h2>
                <figure><img src="${item.image || 'images/placeholder.webp'}" alt="${item.name}" loading="lazy" width="300" height="200"></figure>
                <address>${item.address}</address>
                <p><strong>Budget:</strong> ${item.priceRange}</p>
                <p>${item.description}</p>
                <button type="button">Learn More</button>
            `;
            container.appendChild(card);
        });
    }