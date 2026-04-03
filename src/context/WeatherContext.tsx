import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { LocationData } from '../services/weatherService';

interface WeatherContextType {
  location: LocationData | null;
  setLocation: (location: LocationData) => void;
  isFahrenheit: boolean;
  setIsFahrenheit: (value: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <WeatherContext.Provider
      value={{
        location,
        setLocation,
        isFahrenheit,
        setIsFahrenheit,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
