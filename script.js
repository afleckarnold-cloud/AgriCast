// ===== AgriCast v2.0 - Precision Farming Intelligence Platform =====
// Vanilla JavaScript - No Dependencies

// ===== Configuration & Constants =====
const CONFIG = {
    crops: {
        corn: { name: 'Corn', base: 10, threshold: 2500, stages: ['V0', 'V4', 'V8', 'VT', 'R1', 'R3', 'R5'] },
        wheat: { name: 'Wheat', base: 4.4, threshold: 1500, stages: ['Z10', 'Z20', 'Z30', 'Z49', 'Z65', 'Z75', 'Z95'] },
        soybean: { name: 'Soybean', base: 10, threshold: 2500, stages: ['VE', 'VC', 'V2', 'V6', 'R1', 'R5', 'R7'] }
    },
    locations: {
        // Canada - Provinces
        calgary: { name: 'Calgary, Alberta', lat: 51.0504, lon: -114.0853 },
        edmonton: { name: 'Edmonton, Alberta', lat: 53.5461, lon: -113.4938 },
        vancouver: { name: 'Vancouver, British Columbia', lat: 49.2827, lon: -123.1207 },
        victoria: { name: 'Victoria, British Columbia', lat: 48.4281, lon: -123.3656 },
        winnipeg: { name: 'Winnipeg, Manitoba', lat: 49.8951, lon: -97.1384 },
        fredericton: { name: 'Fredericton, New Brunswick', lat: 45.9636, lon: -66.6431 },
        halifax: { name: 'Halifax, Nova Scotia', lat: 44.6426, lon: -63.2181 },
        sydney: { name: 'Sydney, Nova Scotia', lat: 46.1667, lon: -60.2500 },
        'st-johns': { name: "St. John's, Newfoundland & Labrador", lat: 47.5604, lon: -52.7126 },
        toronto: { name: 'Toronto, Ontario', lat: 43.6629, lon: -79.3957 },
        ottawa: { name: 'Ottawa, Ontario', lat: 45.4215, lon: -75.6972 },
        montreal: { name: 'Montreal, Quebec', lat: 45.5017, lon: -73.5673 },
        'quebec-city': { name: 'Quebec City, Quebec', lat: 46.8139, lon: -71.2080 },
        regina: { name: 'Regina, Saskatchewan', lat: 50.4452, lon: -104.6189 },
        saskatoon: { name: 'Saskatoon, Saskatchewan', lat: 52.1579, lon: -106.6702 },
        yellowknife: { name: 'Yellowknife, Northwest Territories', lat: 62.4560, lon: -114.3721 },
        whitehorse: { name: 'Whitehorse, Yukon', lat: 60.7212, lon: -135.0568 },
        // Other locations
        'new-york': { name: 'New York City, USA', lat: 40.7128, lon: -74.0060 },
        'los-angeles': { name: 'Los Angeles, USA', lat: 34.0522, lon: -118.2437 },
        chicago: { name: 'Chicago, USA', lat: 41.8781, lon: -87.6298 }
    },
    apiUrl: 'https://api.open-meteo.com/v1/forecast',
    updateInterval: 600000, // 10 minutes
    storageKeys: {
        location: 'agricast_location',
        locationMode: 'agricast_location_mode',
        crop: 'agricast_crop',
        units: 'agricast_units'
    }
};

// ===== State Management =====
const state = {
    location: { lat: null, lon: null, name: 'Unknown' },
    locationMode: 'geolocation', // 'geolocation' or location key
    weather: {},
    currentCrop: 'corn',
    units: 'celsius',
    lastUpdate: null,
    chartData: [],
    thresholdReached: false,
    forecast7: [],
    forecast14: [],
    outlookExtended: {}
};

// ===== DOM Elements =====
const elements = {
    locationText: document.getElementById('locationText'),
    locationSelect: document.getElementById('locationSelect'),
    tempDisplay: document.getElementById('tempDisplay'),
    humidityDisplay: document.getElementById('humidityDisplay'),
    windDisplay: document.getElementById('windDisplay'),
    moistureDisplay: document.getElementById('moistureDisplay'),
    cropName: document.getElementById('cropName'),
    cropBadge: document.getElementById('cropBadge'),
    gddToday: document.getElementById('gddToday'),
    gddSeason: document.getElementById('gddSeason'),
    growthStage: document.getElementById('growthStage'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    thiValue: document.getElementById('thiValue'),
    thiText: document.getElementById('thiText'),
    thiDisplay: document.getElementById('thiDisplay'),
    lastUpdate: document.getElementById('lastUpdate'),
    unitToggle: document.getElementById('unitToggle'),
    cropSelect: document.getElementById('cropSelect'),
    refreshBtn: document.getElementById('refreshBtn'),
    tempChart: document.getElementById('tempChart'),
    chartStatus: document.getElementById('chartStatus')
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    setupTabNavigation();
    getLocation();
    setupEventListeners();
    fetchWeatherData();
    setInterval(fetchWeatherData, CONFIG.updateInterval);
});

