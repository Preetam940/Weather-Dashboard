# Weather Dashboard

A responsive, real-time weather application built with React and Vite that integrates with the Open-Meteo API to provide comprehensive weather insights.

## 🌟 Features

### Current Weather & Hourly Forecast (Page 1)

- **Real-time weather data** with automatic location detection via browser GPS
- **Current weather display** including:
  - Temperature (with °C/°F toggle)
  - Humidity, wind speed, visibility, UV index
  - Sunrise/Sunset times
  - Weather description

- **Individual weather variables** displayed as metric cards:
  - Temperature (min/max/current)
  - Precipitation and probability
  - Wind speed and gusts
  - Air quality metrics (AQI, PM10, PM2.5, CO, CO2, NO2, SO2)

- **Interactive hourly charts** for selected date:
  - Temperature trends
  - Humidity levels
  - Precipitation
  - Visibility
  - Wind speed
  - PM10 & PM2.5 combined

- **Date picker** to view historical data for any past date

### Historical Date Range Analysis (Page 2)

- **2-year date range selection** for long-term trend analysis
- **Historical charts** including:
  - Temperature trends (max/min/mean)
  - Precipitation totals
  - Wind speed patterns
  - Sun cycle (sunrise/sunset times)
  - Air quality trends

- **Summary statistics** for selected period
- **Interactive data table** for sun cycle details

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite (for optimized 500ms load time)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **State Management**: React Context API & Hooks

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Installation & Setup

1. **Clone or extract the repository**

   ```bash
   cd "Weather dashboard"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🌍 API Integration

### Open-Meteo API

- **Free weather data** without authentication
- **Current weather** with hourly forecasts
- **Air quality data** from the Air Quality API
- **Automatic geolocation** fallback to New York if GPS unavailable

**Endpoints used:**

- `https://api.open-meteo.com/v1/forecast` - Weather data
- `https://air-quality-api.open-meteo.com/v1/air_quality` - Air quality data

## 📱 Responsive Design

- **Mobile-first approach** with Tailwind CSS
- **Responsive breakpoints** (sm, md, lg, xl)
- **Touch-friendly interfaces**
- **Horizontal scrolling** for dense datasets
- **Zoom functionality** via Recharts interactive features

## ⚡ Performance Optimization

- **Vite-based build** for fast development and production builds
- **Code splitting** and lazy loading
- **Optimized re-renders** with React.useMemo
- **Efficient data caching** with custom hooks
- **Target: <500ms** initial load and render time

## 📁 Project Structure

```
src/
├── components/
│   ├── Common/           # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── DatePicker.tsx
│   │   ├── TemperatureToggle.tsx
│   │   └── LoadingSpinner.tsx
│   ├── CurrentWeather/   # Current weather page
│   │   └── CurrentWeatherPage.tsx
│   ├── HistoricalAnalysis/  # Historical trends page
│   │   └── HistoricalAnalysisPage.tsx
│   └── Charts/          # Chart components
│       ├── HourlyChart.tsx
│       └── DailyChart.tsx
├── context/
│   └── WeatherContext.tsx   # Global state management
├── hooks/
│   └── useWeather.ts    # Custom hooks for data fetching
├── services/
│   └── weatherService.ts    # API service layer
├── utils/
│   └── formatters.ts    # Utility functions
├── pages/               # Page components
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles

public/
└── index.html          # HTML template
```

## 🎨 Features Details

### Temperature Toggle

- Switch between Celsius and Fahrenheit
- Applied globally across all displays
- Persistent component in header

### Date Selection

- Calendar-based date picker
- Navigate through months
- Maximum 2-year historical data

### Air Quality Indicators

- 7 different pollutant metrics
- Color-coded severity levels
- Daily average calculations

### Interactive Charts

- **Zoom functionality** (pinch on mobile, scroll on desktop)
- **Horizontal scrolling** for extended periods
- **Tooltip hover** for detailed values
- **Legend toggle** to show/hide data series
- **Responsive sizing** for all screen sizes

## 🔧 Customization

### Change Default Location

Edit `src/services/weatherService.ts`:

```typescript
resolve({
  latitude: 40.7128, // Change to desired latitude
  longitude: -74.006, // Change to desired longitude
  name: "New York", // Change to desired city name
  country: "USA",
});
```

### Modify Temperature Unit

The app uses Celsius by default. Toggle in the UI or modify the API header in `weatherService.ts`.

### Add More Air Quality Metrics

Extend the `AirQualityData` interface and update API parameters in `weatherService.ts`.

## 📊 Data Processing

- **Hourly data**: Real-time 7-day forecast with hourly intervals
- **Daily data**: 16-day forecast with daily aggregations
- **Air Quality**: Hourly averages for selected date range
- **Timezone handling**: Automatic detection or manual override

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deploy the dist/ folder
```

### GitHub Pages

```bash
npm run build
# Push dist folder to gh-pages branch
```

### Traditional Server

```bash
npm run build
# Upload dist/ folder to your server
```

## ✅ Testing Checklist

- [ ] Location permission dialog appears on first load
- [ ] Falls back to default location if permission denied
- [ ] Current weather page loads within 500ms
- [ ] Temperature toggle works correctly
- [ ] Date picker selects past dates
- [ ] All charts render without errors
- [ ] Hourly forecasts display 24 hours
- [ ] Air quality data shows for selected date
- [ ] Historical analysis shows 2-year range
- [ ] Mobile layout is fully responsive
- [ ] Chart zoom and scroll work on mobile
- [ ] No console errors

## 🐛 Known Limitations

- Air quality data availability varies by location
- Historical data limited to available API history
- Zoom levels depend on data volume
- Some older browsers may not support geolocation

## 📝 Notes

- The app uses browser geolocation API for automatic location detection
- Fallback location is set to New York if geolocation is unavailable
- All styling is responsive and mobile-first
- Chart rendering uses Recharts for interactive features

