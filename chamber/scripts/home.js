/* ==========================================================================
   LAGOS CHAMBER DATA CONNECTIONS INTEGRATION (home.js)
   ========================================================================== */

// Change units=metric to units=imperial for Fahrenheit data strings
const currentUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=6.5244&lon=3.3792&units=imperial&appid=477685cc7ec5fb57eb7be2576b5ef49a';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=6.5244&lon=3.3792&units=imperial&appid=477685cc7ec5fb57eb7be2576b5ef49a';
const membersDataSource = 'data/members.json';

// METEOROLOGICAL RUNTIME LOGIC TRACKERS
async function fetchWeatherData() {
    try {
        const currentResponse = await fetch(currentUrl);
        if (!currentResponse.ok) throw new Error(`Weather system returned code: ${currentResponse.status}`);
        const currentData = await currentResponse.json();

        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) throw new Error(`Forecast system returned code: ${forecastResponse.status}`);
        const forecastData = await forecastResponse.json();

        renderCurrentWeather(currentData);
        renderThreeDayForecast(forecastData);

    } catch (error) {
        console.error("METEOROLOGICAL STREAM DATA DISRUPTION:", error);
        const descBlock = document.getElementById('weather-description');
        if (descBlock) descBlock.textContent = "Data feed currently offline.";
    }
}

function renderCurrentWeather(data) {
    const tempElement = document.getElementById('current-temp');
    const descElement = document.getElementById('weather-description');
    const iconElement = document.getElementById('weather-icon');
    const highElement = document.getElementById('temp-high');
    const lowElement = document.getElementById('temp-low');
    const humidityElement = document.getElementById('humidity');

    if (tempElement) tempElement.innerHTML = `${Math.round(data.main.temp)}`;
    if (highElement) highElement.innerHTML = `${Math.round(data.main.temp_max)}`;
    if (lowElement) lowElement.innerHTML = `${Math.round(data.main.temp_min)}`;
    if (humidityElement) humidityElement.innerHTML = `${data.main.humidity}`;

    if (descElement) {
        const titleCaseDesc = data.weather[0].description.replace(/\b\w/g, c => c.toUpperCase());
        descElement.textContent = titleCaseDesc;
        if (iconElement) {
            iconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            iconElement.alt = titleCaseDesc;
        }
    }
}

function renderThreeDayForecast(data) {
    const container = document.getElementById('forecast-container');
    if (!container) return;
    container.innerHTML = ''; // Clear loading message

    // Robust fall-back filter: if 12:00:00 isn't captured, grab items spaced out every 8 intervals (24 hours)
    let distinctDaysList = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    if (distinctDaysList.length === 0) {
        distinctDaysList = [data.list[8], data.list[16], data.list[24]];
    }

    distinctDaysList.slice(0, 3).forEach(dayInfo => {
        if (!dayInfo) return; // Guard clause against missing steps

        const timeCalculated = new Date(dayInfo.dt * 1000);
        const dayLabel = timeCalculated.toLocaleDateString('en-US', { weekday: 'long' });
        const dayTemp = Math.round(dayInfo.main.temp);
        const dayConditions = dayInfo.weather[0].description.replace(/\b\w/g, c => c.toUpperCase());

        const dayRow = document.createElement('p');
        dayRow.className = "forecast-day";
        dayRow.style.margin = "0.75rem 0";
        dayRow.innerHTML = `<strong>${dayLabel}:</strong> <span>${dayTemp}</span>°C <br><small style="color:#6B7280; font-style:italic;">${dayConditions}</small>`;
        container.appendChild(dayRow);
    });
}

// RANDOMIZED PREMIUM BUSINESS ADVERTISING ENGINE
async function loadPremiumSpotlights() {
    try {
        const response = await fetch(membersDataSource);
        if (!response.ok) throw new Error(`JSON Stream access failure: ${response.status}`);
        const membersList = await response.json();

        // Filters list cleanly checking for integers: 3 (Gold) or 2 (Silver)
        const premiumQualifiedGroup = membersList.filter(item => item.membershipLevel === 3 || item.membershipLevel === 2);

        // Run randomization shuffle pass
        const randomizedOutputSelection = shuffleArray(premiumQualifiedGroup).slice(0, 3);

        renderSpotlightCards(randomizedOutputSelection);

    } catch (error) {
        console.error("SPOTLIGHT POPULATION CORRUPTION:", error);
        const holder = document.getElementById('spotlight-container');
        if (holder) holder.innerHTML = `<p>Premium directory cards load failure.</p>`;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function renderSpotlightCards(premiumGroup) {
    const wrapper = document.getElementById('spotlight-container');
    if (!wrapper) return;
    wrapper.innerHTML = '';

    premiumGroup.forEach(company => {
        const levelBadge = company.membershipLevel === 3 ? "gold-tier" : "silver-tier";
        const levelText = company.membershipLevel === 3 ? "Gold Member" : "Silver Member";
        const cardElement = document.createElement('article');
        cardElement.className = `spotlight-card ${levelBadge}`;

        cardElement.innerHTML = `
            <h4>${company.name}</h4>
            <p class="spotlight-industry" style="color: #A16207; font-weight:700; font-size:0.8rem;">${levelText} | ${company.industry}</p>
            <p class="spotlight-motto">"${company.address}"</p>
            <p class="spotlight-contact-detail" style="font-size:0.85rem; margin:0.25rem 0;">📞 ${company.phone}</p>
            <a href="${company.website}" target="_blank" rel="noopener noreferrer" style="display:inline-block; margin-top:0.5rem; font-weight:bold; color:#064E3B; text-decoration:none;">Visit Corporate Site →</a>
        `;
        wrapper.appendChild(cardElement);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchWeatherData();
    loadPremiumSpotlights();
});