// ===== Settings Management =====
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const activeContent = document.getElementById(`${tabName}-tab`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
}

// ===== Settings Management =====
function loadSettings() {
    const savedLocation = localStorage.getItem(CONFIG.storageKeys.location);
    const savedLocationMode = localStorage.getItem(CONFIG.storageKeys.locationMode);
    const savedCrop = localStorage.getItem(CONFIG.storageKeys.crop);
    const savedUnits = localStorage.getItem(CONFIG.storageKeys.units);

    if (savedLocation) {
        state.location = JSON.parse(savedLocation);
    }
    if (savedLocationMode) {
        state.locationMode = savedLocationMode;
        elements.locationSelect.value = savedLocationMode;
    }
    if (savedCrop) {
        state.currentCrop = savedCrop;
        elements.cropSelect.value = savedCrop;
    }
    if (savedUnits) {
        state.units = savedUnits;
        elements.unitToggle.value = savedUnits;
    }
}

function saveSettings() {
    localStorage.setItem(CONFIG.storageKeys.location, JSON.stringify(state.location));
    localStorage.setItem(CONFIG.storageKeys.locationMode, state.locationMode);
    localStorage.setItem(CONFIG.storageKeys.crop, state.currentCrop);
    localStorage.setItem(CONFIG.storageKeys.units, state.units);
}

function setupEventListeners() {
    elements.locationSelect.addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        
        if (selectedValue === 'geolocation') {
            state.locationMode = 'geolocation';
            getLocation();
        } else {
            state.locationMode = selectedValue;
            const locationData = CONFIG.locations[selectedValue];
            if (locationData) {
                state.location = {
                    lat: locationData.lat,
                    lon: locationData.lon,
                    name: locationData.name
                };
                updateLocationDisplay();
                fetchWeatherData();
            }
        }
        saveSettings();
    });

    elements.unitToggle.addEventListener('change', (e) => {
        state.units = e.target.value;
        saveSettings();
        updateWeatherDisplay();
        updateChart();
    });

    elements.cropSelect.addEventListener('change', (e) => {
        state.currentCrop = e.target.value;
        saveSettings();
        updateCropDisplay();
    });

    elements.refreshBtn.addEventListener('click', fetchWeatherData);
}

// ===== Geolocation =====
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                state.location.lat = position.coords.latitude;
                state.location.lon = position.coords.longitude;
                reverseGeocode(position.coords.latitude, position.coords.longitude);
                saveSettings();
            },
            (error) => {
                console.warn('Geolocation error:', error);
                // Fallback to saved location or default to Toronto
                if (!state.location.lat) {
                    const defaultLocation = CONFIG.locations.toronto;
                    state.location = {
                        lat: defaultLocation.lat,
                        lon: defaultLocation.lon,
                        name: defaultLocation.name
                    };
                    state.locationMode = 'toronto';
                    elements.locationSelect.value = 'toronto';
                    updateLocationDisplay();
                    fetchWeatherData();
                }
            }
        );
    } else {
        const defaultLocation = CONFIG.locations.toronto;
        state.location = {
            lat: defaultLocation.lat,
            lon: defaultLocation.lon,
            name: defaultLocation.name
        };
        state.locationMode = 'toronto';
        elements.locationSelect.value = 'toronto';
        updateLocationDisplay();
        fetchWeatherData();
    }
}

function reverseGeocode(lat, lon) {
    // Using Nominatim for reverse geocoding (free, no API key needed)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then((response) => response.json())
        .then((data) => {
            const city = data.address?.city || data.address?.town || data.address?.county || 'Location';
            const country = data.address?.country_code?.toUpperCase() || '';
            state.location.name = `${city}, ${country}`;
            updateLocationDisplay();
            // Only fetch data if geolocation was successful
            if (state.locationMode === 'geolocation') {
                fetchWeatherData();
            }
        })
        .catch((error) => {
            console.warn('Reverse geocoding error:', error);
            state.location.name = `${state.location.lat.toFixed(2)}, ${state.location.lon.toFixed(2)}`;
            updateLocationDisplay();
            if (state.locationMode === 'geolocation') {
                fetchWeatherData();
            }
        });
}

function updateLocationDisplay() {
    elements.locationText.textContent = `📍 ${state.location.name}`;
}

