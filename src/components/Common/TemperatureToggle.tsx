import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Thermometer } from 'lucide-react';

export const TemperatureToggle: React.FC = () => {
  const { isFahrenheit, setIsFahrenheit } = useWeather();

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-md">
      <Thermometer className="w-5 h-5 text-blue-500" />
      <button
        onClick={() => setIsFahrenheit(false)}
        className={`px-3 py-1 rounded transition-colors ${
          !isFahrenheit ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        °C
      </button>
      <button
        onClick={() => setIsFahrenheit(true)}
        className={`px-3 py-1 rounded transition-colors ${
          isFahrenheit ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        °F
      </button>
    </div>
  );
};

export default TemperatureToggle;
