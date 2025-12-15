# 🌾 AgriCast v2.0

**Precision Farming Weather Intelligence**

AgriCast is a comprehensive web-based precision farming application that provides real-time weather data, drought monitoring, crop management insights, and livestock heat stress tracking. Designed to help farmers and agricultural professionals make data-driven decisions.

---

## ✨ Features

### 📊 Overview Dashboard
- **Real-time Weather Stats**: Temperature, humidity, wind speed, and soil moisture at a glance
- **24-Hour Forecast Chart**: Interactive SVG visualization of upcoming temperature trends

### 📅 Forecast Tab
- **7-Day Forecast**: Daily weather conditions for the upcoming week
- **14-Day Forecast**: Extended outlook for planning purposes
- **Extended Outlooks**: 6-10 day, 8-14 day, and 3-4 week weather predictions
- **Agricultural Implications**: AI-generated recommendations based on forecast data

### 🌍 Drought Monitor
- **Drought Status**: Current drought conditions for your location
- **Drought Indices**:
  - SPI (Standardized Precipitation Index) - 12-month
  - PDSI (Palmer Drought Severity Index)
- **Severity Levels**: Visual indicator of drought severity from "No Drought" to "Critical"
- **Drought Forecast**: Predictive outlook for upcoming drought conditions
- **Impact Recommendations**: Tailored advice for irrigation, crop management, livestock, and soil health

### 🌱 Crops Tab
- **Growing Degree Days (GDD)**: Track daily and seasonal heat units
- **Growth Stage Tracking**: Monitor crop development progress
- **Season Progress**: Visual progress bar showing growing season status
- **Growing & Harvesting Timeline**:
  - Planting window dates and status
  - Growing season overview
  - Harvest window predictions
- **Historical Comparison**: Compare current year GDD with previous 5 years
- **Season Recommendations**: Actionable insights based on current conditions

### 🐄 Livestock Tab
- **Temperature-Humidity Index (THI)**: Real-time livestock heat stress monitoring
- **THI Scale**:
  - Safe (<74)
  - Alert (74-78)
  - Danger (79-83)
  - Critical (>83)
- **Heat Stress Recommendations**: Management advice based on current THI levels

### ⚙️ Settings
- **Location Selection**: 150+ North American cities across Canada and the USA
- **Geolocation Support**: Auto-detect your location
- **Temperature Units**: Celsius or Fahrenheit
- **Wind Speed Units**: m/s, km/h, mph, or knots
- **Crop Monitoring**: Choose between Corn, Wheat, or Soybean profiles

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection for weather data fetching

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/AgriCast.git
   cd AgriCast
   ```

2. **Open the application**
   
   Simply open `index.html` in your web browser:
   ```bash
   # On Windows
   start index.html
   
   # On macOS
   open index.html
   
   # On Linux
   xdg-open index.html
   ```

3. **Allow location access** (optional)
   
   For the best experience, allow the browser to access your location when prompted, or select a city manually in Settings.

---

## 📁 Project Structure

```
AgriCast/
├── index.html          # Main HTML structure
├── style.css           # All styling and responsive design
├── script.js           # Application logic and API integrations
└── README.md           # Project documentation
```

---

## 🔧 Technologies Used

- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern styling with flexbox, grid, and CSS variables
- **Vanilla JavaScript**: No framework dependencies
- **Open-Meteo API**: Weather data provider
- **Geolocation API**: Browser-based location detection

---

## 🌎 Supported Locations

### Canada
- All major cities across provinces and territories
- Including: Vancouver, Calgary, Edmonton, Winnipeg, Toronto, Ottawa, Montreal, Halifax, and more

### United States
- Top 100+ cities across all regions
- Comprehensive coverage from coast to coast

---

## 📱 Responsive Design

AgriCast is fully responsive and works seamlessly on:
- 📱 Mobile phones
- 📲 Tablets
- 💻 Laptops
- 🖥️ Desktop monitors

---

## 🔮 Future Enhancements

- [ ] Push notifications for severe weather alerts
- [ ] Custom crop profile creation
- [ ] Multi-location monitoring
- [ ] Data export functionality
- [ ] Irrigation scheduling integration
- [ ] Satellite imagery overlays
- [ ] Pest and disease risk forecasting

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍🌾 Acknowledgments

- Weather data powered by [Open-Meteo](https://open-meteo.com/)
- Drought indices based on NOAA methodologies
- GDD calculations following agricultural standards

---

<p align="center">
  Made with ❤️ for farmers and agricultural professionals
</p>