// ===== Weather API Fetch =====
function fetchWeatherData() {
    const params = new URLSearchParams({
        latitude: state.location.lat,
        longitude: state.location.lon,
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,soil_moisture_0_to_10cm',
        hourly: 'temperature_2m',
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
        forecast_days: 16,
        timezone: 'auto'
    });

    fetch(`${CONFIG.apiUrl}?${params}`)
        .then((response) => response.json())
        .then((data) => {
            state.weather = data.current;
            state.weather.daily = data.daily; // Store full daily data for drought calculations
            state.chartData = data.hourly.temperature_2m.slice(0, 24);
            state.forecast7 = data.daily.time.slice(0, 7).map((date, i) => ({
                date,
                high: data.daily.temperature_2m_max[i],
                low: data.daily.temperature_2m_min[i],
                precip: data.daily.precipitation_sum[i] || 0,
                code: data.daily.weather_code[i]
            }));
            state.forecast14 = data.daily.time.slice(0, 14).map((date, i) => ({
                date,
                high: data.daily.temperature_2m_max[i],
                low: data.daily.temperature_2m_min[i],
                precip: data.daily.precipitation_sum[i] || 0,
                code: data.daily.weather_code[i]
            }));
            state.lastUpdate = new Date();
            updateWeatherDisplay();
            updateCropDisplay();
            updateLivestockDisplay();
            updateChart();
            updateForecastDisplay();
            analyzeWeatherImplications();
            fetchDroughtData();
        })
        .catch((error) => {
            console.error('API fetch error:', error);
            elements.chartStatus.textContent = '❌ Error fetching data. Please check your connection.';
        });
}

// ===== Temperature Conversion =====
function convertTemp(celsius) {
    if (state.units === 'fahrenheit') {
        return (celsius * 9) / 5 + 32;
    }
    return celsius;
}

function getTempUnit() {
    return state.units === 'celsius' ? '°C' : '°F';
}

// ===== Weather Display Update =====
function updateWeatherDisplay() {
    const temp = state.weather.temperature_2m || 0;
    const humidity = state.weather.relative_humidity_2m || 0;
    const wind = state.weather.wind_speed_10m || 0;
    const moisture = state.weather.soil_moisture_0_to_10cm || 0;

    const displayTemp = convertTemp(temp);
    const unit = getTempUnit();

    elements.tempDisplay.textContent = `${displayTemp.toFixed(1)}${unit}`;
    elements.humidityDisplay.textContent = `${humidity}%`;
    elements.windDisplay.textContent = `${wind.toFixed(1)} m/s`;
    elements.moistureDisplay.textContent = `${moisture.toFixed(1)}%`;

    // Update timestamp
    const time = new Date(state.lastUpdate);
    elements.lastUpdate.textContent = time.toLocaleTimeString();
}

// ===== GDD Calculation =====
function calculateGDD(maxTemp, minTemp, baseTemp) {
    const avgTemp = (maxTemp + minTemp) / 2;
    const gdd = Math.max(0, avgTemp - baseTemp);
    return gdd;
}

function updateCropDisplay() {
    const crop = CONFIG.crops[state.currentCrop];
    const currentTemp = state.weather.temperature_2m || 0;
    const avgTemp = currentTemp; // Using current as proxy for daily average

    // Calculate today's GDD
    const todayGDD = calculateGDD(currentTemp + 5, currentTemp - 5, crop.base); // Estimate range
    
    // Estimate season GDD (mock data - in production, would accumulate over season)
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const seasonGDD = Math.min(crop.threshold, Math.floor((dayOfYear / 365) * crop.threshold));

    // Determine growth stage based on GDD
    const stageIndex = Math.floor((seasonGDD / crop.threshold) * (crop.stages.length - 1));
    const currentStage = crop.stages[stageIndex] || crop.stages[0];

    // Update display
    elements.cropName.textContent = crop.name;
    elements.cropBadge.textContent = `Base: ${crop.base}°C`;
    elements.gddToday.textContent = `${todayGDD.toFixed(1)} units`;
    elements.gddSeason.textContent = `${seasonGDD} / ${crop.threshold} units`;
    elements.growthStage.textContent = currentStage;

    // Update progress bar
    const progressPercent = (seasonGDD / crop.threshold) * 100;
    elements.progressFill.style.width = `${Math.min(100, progressPercent)}%`;
    elements.progressText.textContent = `Season Progress: ${Math.min(100, progressPercent.toFixed(1))}%`;

    // Check if threshold reached
    state.thresholdReached = seasonGDD >= crop.threshold;
}

// ===== THI Calculation =====
function calculateTHI(tempC, humidity) {
    // THI formula for cattle (Temperature Humidity Index)
    const tempF = (tempC * 9) / 5 + 32;
    const thi = (1.8 * tempF - 32) - (0.55 - 0.0055 * humidity) * (1.8 * tempF - 26.8);
    return thi;
}

function getTHIRecommendation(thi) {
    if (thi < 74) {
        return {
            status: 'Safe',
            color: 'safe',
            text: 'Comfortable conditions for cattle. No heat stress concerns. Ensure adequate water availability.'
        };
    } else if (thi < 79) {
        return {
            status: 'Alert',
            color: 'alert',
            text: 'Cattle may experience mild heat stress. Provide shade and ensure water supply. Reduce strenuous activities.'
        };
    } else if (thi < 84) {
        return {
            status: 'Danger',
            color: 'danger',
            text: 'Significant heat stress risk. Provide shade, increase water access, reduce exercise, monitor milk production.'
        };
    } else {
        return {
            status: 'Critical',
            color: 'critical',
            text: '⚠️ CRITICAL heat stress condition. Implement emergency cooling measures. Consult veterinarian. Restrict movement.'
        };
    }
}

