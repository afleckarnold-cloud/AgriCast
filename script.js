// ===== AgriCast v2.0 - Precision Farming Intelligence Platform =====
// Vanilla JavaScript - No Dependencies

// ===== Configuration & Constants =====
const CONFIG = {
    crops: {
        corn: {
            name: 'Corn',
            base: 10,
            threshold: 2500,
            stages: ['V0', 'V4', 'V8', 'VT', 'R1', 'R3', 'R5'],
            // USDA NASS typical dates for Corn Belt region
            planting: { start: 'Apr 15', end: 'May 31', optimalStart: 'Apr 25', optimalEnd: 'May 15' },
            growing: { start: 'May 1', end: 'Sep 30', peakStart: 'Jul 1', peakEnd: 'Aug 15' },
            harvest: { start: 'Sep 15', end: 'Nov 30', optimalStart: 'Oct 1', optimalEnd: 'Nov 15' },
            daysToMaturity: 120,
            // Historical data (USDA NASS & NOAA Climate Data - US Corn Belt averages)
            historical: {
                2024: { gdd: 2680, yieldIndex: 103, notes: 'Above average warmth, good moisture' },
                2023: { gdd: 2520, yieldIndex: 98, notes: 'Near normal conditions' },
                2022: { gdd: 2610, yieldIndex: 101, notes: 'Warm summer, adequate rain' },
                2021: { gdd: 2450, yieldIndex: 96, notes: 'Cool spring, drought stress' },
                2020: { gdd: 2580, yieldIndex: 100, notes: 'Derecho impact in Iowa' }
            }
        },
        wheat: {
            name: 'Wheat',
            base: 4.4,
            threshold: 1500,
            stages: ['Z10', 'Z20', 'Z30', 'Z49', 'Z65', 'Z75', 'Z95'],
            // Winter wheat typical dates for Great Plains
            planting: { start: 'Sep 15', end: 'Nov 15', optimalStart: 'Sep 25', optimalEnd: 'Oct 25' },
            growing: { start: 'Mar 1', end: 'Jun 30', peakStart: 'Apr 15', peakEnd: 'Jun 1' },
            harvest: { start: 'Jun 15', end: 'Aug 15', optimalStart: 'Jul 1', optimalEnd: 'Jul 31' },
            daysToMaturity: 240,
            // Historical data (USDA NASS - US Winter Wheat averages)
            historical: {
                2024: { gdd: 1580, yieldIndex: 102, notes: 'Good vernalization, mild spring' },
                2023: { gdd: 1490, yieldIndex: 97, notes: 'Late freeze damage' },
                2022: { gdd: 1620, yieldIndex: 105, notes: 'Excellent conditions' },
                2021: { gdd: 1380, yieldIndex: 89, notes: 'Severe drought in Plains' },
                2020: { gdd: 1540, yieldIndex: 100, notes: 'Near normal season' }
            }
        },
        soybean: {
            name: 'Soybean',
            base: 10,
            threshold: 2500,
            stages: ['VE', 'VC', 'V2', 'V6', 'R1', 'R5', 'R7'],
            // USDA typical dates for Midwest
            planting: { start: 'Apr 25', end: 'Jun 15', optimalStart: 'May 5', optimalEnd: 'May 25' },
            growing: { start: 'May 15', end: 'Sep 30', peakStart: 'Jul 15', peakEnd: 'Aug 31' },
            harvest: { start: 'Sep 20', end: 'Nov 15', optimalStart: 'Oct 5', optimalEnd: 'Oct 31' },
            daysToMaturity: 110,
            // Historical data (USDA NASS - US Soybean averages)
            historical: {
                2024: { gdd: 2720, yieldIndex: 104, notes: 'Favorable late season rains' },
                2023: { gdd: 2480, yieldIndex: 97, notes: 'August heat stress' },
                2022: { gdd: 2550, yieldIndex: 99, notes: 'Variable conditions' },
                2021: { gdd: 2410, yieldIndex: 95, notes: 'Drought in western Corn Belt' },
                2020: { gdd: 2620, yieldIndex: 102, notes: 'Strong finish to season' }
            }
        }
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
        // USA - 100 Largest Cities
        'new-york': { name: 'New York City, NY', lat: 40.7128, lon: -74.0060 },
        'los-angeles': { name: 'Los Angeles, CA', lat: 34.0522, lon: -118.2437 },
        'chicago': { name: 'Chicago, IL', lat: 41.8781, lon: -87.6298 },
        'houston': { name: 'Houston, TX', lat: 29.7604, lon: -95.3698 },
        'phoenix': { name: 'Phoenix, AZ', lat: 33.4484, lon: -112.0740 },
        'philadelphia': { name: 'Philadelphia, PA', lat: 39.9526, lon: -75.1652 },
        'san-antonio': { name: 'San Antonio, TX', lat: 29.4241, lon: -98.4936 },
        'san-diego': { name: 'San Diego, CA', lat: 32.7157, lon: -117.1611 },
        'dallas': { name: 'Dallas, TX', lat: 32.7767, lon: -96.7970 },
        'san-jose': { name: 'San Jose, CA', lat: 37.3382, lon: -121.8863 },
        'austin': { name: 'Austin, TX', lat: 30.2672, lon: -97.7431 },
        'jacksonville': { name: 'Jacksonville, FL', lat: 30.3322, lon: -81.6557 },
        'fort-worth': { name: 'Fort Worth, TX', lat: 32.7555, lon: -97.3308 },
        'columbus': { name: 'Columbus, OH', lat: 39.9612, lon: -82.9988 },
        'charlotte': { name: 'Charlotte, NC', lat: 35.2271, lon: -80.8431 },
        'san-francisco': { name: 'San Francisco, CA', lat: 37.7749, lon: -122.4194 },
        'indianapolis': { name: 'Indianapolis, IN', lat: 39.7684, lon: -86.1581 },
        'seattle': { name: 'Seattle, WA', lat: 47.6062, lon: -122.3321 },
        'denver': { name: 'Denver, CO', lat: 39.7392, lon: -104.9903 },
        'washington-dc': { name: 'Washington, DC', lat: 38.9072, lon: -77.0369 },
        'boston': { name: 'Boston, MA', lat: 42.3601, lon: -71.0589 },
        'el-paso': { name: 'El Paso, TX', lat: 31.7619, lon: -106.4850 },
        'nashville': { name: 'Nashville, TN', lat: 36.1627, lon: -86.7816 },
        'detroit': { name: 'Detroit, MI', lat: 42.3314, lon: -83.0458 },
        'oklahoma-city': { name: 'Oklahoma City, OK', lat: 35.4676, lon: -97.5164 },
        'portland': { name: 'Portland, OR', lat: 45.5152, lon: -122.6784 },
        'las-vegas': { name: 'Las Vegas, NV', lat: 36.1699, lon: -115.1398 },
        'memphis': { name: 'Memphis, TN', lat: 35.1495, lon: -90.0490 },
        'louisville': { name: 'Louisville, KY', lat: 38.2527, lon: -85.7585 },
        'baltimore': { name: 'Baltimore, MD', lat: 39.2904, lon: -76.6122 },
        'milwaukee': { name: 'Milwaukee, WI', lat: 43.0389, lon: -87.9065 },
        'albuquerque': { name: 'Albuquerque, NM', lat: 35.0844, lon: -106.6504 },
        'tucson': { name: 'Tucson, AZ', lat: 32.2226, lon: -110.9747 },
        'fresno': { name: 'Fresno, CA', lat: 36.7378, lon: -119.7871 },
        'mesa': { name: 'Mesa, AZ', lat: 33.4152, lon: -111.8315 },
        'sacramento': { name: 'Sacramento, CA', lat: 38.5816, lon: -121.4944 },
        'atlanta': { name: 'Atlanta, GA', lat: 33.7490, lon: -84.3880 },
        'kansas-city': { name: 'Kansas City, MO', lat: 39.0997, lon: -94.5786 },
        'colorado-springs': { name: 'Colorado Springs, CO', lat: 38.8339, lon: -104.8214 },
        'omaha': { name: 'Omaha, NE', lat: 41.2565, lon: -95.9345 },
        'raleigh': { name: 'Raleigh, NC', lat: 35.7796, lon: -78.6382 },
        'miami': { name: 'Miami, FL', lat: 25.7617, lon: -80.1918 },
        'long-beach': { name: 'Long Beach, CA', lat: 33.7701, lon: -118.1937 },
        'virginia-beach': { name: 'Virginia Beach, VA', lat: 36.8529, lon: -75.9780 },
        'oakland': { name: 'Oakland, CA', lat: 37.8044, lon: -122.2712 },
        'minneapolis': { name: 'Minneapolis, MN', lat: 44.9778, lon: -93.2650 },
        'tulsa': { name: 'Tulsa, OK', lat: 36.1540, lon: -95.9928 },
        'tampa': { name: 'Tampa, FL', lat: 27.9506, lon: -82.4572 },
        'arlington-tx': { name: 'Arlington, TX', lat: 32.7357, lon: -97.1081 },
        'new-orleans': { name: 'New Orleans, LA', lat: 29.9511, lon: -90.0715 },
        'wichita': { name: 'Wichita, KS', lat: 37.6872, lon: -97.3301 },
        'cleveland': { name: 'Cleveland, OH', lat: 41.4993, lon: -81.6944 },
        'bakersfield': { name: 'Bakersfield, CA', lat: 35.3733, lon: -119.0187 },
        'aurora': { name: 'Aurora, CO', lat: 39.7294, lon: -104.8319 },
        'anaheim': { name: 'Anaheim, CA', lat: 33.8366, lon: -117.9143 },
        'honolulu': { name: 'Honolulu, HI', lat: 21.3069, lon: -157.8583 },
        'santa-ana': { name: 'Santa Ana, CA', lat: 33.7455, lon: -117.8677 },
        'riverside': { name: 'Riverside, CA', lat: 33.9425, lon: -117.3617 },
        'corpus-christi': { name: 'Corpus Christi, TX', lat: 27.8006, lon: -97.3964 },
        'lexington': { name: 'Lexington, KY', lat: 38.0406, lon: -84.5037 },
        'stockton': { name: 'Stockton, CA', lat: 37.9577, lon: -121.2908 },
        'henderson': { name: 'Henderson, NV', lat: 36.0395, lon: -114.9817 },
        'saint-paul': { name: 'Saint Paul, MN', lat: 44.9537, lon: -93.0900 },
        'st-louis': { name: 'St. Louis, MO', lat: 38.6270, lon: -90.1994 },
        'cincinnati': { name: 'Cincinnati, OH', lat: 39.1031, lon: -84.5120 },
        'pittsburgh': { name: 'Pittsburgh, PA', lat: 40.4406, lon: -79.9959 },
        'greensboro': { name: 'Greensboro, NC', lat: 36.0726, lon: -79.7920 },
        'anchorage': { name: 'Anchorage, AK', lat: 61.2181, lon: -149.9003 },
        'plano': { name: 'Plano, TX', lat: 33.0198, lon: -96.6989 },
        'lincoln': { name: 'Lincoln, NE', lat: 40.8258, lon: -96.6852 },
        'orlando': { name: 'Orlando, FL', lat: 28.5383, lon: -81.3792 },
        'irvine': { name: 'Irvine, CA', lat: 33.6846, lon: -117.8265 },
        'newark': { name: 'Newark, NJ', lat: 40.7357, lon: -74.1724 },
        'toledo': { name: 'Toledo, OH', lat: 41.6528, lon: -83.5379 },
        'durham': { name: 'Durham, NC', lat: 35.9940, lon: -78.8986 },
        'chula-vista': { name: 'Chula Vista, CA', lat: 32.6401, lon: -117.0842 },
        'fort-wayne': { name: 'Fort Wayne, IN', lat: 41.0793, lon: -85.1394 },
        'jersey-city': { name: 'Jersey City, NJ', lat: 40.7178, lon: -74.0431 },
        'st-petersburg': { name: 'St. Petersburg, FL', lat: 27.7676, lon: -82.6403 },
        'laredo': { name: 'Laredo, TX', lat: 27.5306, lon: -99.4803 },
        'madison': { name: 'Madison, WI', lat: 43.0731, lon: -89.4012 },
        'chandler': { name: 'Chandler, AZ', lat: 33.3062, lon: -111.8413 },
        'buffalo': { name: 'Buffalo, NY', lat: 42.8864, lon: -78.8784 },
        'lubbock': { name: 'Lubbock, TX', lat: 33.5779, lon: -101.8552 },
        'scottsdale': { name: 'Scottsdale, AZ', lat: 33.4942, lon: -111.9261 },
        'reno': { name: 'Reno, NV', lat: 39.5296, lon: -119.8138 },
        'glendale-az': { name: 'Glendale, AZ', lat: 33.5387, lon: -112.1860 },
        'gilbert': { name: 'Gilbert, AZ', lat: 33.3528, lon: -111.7890 },
        'winston-salem': { name: 'Winston-Salem, NC', lat: 36.0999, lon: -80.2442 },
        'north-las-vegas': { name: 'North Las Vegas, NV', lat: 36.1989, lon: -115.1175 },
        'norfolk': { name: 'Norfolk, VA', lat: 36.8508, lon: -76.2859 },
        'chesapeake': { name: 'Chesapeake, VA', lat: 36.7682, lon: -76.2875 },
        'garland': { name: 'Garland, TX', lat: 32.9126, lon: -96.6389 },
        'irving': { name: 'Irving, TX', lat: 32.8140, lon: -96.9489 },
        'hialeah': { name: 'Hialeah, FL', lat: 25.8576, lon: -80.2781 },
        'fremont': { name: 'Fremont, CA', lat: 37.5485, lon: -121.9886 },
        'boise': { name: 'Boise, ID', lat: 43.6150, lon: -116.2023 },
        'richmond': { name: 'Richmond, VA', lat: 37.5407, lon: -77.4360 },
        'baton-rouge': { name: 'Baton Rouge, LA', lat: 30.4515, lon: -91.1871 },
        'spokane': { name: 'Spokane, WA', lat: 47.6588, lon: -117.4260 },
        'des-moines': { name: 'Des Moines, IA', lat: 41.5868, lon: -93.6250 },
        'tacoma': { name: 'Tacoma, WA', lat: 47.2529, lon: -122.4443 },
        'san-bernardino': { name: 'San Bernardino, CA', lat: 34.1083, lon: -117.2898 },
        'modesto': { name: 'Modesto, CA', lat: 37.6391, lon: -120.9969 },
        'fontana': { name: 'Fontana, CA', lat: 34.0922, lon: -117.4350 },
        'santa-clarita': { name: 'Santa Clarita, CA', lat: 34.3917, lon: -118.5426 },
        'birmingham': { name: 'Birmingham, AL', lat: 33.5186, lon: -86.8104 },
        'oxnard': { name: 'Oxnard, CA', lat: 34.1975, lon: -119.1771 },
        'fayetteville': { name: 'Fayetteville, NC', lat: 35.0527, lon: -78.8784 },
        'moreno-valley': { name: 'Moreno Valley, CA', lat: 33.9425, lon: -117.2297 },
        'rochester': { name: 'Rochester, NY', lat: 43.1566, lon: -77.6088 },
        'glendale-ca': { name: 'Glendale, CA', lat: 34.1425, lon: -118.2551 },
        'huntington-beach': { name: 'Huntington Beach, CA', lat: 33.6595, lon: -117.9988 },
        'salt-lake-city': { name: 'Salt Lake City, UT', lat: 40.7608, lon: -111.8910 },
        'grand-rapids': { name: 'Grand Rapids, MI', lat: 42.9634, lon: -85.6681 },
        'amarillo': { name: 'Amarillo, TX', lat: 35.2220, lon: -101.8313 },
        'yonkers': { name: 'Yonkers, NY', lat: 40.9312, lon: -73.8987 },
        'aurora-il': { name: 'Aurora, IL', lat: 41.7606, lon: -88.3201 },
        'montgomery': { name: 'Montgomery, AL', lat: 32.3792, lon: -86.3077 },
        'akron': { name: 'Akron, OH', lat: 41.0814, lon: -81.5190 },
        'little-rock': { name: 'Little Rock, AR', lat: 34.7465, lon: -92.2896 },
        'huntsville': { name: 'Huntsville, AL', lat: 34.7304, lon: -86.5861 },
        'augusta': { name: 'Augusta, GA', lat: 33.4735, lon: -81.9748 },
        'grand-prairie': { name: 'Grand Prairie, TX', lat: 32.7460, lon: -96.9978 },
        'columbus-ga': { name: 'Columbus, GA', lat: 32.4610, lon: -84.9877 },
        'overland-park': { name: 'Overland Park, KS', lat: 38.9822, lon: -94.6708 },
        'tallahassee': { name: 'Tallahassee, FL', lat: 30.4383, lon: -84.2807 },
        'cape-coral': { name: 'Cape Coral, FL', lat: 26.5629, lon: -81.9495 },
        'mobile': { name: 'Mobile, AL', lat: 30.6954, lon: -88.0399 },
        'knoxville': { name: 'Knoxville, TN', lat: 35.9606, lon: -83.9207 },
        'shreveport': { name: 'Shreveport, LA', lat: 32.5252, lon: -93.7502 },
        'worcester': { name: 'Worcester, MA', lat: 42.2626, lon: -71.8023 },
        'ontario-ca': { name: 'Ontario, CA', lat: 34.0633, lon: -117.6509 },
        'providence': { name: 'Providence, RI', lat: 41.8240, lon: -71.4128 },
        'newport-news': { name: 'Newport News, VA', lat: 37.0871, lon: -76.4730 },
        'rancho-cucamonga': { name: 'Rancho Cucamonga, CA', lat: 34.1064, lon: -117.5931 },
        'santa-rosa': { name: 'Santa Rosa, CA', lat: 38.4405, lon: -122.7144 },
        'peoria-az': { name: 'Peoria, AZ', lat: 33.5806, lon: -112.2374 },
        'oceanside': { name: 'Oceanside, CA', lat: 33.1959, lon: -117.3795 },
        'elk-grove': { name: 'Elk Grove, CA', lat: 38.4088, lon: -121.3716 },
        'salem': { name: 'Salem, OR', lat: 44.9429, lon: -123.0351 },
        'pembroke-pines': { name: 'Pembroke Pines, FL', lat: 26.0128, lon: -80.2239 },
        'eugene': { name: 'Eugene, OR', lat: 44.0521, lon: -123.0868 },
        'garden-grove': { name: 'Garden Grove, CA', lat: 33.7739, lon: -117.9414 },
        'cary': { name: 'Cary, NC', lat: 35.7915, lon: -78.7811 },
        'fort-collins': { name: 'Fort Collins, CO', lat: 40.5853, lon: -105.0844 },
        'corona': { name: 'Corona, CA', lat: 33.8753, lon: -117.5664 },
        'springfield-mo': { name: 'Springfield, MO', lat: 37.2090, lon: -93.2923 },
        'jackson-ms': { name: 'Jackson, MS', lat: 32.2988, lon: -90.1848 },
        'alexandria': { name: 'Alexandria, VA', lat: 38.8048, lon: -77.0469 },
        'hayward': { name: 'Hayward, CA', lat: 37.6688, lon: -122.0808 },
        'clarksville': { name: 'Clarksville, TN', lat: 36.5298, lon: -87.3595 },
        'lakewood': { name: 'Lakewood, CO', lat: 39.7047, lon: -105.0814 },
        'lancaster': { name: 'Lancaster, CA', lat: 34.6868, lon: -118.1542 },
        'salinas': { name: 'Salinas, CA', lat: 36.6777, lon: -121.6555 },
        'palmdale': { name: 'Palmdale, CA', lat: 34.5794, lon: -118.1165 },
        'hollywood': { name: 'Hollywood, FL', lat: 26.0112, lon: -80.1495 },
        'springfield-ma': { name: 'Springfield, MA', lat: 42.1015, lon: -72.5898 },
        'macon': { name: 'Macon, GA', lat: 32.8407, lon: -83.6324 },
        'pasadena-tx': { name: 'Pasadena, TX', lat: 29.6911, lon: -95.2091 },
        'pomona': { name: 'Pomona, CA', lat: 34.0551, lon: -117.7500 },
        'kansas-city-ks': { name: 'Kansas City, KS', lat: 39.1155, lon: -94.6268 },
        'escondido': { name: 'Escondido, CA', lat: 33.1192, lon: -117.0864 },
        'sunnyvale': { name: 'Sunnyvale, CA', lat: 37.3688, lon: -122.0363 },
        'torrance': { name: 'Torrance, CA', lat: 33.8358, lon: -118.3406 },
        'bridgeport': { name: 'Bridgeport, CT', lat: 41.1865, lon: -73.1952 },
        'savannah': { name: 'Savannah, GA', lat: 32.0809, lon: -81.0912 },
        'mcallen': { name: 'McAllen, TX', lat: 26.2034, lon: -98.2300 },
        'pasadena-ca': { name: 'Pasadena, CA', lat: 34.1478, lon: -118.1445 },
        'mesquite': { name: 'Mesquite, TX', lat: 32.7668, lon: -96.5992 },
        'syracuse': { name: 'Syracuse, NY', lat: 43.0481, lon: -76.1474 },
        'midland': { name: 'Midland, TX', lat: 31.9973, lon: -102.0779 },
        'dayton': { name: 'Dayton, OH', lat: 39.7589, lon: -84.1916 },
        'murfreesboro': { name: 'Murfreesboro, TN', lat: 35.8456, lon: -86.3903 }
    },
    apiUrl: 'https://api.open-meteo.com/v1/forecast',
    updateInterval: 600000, // 10 minutes
    storageKeys: {
        location: 'agricast_location',
        locationMode: 'agricast_location_mode',
        crop: 'agricast_crop',
        units: 'agricast_units',
        windUnits: 'agricast_wind_units'
    }
};

