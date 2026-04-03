import React from 'react';
import { Cloud, MapPin } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export const Header: React.FC = () => {
  const { location } = useWeather();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Cloud className="w-8 h-8 md:w-10 md:h-10" />
            <h1 className="text-2xl md:text-4xl font-bold">Weather Dashboard</h1>
          </div>
          {location && (
            <div className="flex items-center gap-2 text-sm md:text-base">
              <MapPin className="w-4 h-4 md:w-5 md:h-5" />
              <span>{location.name || `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