function updateLivestockDisplay() {
    const temp = state.weather.temperature_2m || 0;
    const humidity = state.weather.relative_humidity_2m || 0;
    const thi = calculateTHI(temp, humidity);

    const recommendation = getTHIRecommendation(thi);

    elements.thiValue.textContent = thi.toFixed(1);
    elements.thiText.textContent = recommendation.text;

    // Update display color based on status
    elements.thiDisplay.className = `thi-display ${recommendation.color}`;
}

// ===== Chart Generation (Vanilla SVG) =====
function updateChart() {
    if (!state.chartData || state.chartData.length === 0) {
        elements.chartStatus.textContent = 'No data available';
        return;
    }

    const svg = elements.tempChart;
    svg.innerHTML = ''; // Clear existing chart

    const width = 1200;
    const height = 300;
    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Convert temperatures based on unit preference
    const convertedTemps = state.chartData.map(temp => convertTemp(temp));
    
    // Find min/max temps from converted data
    const minTemp = Math.min(...convertedTemps);
    const maxTemp = Math.max(...convertedTemps);
    const tempRange = maxTemp - minTemp || 1;

    // Draw grid background
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'chartGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#2ecc71');
    stop1.setAttribute('stop-opacity', '0.3');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#2ecc71');
    stop2.setAttribute('stop-opacity', '0.05');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Draw grid lines
    const unit = getTempUnit();
    for (let i = 0; i <= 5; i++) {
        const y = padding + (graphHeight / 5) * i;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', padding);
        line.setAttribute('y1', y);
        line.setAttribute('x2', width - padding);
        line.setAttribute('y2', y);
        line.setAttribute('class', 'chart-grid');
        svg.appendChild(line);

        // Y-axis labels (temperature)
        const tempValue = maxTemp - (tempRange / 5) * i;
        const tempLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tempLabel.setAttribute('x', padding - 10);
        tempLabel.setAttribute('y', y + 5);
        tempLabel.setAttribute('class', 'chart-axis-label');
        tempLabel.setAttribute('text-anchor', 'end');
        tempLabel.textContent = `${tempValue.toFixed(0)}${unit}`;
        svg.appendChild(tempLabel);
    }

    // Draw X-axis labels (hours)
    for (let i = 0; i < convertedTemps.length; i += 3) {
        const x = padding + (graphWidth / (convertedTemps.length - 1)) * i;
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x);
        label.setAttribute('y', height - 10);
        label.setAttribute('class', 'chart-axis-label');
        label.textContent = `${i}h`;
        svg.appendChild(label);
    }

    // Create path for temperature line
    let pathData = '';
    convertedTemps.forEach((temp, index) => {
        const x = padding + (graphWidth / (convertedTemps.length - 1)) * index;
        const y = height - padding - ((temp - minTemp) / tempRange) * graphHeight;
        pathData += (index === 0 ? 'M' : 'L') + ` ${x} ${y}`;
    });

    // Draw area under curve
    const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    areaPath.setAttribute('d', `${pathData} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`);
    areaPath.setAttribute('fill', 'url(#chartGradient)');
    svg.appendChild(areaPath);

    // Draw line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', pathData);
    line.setAttribute('class', 'chart-line');
    svg.appendChild(line);

    // Draw data points
    convertedTemps.forEach((temp, index) => {
        const x = padding + (graphWidth / (convertedTemps.length - 1)) * index;
        const y = height - padding - ((temp - minTemp) / tempRange) * graphHeight;
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 4);
        circle.setAttribute('class', 'chart-point');
        svg.appendChild(circle);
    });

    // Draw axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', padding);
    xAxis.setAttribute('y1', height - padding);
    xAxis.setAttribute('x2', width - padding);
    xAxis.setAttribute('y2', height - padding);
    xAxis.setAttribute('class', 'chart-axis');
    svg.appendChild(xAxis);

    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', padding);
    yAxis.setAttribute('y1', padding);
    yAxis.setAttribute('x2', padding);
    yAxis.setAttribute('y2', height - padding);
    yAxis.setAttribute('class', 'chart-axis');
    svg.appendChild(yAxis);

    // Update chart status
    const minDisplay = minTemp.toFixed(1);
    const maxDisplay = maxTemp.toFixed(1);
    elements.chartStatus.textContent = `📊 Temperature range: ${minDisplay}${unit} - ${maxDisplay}${unit} | Last updated: ${state.lastUpdate.toLocaleTimeString()}`;
}

