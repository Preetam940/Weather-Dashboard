import axios from 'axios';

const API_BASE_URL = 'https://api.open-meteo.com/v1';

export interface WeatherData {
  time: string;
  temperature_2m: number;
  temperature_2m_max: number;
  temperature_2m_min: number;
  precipitation: number;
  precipitation_probability_max: number;
  relative_humidity_2m: number;
  windspeed_10m: number;
  windgusts_10m: number;
  visibility: number;
  weather_code: number;
  uv_index: number;
  sunrise: string;
  sunset: string;
}

export interface AirQualityData {
  time: string;
  aqi: number;
  pm10: number;
  pm2_5: number;
  carbon_monoxide: number;
  carbon_dioxide: number;
  nitrogen_dioxide: number;
  sulphur_dioxide: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  name?: string;
  country?: string;
}

const getCurrentWeatherParams = () => {
  const params = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'precipitation',
    'precipitation_probability',
    'weather_code',
    'wind_speed_10m',
    'wind_gusts_10m',
    'uv_index',
    'visibility',
  ];
  return params.join(',');
};

const getHourlyParams = () => {
  const params = [
    'temperature_2m',
    'relative_humidity_2m',
    'precipitation',
    'weather_code',
    'wind_speed_10m',
    'visibility',
  ];
  return params.join(',');
};

const getDailyParams = () => {
  const params = [
    'temperature_2m_max',
    'temperature_2m_min',
    'temperature_2m_mean',
    'weather_code',
    'precipitation_sum',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'wind_direction_10m_dominant',
    'sunrise',
    'sunset',
    'uv_index_max',
  ];
  return params.join(',');
};

export const getWeatherData = async (lat: number, lon: number, timezone: string = 'auto') => {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: getCurrentWeatherParams(),
      hourly: getHourlyParams(),
      daily: getDailyParams(),
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
      precipitation_unit: 'mm',
      timezone,
    });

    const response = await axios.get(`${API_BASE_URL}/forecast?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getAirQualityData = async (lat: number, lon: number, start_date: string, end_date: string) => {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      start_date,
      end_date,
      hourly: 'aqi,pm10,pm2_5,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide',
    });

    const response = await axios.get(`https://air-quality-api.open-meteo.com/v1/air_quality?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    throw error;
  }
};

export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.warn('Geolocation error:', error.message);
        // Fallback to default location (e.g., New York)
        resolve({
          latitude: 40.7128,
          longitude: -74.006,
          name: 'New York',
          country: 'USA',
        });
      }
    );
  });
};

export const getReverseGeocode = async (lat: number, lon: number) => {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      language: 'en',
    });

    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&${params}`);
    return response.data;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
};
