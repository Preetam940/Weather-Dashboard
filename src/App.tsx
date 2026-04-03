import { useState, useEffect } from 'react';
import { Header, Navigation } from './components/Common';
import { CurrentWeatherPage } from './components/CurrentWeather/CurrentWeatherPage';
import { HistoricalAnalysisPage } from './components/HistoricalAnalysis/HistoricalAnalysisPage';
import { WeatherProvider } from './context/WeatherContext';
import { useGeolocation } from './hooks/useWeather';
import { Loader } from 'lucide-react';
import './index.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('current');
  const { location, loading: geoLoading, error: geoError } = useGeolocation();

  useEffect(() => {
    // Performance optimization: mark when page is interactive
    if (location && !geoLoading) {
      window.performance?.mark?.('page-interactive');
    }
  }, [location, geoLoading]);

  if (geoLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-16 h-16 text-white animate-spin" />
          <p className="text-white text-lg">Detecting your location...</p>
        </div>
      </div>
    );
  }

  if (geoError && !location) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">Location Error</h2>
          <p className="text-gray-700">{geoError}</p>
          <p className="text-gray-600 text-sm mt-2">Using default location: New York</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      {location && (
        currentPage === 'current' ? (
          <CurrentWeatherPage latitude={location.latitude} longitude={location.longitude} />
        ) : (
          <HistoricalAnalysisPage latitude={location.latitude} longitude={location.longitude} />
        )
      )}
    </div>
  );
}

function App() {
  return (
    <WeatherProvider>
      <AppContent />
    </WeatherProvider>
  );
}

export default App;