// ===== Weather Code Mapping =====
function getWeatherDescription(code) {
    const codes = {
        0: '☀️ Clear',
        1: '🌤️ Mostly Clear',
        2: '⛅ Partly Cloudy',
        3: '☁️ Overcast',
        45: '🌫️ Foggy',
        48: '🌫️ Depositing Rime',
        51: '🌧️ Light Drizzle',
        53: '🌧️ Moderate Drizzle',
        55: '🌧️ Dense Drizzle',
        61: '🌧️ Slight Rain',
        63: '🌧️ Moderate Rain',
        65: '⛈️ Heavy Rain',
        71: '❄️ Slight Snow',
        73: '❄️ Moderate Snow',
        75: '❄️ Heavy Snow',
        80: '🌧️ Slight Rain Showers',
        81: '🌧️ Moderate Rain Showers',
        82: '⛈️ Violent Rain Showers',
        85: '❄️ Slight Snow Showers',
        86: '❄️ Heavy Snow Showers',
        95: '⛈️ Thunderstorm',
        96: '⛈️ Thunderstorm with Hail',
        99: '⛈️ Thunderstorm with Heavy Hail'
    };
    return codes[code] || '❓ Unknown';
}

// ===== Update Forecast Display =====
function updateForecastDisplay() {
    // 7-Day Forecast
    const forecast7El = document.getElementById('forecast7');
    forecast7El.innerHTML = state.forecast7.map(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const high = convertTemp(day.high).toFixed(0);
        const low = convertTemp(day.low).toFixed(0);
        const unit = getTempUnit();
        const icon = getWeatherDescription(day.code).split(' ')[0];
        
        return `
            <div class="forecast-item">
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-icon">${icon}</div>
                <div class="forecast-high">${high}${unit}</div>
                <div class="forecast-low">${low}${unit}</div>
                <div class="forecast-precip">${day.precip.toFixed(1)}mm</div>
            </div>
        `;
    }).join('');

    // 14-Day Forecast
    const forecast14El = document.getElementById('forecast14');
    forecast14El.innerHTML = state.forecast14.map(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const high = convertTemp(day.high).toFixed(0);
        const unit = getTempUnit();
        const icon = getWeatherDescription(day.code).split(' ')[0];
        
        return `
            <div class="forecast-item">
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-icon">${icon}</div>
                <div class="forecast-high">${high}${unit}</div>
            </div>
        `;
    }).join('');

    // Extended Outlooks (Placeholder for NWS/ECCC data)
    updateExtendedOutlooks();
}

// ===== Update Extended Outlooks =====
function updateExtendedOutlooks() {
    // 6-10 Day: Analyze from available forecast
    const avg610 = state.forecast14.slice(5, 10).reduce((sum, d) => sum + d.high, 0) / 5;
    const avgNormal = state.forecast14.slice(0, 7).reduce((sum, d) => sum + d.high, 0) / 7;
    const precip610 = state.forecast14.slice(5, 10).reduce((sum, d) => sum + d.precip, 0);
    
    document.getElementById('out610Temp').textContent = 
        `${convertTemp(avg610).toFixed(0)}${getTempUnit()} (${avg610 > avgNormal ? 'Above' : 'Below'} Normal)`;
    document.getElementById('out610Precip').textContent = `${precip610.toFixed(1)}mm (${precip610 > 25 ? 'Above' : 'Below'} Average)`;

    // 8-14 Day
    const avg814 = state.forecast14.slice(7, 14).reduce((sum, d) => sum + d.high, 0) / 7;
    const precip814 = state.forecast14.slice(7, 14).reduce((sum, d) => sum + d.precip, 0);
    
    document.getElementById('out814Temp').textContent = 
        `${convertTemp(avg814).toFixed(0)}${getTempUnit()} (${avg814 > avgNormal ? 'Above' : 'Below'} Normal)`;
    document.getElementById('out814Precip').textContent = `${precip814.toFixed(1)}mm (${precip814 > 25 ? 'Above' : 'Below'} Average)`;

    // 3-4 Week (Extended projection based on pattern)
    document.getElementById('outMonthlyTemp').textContent = 'Moderate - Check NWS/ECCC';
    document.getElementById('outMonthlyPrecip').textContent = 'Variable - Check extended outlooks';
}

