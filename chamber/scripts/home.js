/* ==========================================================================
   LAGOS CHAMBER DATA CONNECTIONS INTEGRATION (home.js)
   ========================================================================== */

// Change units=metric to units=imperial for Fahrenheit data strings
const currentUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=6.5244&lon=3.3792&units=imperial&appid=096e94d9dc46643c9c20aab620483b9c';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=6.5244&lon=3.3792&units=imperial&appid=096e94d9dc46643c9c20aab620483b9c';
const membersDataSource = 'data/members.json';

// Mock forecast data for development/fallback
const mockCurrentWeather = {
    name: 'Lagos',
    sys: { country: 'NG' },
    main: { temp: 78, temp_max: 82, temp_min: 72, humidity: 65 },
    weather: [{ description: 'Partly Cloudy', icon: '02d' }]
};

const mockForecastData = {
    list: [
        { dt: Math.floor(Date.now() / 1000) + 86400, dt_txt: new Date(Date.now() + 86400000).toISOString().split('T')[0] + ' 12:00:00', main: { temp: 79 }, weather: [{ description: 'Sunny', icon: '01d' }] },
        { dt: Math.floor(Date.now() / 1000) + 172800, dt_txt: new Date(Date.now() + 172800000).toISOString().split('T')[0] + ' 12:00:00', main: { temp: 77 }, weather: [{ description: 'Rainy', icon: '10d' }] },
        { dt: Math.floor(Date.now() / 1000) + 259200, dt_txt: new Date(Date.now() + 259200000).toISOString().split('T')[0] + ' 12:00:00', main: { temp: 80 }, weather: [{ description: 'Thunderstorm', icon: '11d' }] }
    ]
};

// METEOROLOGICAL RUNTIME LOGIC TRACKERS
async function fetchWeatherData() {
    const forecastContainer = document.getElementById('forecast-container');
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
        console.log("Using mock data for display...");
        // Use mock data as fallback
        renderCurrentWeather(mockCurrentWeather);
        renderThreeDayForecast(mockForecastData);
    }
}

function renderCurrentWeather(data) {
    const locationElement = document.getElementById('weather-location');
    const tempElement = document.getElementById('current-temp');
    const descElement = document.getElementById('weather-description');
    const iconElement = document.getElementById('weather-icon');
    const highElement = document.getElementById('temp-high');
    const lowElement = document.getElementById('temp-low');
    const humidityElement = document.getElementById('humidity');

    if (locationElement) locationElement.textContent = `${data.name}, ${data.sys.country}`;
    if (tempElement) tempElement.textContent = `${Math.round(data.main.temp)}`;
    if (highElement) highElement.textContent = `${Math.round(data.main.temp_max)}`;
    if (lowElement) lowElement.textContent = `${Math.round(data.main.temp_min)}`;
    if (humidityElement) humidityElement.textContent = `${data.main.humidity}`;

    if (descElement && data.weather && data.weather[0]) {
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

    if (!data || !Array.isArray(data.list) || !data.list.length) {
        container.innerHTML = '<p>Forecast unavailable at this time.</p>';
        return;
    }

    const now = Date.now();
    const knownToday = new Date(now).toISOString().split('T')[0];

    const uniqueDays = [];
    const forecastDays = [];

    data.list.forEach(item => {
        const dateKey = item.dt_txt.split(' ')[0];
        if (dateKey !== knownToday && !uniqueDays.includes(dateKey) && forecastDays.length < 3) {
            uniqueDays.push(dateKey);
            forecastDays.push(item);
        }
    });

    if (forecastDays.length < 3) {
        const futureItems = data.list.filter(item => item.dt * 1000 > now);
        futureItems.forEach(item => {
            const dateKey = item.dt_txt.split(' ')[0];
            if (dateKey !== knownToday && !uniqueDays.includes(dateKey) && forecastDays.length < 3) {
                uniqueDays.push(dateKey);
                forecastDays.push(item);
            }
        });
    }

    if (!forecastDays.length) {
        container.innerHTML = '<p>Forecast unavailable at this time.</p>';
        return;
    }

    forecastDays.slice(0, 3).forEach((dayInfo, index) => {
        if (!dayInfo) return;

        const forecastDate = new Date(dayInfo.dt * 1000);
        const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });
        const dayLabel = index === 0 ? 'Tomorrow' : dayName;
        const dayTemp = Math.round(dayInfo.main.temp);
        const dayConditions = dayInfo.weather[0].description.replace(/\b\w/g, c => c.toUpperCase());

        const dayCard = document.createElement('div');
        dayCard.className = 'forecast-row';
        dayCard.innerHTML = `
            <strong>${dayLabel}:</strong>
            <span>${dayTemp}°F</span>
            <span class="forecast-summary">${dayConditions}</span>
        `;
        container.appendChild(dayCard);
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

    if (!premiumGroup.length) {
        wrapper.innerHTML = `<p>Currently no gold or silver partners are available for spotlight rotation.</p>`;
        return;
    }

    premiumGroup.slice(0, 3).forEach(company => {
        const levelBadge = company.membershipLevel === 3 ? "gold-tier" : "silver-tier";
        const levelText = company.membershipLevel === 3 ? "Gold Member" : "Silver Member";
        const companyLogo = company.image ? `<img class="spotlight-logo" src="${company.image}" alt="${company.name} logo">` : '';
        const cardElement = document.createElement('article');
        cardElement.className = `spotlight-card ${levelBadge}`;

        cardElement.innerHTML = `
            <div class="spotlight-card-header">
                ${companyLogo}
                <div>
                    <h4>${company.name}</h4>
                    <p class="spotlight-industry">${levelText} | ${company.industry}</p>
                </div>
            </div>
            <p class="spotlight-address">📍 ${company.address}</p>
            <p class="spotlight-phone">📞 ${company.phone}</p>
            <p class="spotlight-membership">Membership Level: ${levelText}</p>
            <a href="${company.website}" target="_blank" rel="noopener noreferrer">Visit Corporate Site →</a>
        `;
        wrapper.appendChild(cardElement);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchWeatherData();
    loadPremiumSpotlights();
});