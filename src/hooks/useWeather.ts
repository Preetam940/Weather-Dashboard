import { useState, useEffect } from 'react';
import { getWeatherData, getAirQualityData, getCurrentLocation } from '../services/weatherService';

export const useWeatherData = (latitude: number | null, longitude: number | null) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude === null || longitude === null) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const weatherData = await getWeatherData(latitude, longitude);
        setData(weatherData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [latitude, longitude]);

  return { data, loading, error };
};

export const useAirQualityData = (latitude: number | null, longitude: number | null, startDate: string, endDate: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude === null || longitude === null) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const aqData = await getAirQualityData(latitude, longitude, startDate, endDate);
        setData(aqData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch air quality data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [latitude, longitude, startDate, endDate]);

  return { data, loading, error };
};

export const useGeolocation = () => {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const loc = await getCurrentLocation();
        setLocation(loc);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get location');
        // Set fallback location
        setLocation({ latitude: 40.7128, longitude: -74.006 });
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return { location, loading, error };
};
