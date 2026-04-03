import React, { useState, useMemo } from 'react';
import { Sunrise, Sunset } from 'lucide-react';
import { DatePicker, LoadingSpinner, TemperatureToggle } from '../Common';
import { HourlyChart } from '../Charts';
import { useWeatherData, useAirQualityData } from '../../hooks/useWeather';
import { useWeather } from '../../context/WeatherContext';
import { formatTemperature, formatTime, getWeatherDescription } from '../../utils/formatters';
import { format } from 'date-fns';

interface CurrentWeatherPageProps {
  latitude: number | null;
  longitude: number | null;
}

export const CurrentWeatherPage: React.FC<CurrentWeatherPageProps> = ({ latitude, longitude }) => {
  const { isFahrenheit } = useWeather();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { data: weatherData, loading: weatherLoading, error: weatherError } = useWeatherData(
    latitude,
    longitude
  );
  const { data: aqData } = useAirQualityData(
    latitude,
    longitude,
    selectedDate,
    selectedDate
  );

  const currentData = useMemo(() => {
    if (!weatherData?.current) return null;
    return weatherData.current;
  }, [weatherData]);

  const hourlyData = useMemo(() => {
    if (!weatherData?.hourly) return [];
    const times = weatherData.hourly.time || [];
    const temps = weatherData.hourly.temperature_2m || [];
    const humidity = weatherData.hourly.relative_humidity_2m || [];
    const precipitation = weatherData.hourly.precipitation || [];
    const visibility = weatherData.hourly.visibility || [];
    const wind = weatherData.hourly.wind_speed_10m || [];

    return times.map((time: string, idx: number) => ({
      time: formatTime(time, 'HH:mm'),
      temperature: temps[idx] || 0,
      humidity: humidity[idx] || 0,
      precipitation: precipitation[idx] || 0,
      visibility: visibility[idx] || 0,
      wind: wind[idx] || 0,
    }));
  }, [weatherData]);

  const dailyData = useMemo(() => {
    if (!weatherData?.daily) return null;
    const dayIdx = weatherData.daily.time.findIndex((date: string) => date === selectedDate);
    if (dayIdx === -1) return null;

    return {
      tempMax: weatherData.daily.temperature_2m_max[dayIdx],
      tempMin: weatherData.daily.temperature_2m_min[dayIdx],
      tempMean: weatherData.daily.temperature_2m_mean[dayIdx],
      sunrise: weatherData.daily.sunrise[dayIdx],
      sunset: weatherData.daily.sunset[dayIdx],
      uvIndex: weatherData.daily.uv_index_max[dayIdx],
      precipitationSum: weatherData.daily.precipitation_sum[dayIdx],
      precipitation_prob: weatherData.daily.precipitation_probability_max[dayIdx],
    };
  }, [weatherData, selectedDate]);

  const airQuality = useMemo(() => {
    if (!aqData?.hourly) return null;
    // Get average values for the day
    const aqi = aqData.hourly.aqi || [];
    const pm10 = aqData.hourly.pm10 || [];
    const pm25 = aqData.hourly.pm2_5 || [];
    const co = aqData.hourly.carbon_monoxide || [];
    const co2 = aqData.hourly.carbon_dioxide || [];
    const no2 = aqData.hourly.nitrogen_dioxide || [];
    const so2 = aqData.hourly.sulphur_dioxide || [];

    return {
      aqi: aqi.length > 0 ? Math.round(aqi.reduce((a: number, b: number) => a + b, 0) / aqi.length) : 0,
      pm10: pm10.length > 0 ? (pm10.reduce((a: number, b: number) => a + b, 0) / pm10.length).toFixed(1) : 0,
      pm25: pm25.length > 0 ? (pm25.reduce((a: number, b: number) => a + b, 0) / pm25.length).toFixed(1) : 0,
      co: co.length > 0 ? (co.reduce((a: number, b: number) => a + b, 0) / co.length).toFixed(1) : 0,
      co2: co2.length > 0 ? (co2.reduce((a: number, b: number) => a + b, 0) / co2.length).toFixed(0) : 0,
      no2: no2.length > 0 ? (no2.reduce((a: number, b: number) => a + b, 0) / no2.length).toFixed(1) : 0,
      so2: so2.length > 0 ? (so2.reduce((a: number, b: number) => a + b, 0) / so2.length).toFixed(1) : 0,
    };
  }, [aqData]);

  return (
    <LoadingSpinner isLoading={weatherLoading} error={weatherError}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Date and Temperature Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            maxDate={format(new Date(), 'yyyy-MM-dd')}
            minDate="2020-01-01"
          />
          <TemperatureToggle />
        </div>

        {/* Current Weather Summary */}
        {currentData && dailyData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <h2 className="text-sm font-semibold opacity-90 mb-2">Current Temperature</h2>
              <p className="text-4xl font-bold">{formatTemperature(currentData.temperature_2m, isFahrenheit)}</p>
              <p className="text-sm opacity-90 mt-2">{getWeatherDescription(currentData.weather_code)}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <h2 className="text-sm font-semibold opacity-90 mb-2">Daily Temperature</h2>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs opacity-90">High: {formatTemperature(dailyData.tempMax, isFahrenheit)}</p>
                  <p className="text-xs opacity-90 mt-1">Low: {formatTemperature(dailyData.tempMin, isFahrenheit)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
              <h2 className="text-sm font-semibold opacity-90 mb-2">Sun Cycle</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sunrise className="w-4 h-4" />
                  <span className="text-sm">{formatTime(dailyData.sunrise, 'HH:mm')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sunset className="w-4 h-4" />
                  <span className="text-sm">{formatTime(dailyData.sunset, 'HH:mm')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weather Variables Grid */}
        {currentData && dailyData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm mb-2">Humidity</p>
              <p className="text-2xl font-bold text-blue-500">{currentData.relative_humidity_2m}%</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm mb-2">Wind Speed</p>
              <p className="text-2xl font-bold text-green-500">{currentData.wind_speed_10m.toFixed(1)} km/h</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm mb-2">Visibility</p>
              <p className="text-2xl font-bold text-purple-500">{(currentData.visibility / 1000).toFixed(1)} km</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm mb-2">UV Index</p>
              <p className="text-2xl font-bold text-yellow-500">{dailyData.uvIndex.toFixed(1)}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm mb-2">Precipitation</p>
              <p className="text-2xl font-bold text-cyan-500">{dailyData.precipitationSum.toFixed(1)} mm</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm mb-2">Precip. Probability</p>
              <p className="text-2xl font-bold text-teal-500">{dailyData.precipitation_prob}%</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm mb-2">Wind Gust</p>
              <p className="text-2xl font-bold text-indigo-500">{currentData.wind_gusts_10m.toFixed(1)} km/h</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm mb-2">Apparent Temp</p>
              <p className="text-2xl font-bold text-pink-500">{formatTemperature(currentData.apparent_temperature, isFahrenheit)}</p>
            </div>
          </div>
        )}

        {/* Air Quality Section */}
        {airQuality && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Air Quality Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
                <p className="text-gray-600 text-sm mb-2">AQI</p>
                <p className="text-2xl font-bold text-green-600">{airQuality.aqi}</p>
              </div>

              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
                <p className="text-gray-600 text-sm mb-2">PM10</p>
                <p className="text-2xl font-bold text-blue-600">{airQuality.pm10}</p>
              </div>

              <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded">
                <p className="text-gray-600 text-sm mb-2">PM2.5</p>
                <p className="text-2xl font-bold text-purple-600">{airQuality.pm25}</p>
              </div>

              <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
                <p className="text-gray-600 text-sm mb-2">CO</p>
                <p className="text-2xl font-bold text-red-600">{airQuality.co}</p>
              </div>

              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                <p className="text-gray-600 text-sm mb-2">CO2</p>
                <p className="text-2xl font-bold text-yellow-600">{airQuality.co2}</p>
              </div>

              <div className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded">
                <p className="text-gray-600 text-sm mb-2">NO2</p>
                <p className="text-2xl font-bold text-orange-600">{airQuality.no2}</p>
              </div>

              <div className="p-4 border-l-4 border-pink-500 bg-pink-50 rounded">
                <p className="text-gray-600 text-sm mb-2">SO2</p>
                <p className="text-2xl font-bold text-pink-600">{airQuality.so2}</p>
              </div>
            </div>
          </div>
        )}

        {/* Hourly Charts */}
        {hourlyData.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Hourly Forecast</h2>

            <HourlyChart
              data={hourlyData}
              title="Temperature Trend"
              yAxisLabel="Temperature (°C)"
              lines={[{ key: 'temperature', name: 'Temperature', stroke: '#0066cc' }]}
            />

            <HourlyChart
              data={hourlyData}
              title="Humidity Levels"
              yAxisLabel="Humidity (%)"
              lines={[{ key: 'humidity', name: 'Humidity', stroke: '#00aa44' }]}
            />

            <HourlyChart
              data={hourlyData}
              title="Precipitation"
              yAxisLabel="Precipitation (mm)"
              bars={[{ key: 'precipitation', name: 'Precipitation', fill: '#0066cc' }]}
            />

            <HourlyChart
              data={hourlyData}
              title="Visibility"
              yAxisLabel="Visibility (m)"
              lines={[{ key: 'visibility', name: 'Visibility', stroke: '#8b5cf6' }]}
            />

            <HourlyChart
              data={hourlyData}
              title="Wind Speed"
              yAxisLabel="Wind Speed (km/h)"
              lines={[{ key: 'wind', name: 'Wind Speed', stroke: '#f59e0b' }]}
            />
          </div>
        )}
      </div>
    </LoadingSpinner>
  );
};

export default CurrentWeatherPage;