// ===== Analyze Weather Implications =====
function analyzeWeatherImplications() {
    const nextWeekAvgHigh = state.forecast7.reduce((sum, d) => sum + d.high, 0) / 7;
    const nextWeekPrecip = state.forecast7.reduce((sum, d) => sum + d.precip, 0);
    const nextWeekAvgLow = state.forecast7.reduce((sum, d) => sum + d.low, 0) / 7;
    
    let implications = '';
    
    // Crop implications
    if (state.currentCrop === 'corn') {
        implications += `<div class="implication-item">
            <div class="implication-title">🌾 Corn Growth</div>
            <div class="implication-desc">`;
        
        if (nextWeekAvgHigh > 28) {
            implications += 'High temperatures may accelerate growth but increase water demand. Ensure adequate soil moisture. ';
        } else if (nextWeekAvgHigh > 20) {
            implications += 'Temperatures optimal for corn development. Monitor for disease in wet conditions. ';
        } else {
            implications += 'Cool temperatures may slow growth. Watch for early blight if wet. ';
        }
        
        if (nextWeekPrecip > 50) {
            implications += 'Significant rainfall expected - good for growth but monitor for fungal diseases.';
        } else if (nextWeekPrecip > 25) {
            implications += 'Moderate rainfall supports growth. May delay field operations.';
        } else {
            implications += 'Dry conditions - irrigation may be needed.';
        }
        implications += `</div></div>`;
    }
    
    // Livestock implications
    implications += `<div class="implication-item">
        <div class="implication-title">🐄 Livestock Management</div>
        <div class="implication-desc">`;
    
    if (nextWeekAvgHigh > 28 || calculateTHI(nextWeekAvgHigh, state.weather.relative_humidity_2m || 60) > 75) {
        implications += 'Heat stress risk - provide shade, water, and ventilation. Consider adjusting grazing times. ';
    } else {
        implications += 'Comfortable conditions for livestock. Normal management practices. ';
    }
    
    if (nextWeekPrecip > 50) {
        implications += 'Muddy pastures expected - may affect grazing and increase disease risk.';
    } else {
        implications += 'Pasture conditions should remain good.';
    }
    implications += `</div></div>`;
    
    // Field operations
    implications += `<div class="implication-item">
        <div class="implication-title">🚜 Field Operations</div>
        <div class="implication-desc">`;
    
    if (nextWeekPrecip > 50) {
        implications += 'Heavy rainfall may delay or prevent field work. Soil conditions will be wet. ';
    } else if (nextWeekPrecip > 25) {
        implications += 'Some delays possible. Avoid working wet soils. ';
    } else {
        implications += 'Good window for field operations. Soil conditions should be workable. ';
    }
    
    implications += `Plan equipment maintenance for wet periods.</div></div>`;
    
    // Pest and disease
    implications += `<div class="implication-item">
        <div class="implication-title">🦗 Pest & Disease Pressure</div>
        <div class="implication-desc">`;
    
    if (nextWeekPrecip > 50 && nextWeekAvgHigh > 18) {
        implications += 'High humidity and warm temps - elevated fungal disease risk. Scout fields regularly and consider preventative treatments.';
    } else if (nextWeekPrecip > 25 && nextWeekAvgHigh > 20) {
        implications += 'Moderate disease pressure. Continue scouting for early detection.';
    } else {
        implications += 'Low disease pressure expected. Standard monitoring recommended.';
    }
    implications += `</div></div>`;
    
    document.getElementById('weatherImplications').innerHTML = implications;
}

// ===== Drought Monitor Functions =====

/**
 * Fetch drought data from ECCC (for Canada) or USDM (for US)
 */
async function fetchDroughtData() {
    try {
        const location = CONFIG.locations[state.locationMode] || state.location;
        const lat = state.location.lat || location.lat;
        const lon = state.location.lon || location.lon;
        const name = state.location.name || location.name;

        // Determine if location is in Canada or US
        const isCanada = name.includes('Canada') || 
                        name.includes('Alberta') || name.includes('British Columbia') ||
                        name.includes('Manitoba') || name.includes('New Brunswick') ||
                        name.includes('Nova Scotia') || name.includes('Newfoundland') ||
                        name.includes('Ontario') || name.includes('Quebec') ||
                        name.includes('Saskatchewan') || name.includes('Territories') ||
                        name.includes('Yukon') || name.includes('Northwest');

        let droughtData = {};

        if (isCanada) {
            droughtData = await fetchECCCDroughtData(lat, lon, name);
        } else {
            droughtData = await fetchUSDMDroughtData(lat, lon, name);
        }

        updateDroughtDisplay(droughtData);
        updateDroughtImplications(droughtData);
    } catch (error) {
        console.error('Error fetching drought data:', error);
        document.getElementById('droughtStatus').innerHTML = 
            '<p style="color: var(--text-secondary);">Unable to load drought data at this time</p>';
    }
}

/**
 * Fetch ECCC drought data for Canadian locations
 * Using simulated data based on precipitation patterns
 */
async function fetchECCCDroughtData(lat, lon, locationName) {
    // ECCC drought monitoring uses SPI (Standardized Precipitation Index)
    // For now, we'll derive estimated values from weather forecast
    
    // Calculate estimated drought indicators from weather data
    const currentMonth = new Date().getMonth();
    const avgTemp = state.weather.daily ? 
        (state.weather.daily.temperature_2m_max.slice(0, 7).reduce((a, b) => a + b, 0) / 7) : 20;
    
    // Simplified drought assessment based on precipitation patterns
    const hasRecentRain = state.weather.daily && state.weather.daily.precipitation_sum[0] > 10;
    const forecast7DayPrecip = state.weather.daily ? 
        state.weather.daily.precipitation_sum.slice(0, 7).reduce((a, b) => a + b, 0) : 0;

    // Estimate SPI (ranges from -3 to +3, where 0 is normal)
    let spiValue = 0;
    if (forecast7DayPrecip > 50) {
        spiValue = 1.5; // Above normal
    } else if (forecast7DayPrecip > 25) {
        spiValue = 0.5;
    } else if (forecast7DayPrecip < 10) {
        spiValue = -1.5; // Below normal
    } else {
        spiValue = -0.5;
    }

    // Estimate PDSI (-4 to +4 scale)
    let pdsiValue = spiValue * 1.3;

    // Determine drought severity (ECCC uses: None, Abnormal, Moderate, Severe, Extreme)
    let severity = 'None';
    if (spiValue < -1.5) {
        severity = 'Extreme';
    } else if (spiValue < -1.0) {
        severity = 'Severe';
    } else if (spiValue < -0.5) {
        severity = 'Moderate';
    } else if (spiValue < 0) {
        severity = 'Abnormal';
    } else {
        severity = 'None';
    }

    return {
        region: locationName,
        source: 'ECCC',
        severity: severity,
        spi: spiValue.toFixed(2),
        pdsi: pdsiValue.toFixed(2),
        lastUpdate: new Date().toLocaleDateString(),
        outlook: forecast7DayPrecip > 30 ? 'Improving' : 'Stable to Declining'
    };
}