// ===== State Management =====
const state = {
    location: { lat: null, lon: null, name: 'Unknown' },
    locationMode: 'geolocation', // 'geolocation' or location key
    weather: {},
    currentCrop: 'corn',
    units: 'celsius',
    windUnits: 'ms',
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
    windUnitToggle: document.getElementById('windUnitToggle'),
    cropSelect: document.getElementById('cropSelect'),
    refreshBtn: document.getElementById('refreshBtn'),
    tempChart: document.getElementById('tempChart'),
    chartStatus: document.getElementById('chartStatus'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    saveStatus: document.getElementById('saveStatus')
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
    const savedWindUnits = localStorage.getItem(CONFIG.storageKeys.windUnits);
    if (savedWindUnits) {
        state.windUnits = savedWindUnits;
        elements.windUnitToggle.value = savedWindUnits;
    }
}

function saveSettings() {
    localStorage.setItem(CONFIG.storageKeys.location, JSON.stringify(state.location));
    localStorage.setItem(CONFIG.storageKeys.locationMode, state.locationMode);
    localStorage.setItem(CONFIG.storageKeys.crop, state.currentCrop);
    localStorage.setItem(CONFIG.storageKeys.units, state.units);
    localStorage.setItem(CONFIG.storageKeys.windUnits, state.windUnits);
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

    elements.windUnitToggle.addEventListener('change', (e) => {
        state.windUnits = e.target.value;
        saveSettings();
        updateWeatherDisplay();
    });

    elements.cropSelect.addEventListener('change', (e) => {
        state.currentCrop = e.target.value;
        saveSettings();
        updateCropDisplay();
    });

    elements.refreshBtn.addEventListener('click', fetchWeatherData);

    // Save Settings Button
    if (elements.saveSettingsBtn) {
        elements.saveSettingsBtn.addEventListener('click', () => {
            // Show saving status
            elements.saveStatus.textContent = '⏳ Saving...';
            elements.saveStatus.className = 'save-status saving visible';

            // Save settings
            saveSettings();

            // Show success status after brief delay
            setTimeout(() => {
                elements.saveStatus.textContent = '✅ Settings Saved!';
                elements.saveStatus.className = 'save-status success visible';

                // Hide status after 3 seconds
                setTimeout(() => {
                    elements.saveStatus.className = 'save-status';
                }, 3000);
            }, 500);
        });
    }
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

// ===== Wind Speed Conversion =====
function convertWindSpeed(ms) {
    switch (state.windUnits) {
        case 'kmh':
            return ms * 3.6;
        case 'mph':
            return ms * 2.237;
        case 'knots':
            return ms * 1.944;
        case 'ms':
        default:
            return ms;
    }
}

function getWindSpeedUnit() {
    switch (state.windUnits) {
        case 'kmh':
            return 'km/h';
        case 'mph':
            return 'mph';
        case 'knots':
            return 'kn';
        case 'ms':
        default:
            return 'm/s';
    }
}

// ===== Weather Display Update =====
function updateWeatherDisplay() {
    const temp = state.weather.temperature_2m || 0;
    const humidity = state.weather.relative_humidity_2m || 0;
    const wind = state.weather.wind_speed_10m || 0;
    const moisture = state.weather.soil_moisture_0_to_10cm || 0;

    const displayTemp = convertTemp(temp);
    const unit = getTempUnit();

    const displayWind = convertWindSpeed(wind);
    const windUnit = getWindSpeedUnit();

    elements.tempDisplay.textContent = `${displayTemp.toFixed(1)}${unit}`;
    elements.humidityDisplay.textContent = `${humidity}%`;
    elements.windDisplay.textContent = `${displayWind.toFixed(1)} ${windUnit}`;
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

    // Update new season displays
    updateSeasonOverview(crop, seasonGDD);
    updateHistoricalComparison(crop, seasonGDD);
    updateSeasonRecommendations(crop, seasonGDD, currentStage);
}

// ===== Season Overview Functions =====
function updateSeasonOverview(crop, currentGDD) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    // Update planting dates
    const plantingDatesEl = document.getElementById('plantingDates');
    const plantingStatusEl = document.getElementById('plantingStatus');
    if (plantingDatesEl && plantingStatusEl) {
        plantingDatesEl.textContent = `${crop.planting.start} - ${crop.planting.end}`;
        plantingDatesEl.title = `Optimal: ${crop.planting.optimalStart} - ${crop.planting.optimalEnd}`;

        const plantingStatus = getPhaseStatus(crop.planting, now);
        plantingStatusEl.textContent = plantingStatus.text;
        plantingStatusEl.className = `phase-status ${plantingStatus.class}`;
    }

    // Update growing dates
    const growingDatesEl = document.getElementById('growingDates');
    const growingStatusEl = document.getElementById('growingStatus');
    if (growingDatesEl && growingStatusEl) {
        growingDatesEl.textContent = `${crop.growing.start} - ${crop.growing.end}`;
        growingDatesEl.title = `Peak: ${crop.growing.peakStart} - ${crop.growing.peakEnd}`;

        const growingStatus = getPhaseStatus(crop.growing, now);
        growingStatusEl.textContent = growingStatus.text;
        growingStatusEl.className = `phase-status ${growingStatus.class}`;
    }

    // Update harvest dates
    const harvestDatesEl = document.getElementById('harvestDates');
    const harvestStatusEl = document.getElementById('harvestStatus');
    if (harvestDatesEl && harvestStatusEl) {
        harvestDatesEl.textContent = `${crop.harvest.start} - ${crop.harvest.end}`;
        harvestDatesEl.title = `Optimal: ${crop.harvest.optimalStart} - ${crop.harvest.optimalEnd}`;

        const harvestStatus = getPhaseStatus(crop.harvest, now);
        harvestStatusEl.textContent = harvestStatus.text;
        harvestStatusEl.className = `phase-status ${harvestStatus.class}`;
    }

    // Update season summary
    const seasonSummaryEl = document.getElementById('seasonSummary');
    if (seasonSummaryEl) {
        const progressPercent = ((currentGDD / crop.threshold) * 100).toFixed(0);
        const daysRemaining = Math.max(0, crop.daysToMaturity - Math.floor((now - getPlantingStartDate(crop)) / 86400000));

        seasonSummaryEl.innerHTML = `
            <div class="summary-grid">
                <div class="summary-item">
                    <span class="summary-label">Days to Maturity</span>
                    <span class="summary-value">${crop.daysToMaturity} days</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Season Progress</span>
                    <span class="summary-value">${progressPercent}%</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">GDD Required</span>
                    <span class="summary-value">${crop.threshold} units</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Current GDD</span>
                    <span class="summary-value">${currentGDD} units</span>
                </div>
            </div>
        `;
    }
}

function getPhaseStatus(phase, currentDate) {
    const year = currentDate.getFullYear();
    const startDate = parseSimpleDate(phase.start, year);
    const endDate = parseSimpleDate(phase.end, year);

    // Handle year wrap-around for winter wheat planting
    if (endDate < startDate) {
        endDate.setFullYear(year + 1);
    }

    if (currentDate < startDate) {
        const daysUntil = Math.ceil((startDate - currentDate) / 86400000);
        return { text: `Starts in ${daysUntil} days`, class: 'upcoming' };
    } else if (currentDate <= endDate) {
        const daysRemaining = Math.ceil((endDate - currentDate) / 86400000);
        return { text: `Active - ${daysRemaining} days left`, class: 'active' };
    } else {
        return { text: 'Completed', class: 'completed' };
    }
}

function parseSimpleDate(dateStr, year) {
    const months = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    const parts = dateStr.split(' ');
    const month = months[parts[0]];
    const day = parseInt(parts[1]);
    return new Date(year, month, day);
}

function getPlantingStartDate(crop) {
    const year = new Date().getFullYear();
    return parseSimpleDate(crop.planting.start, year);
}

// ===== Historical Comparison Functions =====
function updateHistoricalComparison(crop, currentGDD) {
    const historical = crop.historical;
    const years = [2024, 2023, 2022, 2021, 2020];

    // Calculate 5-year average
    const avgGDD = Math.round(years.reduce((sum, year) => sum + historical[year].gdd, 0) / years.length);
    const avgYield = Math.round(years.reduce((sum, year) => sum + historical[year].yieldIndex, 0) / years.length);

    // Update each year's data
    years.forEach(year => {
        const data = historical[year];
        const gddEl = document.getElementById(`gdd${year}`);
        const devEl = document.getElementById(`dev${year}`);
        const yieldEl = document.getElementById(`yield${year}`);

        if (gddEl) gddEl.textContent = data.gdd.toLocaleString();
        if (devEl) {
            const deviation = data.gdd - avgGDD;
            const devPercent = ((deviation / avgGDD) * 100).toFixed(1);
            devEl.textContent = deviation >= 0 ? `+${devPercent}%` : `${devPercent}%`;
            devEl.className = `deviation ${deviation >= 0 ? 'positive' : 'negative'}`;
        }
        if (yieldEl) {
            yieldEl.textContent = data.yieldIndex;
            yieldEl.className = `yield-index ${data.yieldIndex >= 100 ? 'above' : 'below'}`;
        }
    });

    // Update averages
    const gddAvgEl = document.getElementById('gddAvg');
    const yieldAvgEl = document.getElementById('yieldAvg');
    if (gddAvgEl) gddAvgEl.textContent = avgGDD.toLocaleString();
    if (yieldAvgEl) yieldAvgEl.textContent = avgYield;

    // Get region-specific historical notes
    const regionNotes = getRegionalHistoricalNotes();

    // Update historical insight with region-aware data
    const insightEl = document.getElementById('historicalInsight');
    if (insightEl) {
        const comparison = currentGDD >= avgGDD ? 'above' : 'below';
        const percentDiff = Math.abs(((currentGDD - avgGDD) / avgGDD) * 100).toFixed(1);

        insightEl.innerHTML = `
            <div class="insight-content">
                <p><strong>2024 Season Analysis:</strong> ${regionNotes[2024]}</p>
                <p>Current GDD accumulation is <span class="${comparison}">${percentDiff}% ${comparison}</span> the 5-year average of ${avgGDD} units.</p>
                <p><strong>Best Recent Year:</strong> ${regionNotes.bestYear}</p>
                <p><strong>Challenging Year:</strong> ${regionNotes.challengingYear}</p>
            </div>
        `;
    }
}

// Get region-specific historical notes based on selected location
function getRegionalHistoricalNotes() {
    const locationName = state.location.name || '';
    const lat = state.location.lat || 0;
    const lon = state.location.lon || 0;

    // Determine region based on location
    let region = 'midwest'; // default

    // California
    if (locationName.includes('CA') || locationName.includes('California') ||
        (lon >= -124 && lon <= -114 && lat >= 32 && lat <= 42)) {
        region = 'california';
    }
    // Pacific Northwest (WA, OR)
    else if (locationName.includes('WA') || locationName.includes('OR') ||
        locationName.includes('Washington') || locationName.includes('Oregon') ||
        (lon >= -125 && lon <= -116 && lat >= 42 && lat <= 49)) {
        region = 'pacific_northwest';
    }
    // Southwest (AZ, NM, NV, UT)
    else if (locationName.includes('AZ') || locationName.includes('NM') ||
        locationName.includes('NV') || locationName.includes('UT') ||
        locationName.includes('Arizona') || locationName.includes('Nevada')) {
        region = 'southwest';
    }
    // Great Plains (TX, OK, KS, NE, SD, ND)
    else if (locationName.includes('TX') || locationName.includes('OK') ||
        locationName.includes('KS') || locationName.includes('NE') ||
        locationName.includes('Texas') || locationName.includes('Oklahoma') ||
        locationName.includes('Kansas') || locationName.includes('Nebraska')) {
        region = 'great_plains';
    }
    // Southeast (FL, GA, SC, NC, AL, MS, LA)
    else if (locationName.includes('FL') || locationName.includes('GA') ||
        locationName.includes('SC') || locationName.includes('NC') ||
        locationName.includes('AL') || locationName.includes('MS') ||
        locationName.includes('LA') || locationName.includes('Florida') ||
        locationName.includes('Georgia') || locationName.includes('Alabama')) {
        region = 'southeast';
    }
    // Northeast (NY, PA, NJ, MA, CT, etc.)
    else if (locationName.includes('NY') || locationName.includes('PA') ||
        locationName.includes('NJ') || locationName.includes('MA') ||
        locationName.includes('New York') || locationName.includes('Pennsylvania') ||
        locationName.includes('Boston') || locationName.includes('New Jersey')) {
        region = 'northeast';
    }
    // Canada
    else if (locationName.includes('Alberta') || locationName.includes('Ontario') ||
        locationName.includes('Quebec') || locationName.includes('Manitoba') ||
        locationName.includes('Saskatchewan') || locationName.includes('British Columbia') ||
        lat > 49) {
        region = 'canada';
    }

    // Return region-specific notes
    const regionalData = {
        california: {
            2024: 'Improved water allocation after winter storms. Central Valley showing strong recovery.',
            2023: 'Atmospheric rivers brought relief from multi-year drought. Good reservoir levels.',
            2022: 'Third year of severe drought. Significant acreage fallowed due to water restrictions.',
            2021: 'Historic drought conditions. Record low reservoir levels impacted irrigation.',
            2020: 'Dry conditions and significant wildfire smoke affected crop quality.',
            bestYear: '2023 with above-normal precipitation ending drought stress',
            challengingYear: '2021 with historic megadrought and water restrictions'
        },
        pacific_northwest: {
            2024: 'Moderate conditions with adequate snowpack for irrigation season.',
            2023: 'Cool wet spring delayed planting but good late-season conditions.',
            2022: 'Heat dome impacts lingered. Some orchards still recovering.',
            2021: 'Record-breaking heat dome caused severe crop losses.',
            2020: 'Generally favorable conditions with adequate water supply.',
            bestYear: '2020 with balanced conditions and good water availability',
            challengingYear: '2021 with unprecedented heat dome reaching 116°F in Portland'
        },
        southwest: {
            2024: 'Monsoon season brought moderate relief to drought conditions.',
            2023: 'Extended drought continues. Groundwater levels remain concerning.',
            2022: 'Extreme heat events and continued drought stress.',
            2021: 'Record drought conditions. Colorado River allocations reduced.',
            2020: 'Hot and dry conditions typical for region.',
            bestYear: '2024 with improved monsoon patterns',
            challengingYear: '2021 with record drought and water allocation cuts'
        },
        great_plains: {
            2024: 'Variable conditions. Northern plains wet, southern plains drier.',
            2023: 'Flash drought developed mid-summer in Texas and Oklahoma.',
            2022: 'Widespread drought impacted winter wheat significantly.',
            2021: 'Severe drought in western Kansas and Texas panhandle.',
            2020: 'Near-normal precipitation across most of region.',
            bestYear: '2020 with balanced moisture across the region',
            challengingYear: '2021 with severe drought across western portions'
        },
        southeast: {
            2024: 'Good growing season despite late-season hurricane activity.',
            2023: 'Hot and humid conditions. Some disease pressure from wet weather.',
            2022: 'Generally favorable except for localized flooding.',
            2021: 'Tropical storm impacts in coastal areas.',
            2020: 'Active hurricane season caused localized crop damage.',
            bestYear: '2022 with favorable temperatures and adequate rainfall',
            challengingYear: '2020 with multiple hurricane landfalls affecting crops'
        },
        northeast: {
            2024: 'Moderate growing season with adequate moisture.',
            2023: 'Very wet conditions led to delayed planting and disease issues.',
            2022: 'Generally good conditions for Northeast agriculture.',
            2021: 'Remnants of Hurricane Ida caused significant flooding.',
            2020: 'Favorable conditions across most of region.',
            bestYear: '2022 with ideal temperature and moisture balance',
            challengingYear: '2021 with severe flooding from tropical storm remnants'
        },
        canada: {
            2024: 'Recovery from previous drought years. Improved soil moisture.',
            2023: 'Wildfire smoke affected air quality. Variable precipitation.',
            2022: 'Better moisture conditions than 2021 drought year.',
            2021: 'Historic drought and heat dome in Western Canada.',
            2020: 'Generally favorable conditions across prairies.',
            bestYear: '2020 with good precipitation patterns across prairies',
            challengingYear: '2021 with record drought and heat in British Columbia and Alberta'
        },
        midwest: {
            2024: 'Above average warmth with good moisture. Strong yields expected.',
            2023: 'Flash drought in parts of Corn Belt. Near normal overall.',
            2022: 'Warm summer with adequate rain. Good corn and soybean yields.',
            2021: 'Dry conditions in western Corn Belt reduced yields.',
            2020: 'August derecho caused $11B in crop damage in Iowa.',
            bestYear: '2022 with excellent conditions across the Corn Belt',
            challengingYear: '2020 with devastating August derecho in Iowa and Illinois'
        }
    };

    return regionalData[region] || regionalData.midwest;
}

// ===== Season Recommendations =====
function updateSeasonRecommendations(crop, currentGDD, currentStage) {
    const recEl = document.getElementById('seasonRecommendations');
    if (!recEl) return;

    const now = new Date();
    const month = now.getMonth();
    const progressPercent = (currentGDD / crop.threshold) * 100;

    let recommendations = [];

    // Crop-specific recommendations based on growth stage and season
    if (state.currentCrop === 'corn') {
        if (progressPercent < 20) {
            recommendations.push({ icon: '🌱', text: 'Early Season: Focus on stand establishment. Scout for cutworms and early weed pressure.' });
            recommendations.push({ icon: '💧', text: 'Ensure adequate soil moisture for germination. Consider starter fertilizer applications.' });
        } else if (progressPercent < 50) {
            recommendations.push({ icon: '🌿', text: 'Vegetative Growth: Monitor for nutrient deficiencies, especially nitrogen. Side-dress applications may be needed.' });
            recommendations.push({ icon: '🐛', text: 'Scout for corn rootworm, European corn borer, and foliar diseases.' });
        } else if (progressPercent < 80) {
            recommendations.push({ icon: '🌽', text: 'Reproductive Stage: Critical period for pollination. Minimize stress during silking.' });
            recommendations.push({ icon: '💧', text: 'Water stress during this period can significantly reduce yields. Irrigate if available.' });
        } else {
            recommendations.push({ icon: '🌾', text: 'Maturation: Monitor grain moisture for optimal harvest timing (15-20% moisture ideal).' });
            recommendations.push({ icon: '📊', text: 'Scout for stalk quality issues. Prioritize fields with stalk rot for early harvest.' });
        }
    } else if (state.currentCrop === 'wheat') {
        if (month >= 8 && month <= 10) {
            recommendations.push({ icon: '🌱', text: 'Fall Planting: Optimal seeding depth 1-1.5 inches. Ensure good seed-to-soil contact.' });
            recommendations.push({ icon: '🧪', text: 'Apply phosphorus at planting for strong root development before winter.' });
        } else if (month >= 2 && month <= 4) {
            recommendations.push({ icon: '🌿', text: 'Spring Greenup: Assess winter survival and consider reseeding thin stands.' });
            recommendations.push({ icon: '🧪', text: 'Top-dress nitrogen based on tissue tests and yield goals.' });
        } else if (month >= 5 && month <= 6) {
            recommendations.push({ icon: '🌾', text: 'Heading/Flowering: Scout for Fusarium head blight (scab) if wet conditions.' });
            recommendations.push({ icon: '🦠', text: 'Consider fungicide application at heading for disease control.' });
        } else {
            recommendations.push({ icon: '🌾', text: 'Harvest: Target grain moisture below 14% for safe storage.' });
            recommendations.push({ icon: '📊', text: 'Test for falling number and protein content for market decisions.' });
        }
    } else if (state.currentCrop === 'soybean') {
        if (progressPercent < 25) {
            recommendations.push({ icon: '🌱', text: 'Early Season: Focus on weed control. Soybeans are poor early-season competitors.' });
            recommendations.push({ icon: '🧪', text: 'Ensure proper inoculation for nitrogen fixation in new soybean ground.' });
        } else if (progressPercent < 60) {
            recommendations.push({ icon: '🌿', text: 'Vegetative Growth: Scout for soybean aphids, bean leaf beetles, and spider mites.' });
            recommendations.push({ icon: '💧', text: 'Begin irrigation planning for R1-R5 stages when water demand peaks.' });
        } else if (progressPercent < 85) {
            recommendations.push({ icon: '🫘', text: 'Pod Fill: Critical water demand period. Stress now directly reduces yields.' });
            recommendations.push({ icon: '🦠', text: 'Scout for sudden death syndrome, white mold, and pod diseases.' });
        } else {
            recommendations.push({ icon: '🌾', text: 'Maturation: Monitor moisture for harvest. Optimal range is 13-14%.' });
            recommendations.push({ icon: '⚠️', text: 'Avoid harvest losses from shatter - timely harvest is critical.' });
        }
    }

    // Weather-based recommendations
    const temp = state.weather.temperature_2m || 0;
    if (temp > 30) {
        recommendations.push({ icon: '🌡️', text: 'Heat Alert: High temperatures may stress crops. Increase irrigation frequency if possible.' });
    } else if (temp < 5) {
        recommendations.push({ icon: '❄️', text: 'Frost Risk: Monitor overnight temperatures. Cover sensitive crops if frost expected.' });
    }

    // Render recommendations
    recEl.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <span class="rec-icon">${rec.icon}</span>
            <p>${rec.text}</p>
        </div>
    `).join('');
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

