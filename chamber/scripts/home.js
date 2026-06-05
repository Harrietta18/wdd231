/* ==========================================================================
   LAGOS CHAMBER DATA CONNECTIONS ENGINE (home.js)
   ========================================================================== */

// 1. OPENWEATHERMAP INTEGRATION VARIABLES
// Geolocation coordinates for Lagos, Nigeria: Lat 6.5244, Lon 3.3792
const currentUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=6.5244&lon=3.3792&units=metric&appid=YOUR_OWN_API_KEY_HERE';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=6.5244&lon=3.3792&units=metric&appid=YOUR_OWN_API_KEY_HERE';

// 2. CHAMBER DIRECTORY SOURCE URL 
const membersDataSource = 'data/members.json'; 

/**
 * Async execution for real-time weather monitoring
 */
async function fetchWeatherData() {
    try {
        // Fetch Current Temperature & Conditions
        const currentResponse = await fetch(currentUrl);
        if (!currentResponse.ok) throw new Error(`Weather status error: ${currentResponse.status}`);
        const currentData = await currentResponse.json();
        
        // Fetch 5-Day Forecast data (to parse out a 3-Day clean projection)
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) throw new Error(`Forecast status error: ${forecastResponse.status}`);
        const forecastData = await forecastResponse.json();

        renderCurrentWeather(currentData);
        renderThreeDayForecast(forecastData);

    } catch (error) {
        console.error("Failed to recover meteorological API metrics:", error);
        document.getElementById('weather-description').textContent = "Weather data temporarily un-syncable.";
    }
}

/**
 * Injects current parameters directly into the DOM interface
 */
function renderCurrentWeather(data) {
    const tempElement = document.getElementById('current-temp');
    const descElement = document.getElementById('weather-description');
    
    // Format temperature to whole degrees
    tempElement.innerHTML = `${Math.round(data.main.temp)}&deg;C`;
    
    // Capitalize each word of the weather description
    const rawDesc = data.weather[0].description;
    descElement.textContent = rawDesc.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Extracts and filters a clean 3-day projection from the 3-hour interval arrays
 */
function renderThreeDayForecast(data) {
    const container = document.getElementById('forecast-container');
    container.innerHTML = ''; // Clear fallback text

    // Filter list entries to grab one forecast frame (~12:00 PM mid-day data) per day
    const distinctDaysList = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    
    // Slice down to exactly 3 distinct upcoming days
    const threeDaySlice = distinctDaysList.slice(0, 3);

    threeDaySlice.forEach(dayInfo => {
        // Convert timestamp into text day names (e.g., "Saturday")
        const dateObj = new Date(dayInfo.dt * 1000);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const predictedTemp = Math.round(dayInfo.main.temp);
        const forecastDesc = dayInfo.weather[0].description;

        const dayRow = document.createElement('p');
        dayRow.innerHTML = `<strong>${dayName}:</strong> ${predictedTemp}&deg;C - <em>${forecastDesc}</em>`;
        container.appendChild(dayRow);
    });
}

/**
 * Async directory loader targeting enterprise tiers
 */
async function loadPremiumSpotlights() {
    try {
        const response = await fetch(membersDataSource);
        if (!response.ok) throw new Error(`JSON Directory read failure: ${response.status}`);
        const membersList = await response.json();

        // Strict Requirement Filter: Must match Gold (Level 3) or Silver (Level 2) structural tiers
        const qualifiedPremiumMembers = membersList.filter(member => {
            const level = member.membershipLevel.toLowerCase();
            return level === 'gold' || level === 'silver';
        });

        // Randomly shuffle the elements and extract a subset of 2 or 3
        const selectedSpotlights = shuffleArray(qualifiedPremiumMembers).slice(0, 3);
        
        renderSpotlightCards(selectedSpotlights);

    } catch (error) {
        console.error("Spotlight rendering exception:", error);
        document.getElementById('spotlight-container').innerHTML = `<p>Premium highlights are adjusting. Please reload.</p>`;
    }
}

/**
 * Randomized Fisher-Yates shuffle engine to prevent pattern repetition on load
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Generates card blueprints inside the visual grid block
 */
function renderSpotlightCards(premiumGroup) {
    const wrapper = document.getElementById('spotlight-container');
    wrapper.innerHTML = ''; // Clear fallback

    premiumGroup.forEach(company => {
        const card = document.createElement('article');
        // Dynamic assignment of premium tier hooks for unique accent boundaries
        card.className = `spotlight-card ${company.membershipLevel.toLowerCase()}-tier`;

        card.innerHTML = `
            <h4>${company.name}</h4>
            <div class="spotlight-logo-box">
                <img src="images/${company.imageFile}" alt="${company.name} Branding Mark" loading="lazy">
            </div>
            <p class="spotlight-industry"><strong>Tier:</strong> ${company.membershipLevel}</p>
            <p class="spotlight-address">📍 ${company.address}</p>
            <p class="spotlight-phone">📞 ${company.phone}</p>
            <p class="spotlight-motto">"${company.tagline || 'Expanding regional infrastructure lines.'}"</p>
            <a href="${company.websiteUrl}" target="_blank" rel="noopener noreferrer">Access Operations Portal →</a>
        `;
        wrapper.appendChild(card);
    });
}

// Initialize scripts once DOM is fully built
document.addEventListener("DOMContentLoaded", () => {
    fetchWeatherData();
    loadPremiumSpotlights();
});