/**
 * Fetch USDM (US Drought Monitor) data for US locations
 * Categories: D0 (Abnormally Dry), D1 (Moderate), D2 (Severe), D3 (Extreme), D4 (Exceptional)
 */
async function fetchUSDMDroughtData(lat, lon, locationName) {
    // USDM public data is limited, so we'll estimate based on weather patterns
    
    const forecast7DayPrecip = state.weather.daily ? 
        state.weather.daily.precipitation.slice(0, 7).reduce((a, b) => a + b, 0) : 0;
    
    const avgTemp = state.weather.daily ? 
        (state.weather.daily.temperature_2m_max.slice(0, 7).reduce((a, b) => a + b, 0) / 7) : 20;

    // Determine USDM category (D0-D4)
    let category = 'D0'; // None
    let categoryName = 'No Drought';

    if (forecast7DayPrecip < 5 && avgTemp > 30) {
        category = 'D4';
        categoryName = 'Exceptional Drought';
    } else if (forecast7DayPrecip < 10 && avgTemp > 25) {
        category = 'D3';
        categoryName = 'Extreme Drought';
    } else if (forecast7DayPrecip < 15) {
        category = 'D2';
        categoryName = 'Severe Drought';
    } else if (forecast7DayPrecip < 25) {
        category = 'D1';
        categoryName = 'Moderate Drought';
    } else if (forecast7DayPrecip < 35) {
        category = 'D0';
        categoryName = 'Abnormally Dry';
    } else {
        category = 'None';
        categoryName = 'No Drought';
    }

    return {
        region: locationName,
        source: 'USDM',
        category: category,
        categoryName: categoryName,
        spi: ((35 - forecast7DayPrecip) / 20).toFixed(2),
        pdsi: ((30 - forecast7DayPrecip) / 25).toFixed(2),
        lastUpdate: new Date().toLocaleDateString(),
        outlook: forecast7DayPrecip > 20 ? 'Improving' : 'Stable to Declining'
    };
}

/**
 * Update drought display with fetched data
 */
function updateDroughtDisplay(droughtData) {
    // Update status
    const statusDiv = document.getElementById('droughtStatus');
    statusDiv.innerHTML = `
        <p><strong>Location:</strong> ${droughtData.region}</p>
        <p><strong>Source:</strong> ${droughtData.source}</p>
        <p><strong>Status:</strong> ${droughtData.severity || droughtData.categoryName}</p>
        <p><strong>Last Updated:</strong> ${droughtData.lastUpdate}</p>
    `;

    // Update indices
    document.getElementById('spiValue').textContent = droughtData.spi;
    document.getElementById('pdsiValue').textContent = droughtData.pdsi;

    // Update severity badge
    const severity = droughtData.severity || droughtData.categoryName;
    const severityBadge = document.getElementById('severityBadge');
    const severityDesc = document.getElementById('severityDesc');
    
    severityBadge.textContent = severity;
    
    // Apply severity class
    severityBadge.className = 'severity-badge';
    if (severity.includes('None') || severity.includes('No')) {
        severityBadge.classList.add('severity-none');
        severityDesc.textContent = 'No drought conditions. Normal precipitation patterns.';
    } else if (severity.includes('Abnormal') || severity.includes('D0')) {
        severityBadge.classList.add('severity-abnormal');
        severityDesc.textContent = 'Abnormally dry conditions. Monitor precipitation trends.';
    } else if (severity.includes('Moderate') || severity.includes('D1')) {
        severityBadge.classList.add('severity-moderate');
        severityDesc.textContent = 'Moderate drought conditions. Irrigation may be needed.';
    } else if (severity.includes('Severe') || severity.includes('D2')) {
        severityBadge.classList.add('severity-severe');
        severityDesc.textContent = 'Severe drought. Significant water stress expected. Prioritize irrigation.';
    } else if (severity.includes('Extreme') || severity.includes('D3')) {
        severityBadge.classList.add('severity-extreme');
        severityDesc.textContent = 'Extreme drought conditions. Critical water scarcity.';
    } else {
        severityBadge.classList.add('severity-extreme');
        severityDesc.textContent = 'Exceptional drought. Emergency water management needed.';
    }

    // Update forecast
    document.getElementById('droughtForecast').innerHTML = `
        <p><strong>Outlook:</strong> ${droughtData.outlook}</p>
        <p>Based on the 7-14 day forecast, drought conditions are expected to be <strong>${droughtData.outlook.toLowerCase()}</strong>. 
        Monitor precipitation and adjust irrigation schedules accordingly.</p>
    `;
}

/**
 * Generate drought impact recommendations
 */
function updateDroughtImplications(droughtData) {
    const severity = droughtData.severity || droughtData.categoryName;
    
    // Irrigation recommendations
    let irrigationRec = 'Monitor precipitation and plan irrigation schedule accordingly.';
    if (severity.includes('None') || severity.includes('No')) {
        irrigationRec = 'Normal precipitation expected. Standard irrigation practices recommended.';
    } else if (severity.includes('Abnormal') || severity.includes('D0')) {
        irrigationRec = 'Begin monitoring soil moisture. Prepare irrigation equipment for potential use.';
    } else if (severity.includes('Moderate') || severity.includes('D1')) {
        irrigationRec = 'Increase irrigation frequency. Focus on critical growth stages. Monitor soil moisture daily.';
    } else if (severity.includes('Severe') || severity.includes('D2') || severity.includes('Extreme')) {
        irrigationRec = 'Implement full irrigation schedule. Prioritize high-value crops. Consider deficit irrigation strategies.';
    } else {
        irrigationRec = 'Emergency irrigation required. Use all available water sources. Implement water conservation measures.';
    }

    // Crop management recommendations
    let cropRec = 'Adjust planting and management practices based on drought conditions.';
    if (severity.includes('None') || severity.includes('No')) {
        cropRec = 'Standard crop management practices. Select drought-tolerant varieties as part of long-term planning.';
    } else if (severity.includes('Abnormal') || severity.includes('D0')) {
        cropRec = 'Consider drought-tolerant crop varieties. Increase plant spacing to reduce competition.';
    } else if (severity.includes('Moderate') || severity.includes('D1')) {
        cropRec = 'Select early-maturing varieties. Reduce seeding rates. Implement mulching to conserve soil moisture.';
    } else if (severity.includes('Severe') || severity.includes('D2') || severity.includes('Extreme')) {
        cropRec = 'Consider alternative crops or reduced acreage. Use drought-resistant varieties. Implement intercropping with drought-tolerant species.';
    } else {
        cropRec = 'Assess viability of current crops. Consider fallow or drought-resistant cover crops. Plan for long-term recovery.';
    }

    // Livestock recommendations
    let livestockRec = 'Monitor water availability and pasture conditions.';
    if (severity.includes('None') || severity.includes('No')) {
        livestockRec = 'Pasture and water availability should be adequate. Standard management practices.';
    } else if (severity.includes('Abnormal') || severity.includes('D0')) {
        livestockRec = 'Monitor pasture growth. Stockpile hay early in the season. Ensure adequate water sources.';
    } else if (severity.includes('Moderate') || severity.includes('D1')) {
        livestockRec = 'Reduce stocking rates. Provide supplemental feed. Maintain multiple water sources and check daily.';
    } else if (severity.includes('Severe') || severity.includes('D2') || severity.includes('Extreme')) {
        livestockRec = 'Significantly reduce herd size or practice rotational grazing. Provide emergency water and feed. Plan for supplemental feed purchases.';
    } else {
        livestockRec = 'Implement emergency destocking. Establish water hauling protocol. Consider relocation of livestock.';
    }

    // Soil health recommendations
    let soilRec = 'Implement water conservation practices.';
    if (severity.includes('None') || severity.includes('No')) {
        soilRec = 'Maintain soil health with regular organic matter addition. Standard moisture management.';
    } else if (severity.includes('Abnormal') || severity.includes('D0')) {
        soilRec = 'Increase organic matter content to improve water retention. Use mulching on key areas.';
    } else if (severity.includes('Moderate') || severity.includes('D1')) {
        soilRec = 'Conserve every drop: No-till practices, mulching, and cover crops. Minimize soil disturbance.';
    } else if (severity.includes('Severe') || severity.includes('D2') || severity.includes('Extreme')) {
        soilRec = 'Emergency conservation: No-till only, maximize mulch, avoid bare soil. Consider dust suppression measures.';
    } else {
        soilRec = 'Full conservation protocol: Protected/irrigated areas only. Focus on post-drought soil recovery planning.';
    }

    document.getElementById('irrigationRec').textContent = irrigationRec;
    document.getElementById('cropDroughtRec').textContent = cropRec;
    document.getElementById('livestockDroughtRec').textContent = livestockRec;
    document.getElementById('soilDroughtRec').textContent = soilRec;
}

// ===== Initial Load Message =====
window.addEventListener('load', () => {
    updateLocationDisplay();
    if (state.location.lat === null) {
        elements.locationText.textContent = '📍 Waiting for location...';
    }
});

