import React, { useState, useMemo } from 'react';
import { DatePicker, LoadingSpinner, TemperatureToggle } from '../Common';
import { DailyChart } from '../Charts';
import { useWeatherData } from '../../hooks/useWeather';
import { useWeather } from '../../context/WeatherContext';
import { formatTemperature, formatDate, formatTime, getWindDirection } from '../../utils/formatters';
import { format, subDays, isAfter } from 'date-fns';

interface HistoricalAnalysisPageProps {
  latitude: number | null;
  longitude: number | null;
}

export const HistoricalAnalysisPage: React.FC<HistoricalAnalysisPageProps> = ({
  latitude,
  longitude,
}) => {
  const { isFahrenheit } = useWeather();
  const today = format(new Date(), 'yyyy-MM-dd');
  const twoYearsAgo = format(subDays(new Date(), 730), 'yyyy-MM-dd');

  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(today);

  const { data: weatherData, loading: weatherLoading, error: weatherError } = useWeatherData(
    latitude,
    longitude
  );

  const historicalData = useMemo(() => {
    if (!weatherData?.daily) return [];

    const times = weatherData.daily.time || [];
    const tempMax = weatherData.daily.temperature_2m_max || [];
    const tempMin = weatherData.daily.temperature_2m_min || [];
    const tempMean = weatherData.daily.temperature_2m_mean || [];
    const sunrise = weatherData.daily.sunrise || [];
    const sunset = weatherData.daily.sunset || [];
    const precipSum = weatherData.daily.precipitation_sum || [];
    const windSpeed = weatherData.daily.wind_speed_10m_max || [];
    const windDir = weatherData.daily.wind_direction_10m_dominant || [];
    const pm10 = weatherData.daily.precipitation_sum || [];
    const pm25 = weatherData.daily.precipitation_sum || [];

    return times
      .map((date: string, idx: number) => {
        // Filter by date range
        if (isAfter(new Date(date), new Date(endDate)) || isAfter(new Date(startDate), new Date(date))) {
          return null;
        }

        return {
          date: formatDate(date, 'MMM dd'),
          fullDate: date,
          tempMax: tempMax[idx] || 0,
          tempMin: tempMin[idx] || 0,
          tempMean: tempMean[idx] || 0,
          sunrise: formatTime(sunrise[idx], 'HH:mm'),
          sunset: formatTime(sunset[idx], 'HH:mm'),
          precipitation: precipSum[idx] || 0,
          windSpeed: windSpeed[idx] || 0,
          windDirection: getWindDirection(windDir[idx] || 0),
          pm10: pm10[idx] || 0,
          pm25: pm25[idx] || 0,
        };
      })
      .filter(Boolean);
  }, [weatherData, startDate, endDate]);

  return (
    <LoadingSpinner isLoading={weatherLoading} error={weatherError}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Date Range Selection */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              maxDate={today}
              minDate={twoYearsAgo}
              placeholder="Start date"
            />
            <span className="self-center text-gray-600">to</span>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              maxDate={today}
              minDate={twoYearsAgo}
              placeholder="End date"
            />
          </div>
          <TemperatureToggle />
        </div>

        {/* Date Range Summary */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <p className="text-gray-700">
            <span className="font-semibold">Showing data from</span> {startDate}{' '}
            <span className="font-semibold">to</span> {endDate} ({historicalData.length} days)
          </p>
        </div>

        {/* Summary Statistics */}
        {historicalData.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg shadow p-4 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm mb-1">Avg High Temp</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatTemperature(
                  historicalData.reduce((sum: number, d: any) => sum + d.tempMax, 0) / historicalData.length,
                  isFahrenheit
                )}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg shadow p-4 border-l-4 border-purple-500">
              <p className="text-gray-600 text-sm mb-1">Avg Low Temp</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatTemperature(
                  historicalData.reduce((sum: number, d: any) => sum + d.tempMin, 0) / historicalData.length,
                  isFahrenheit
                )}
              </p>
            </div>

            <div className="bg-cyan-50 rounded-lg shadow p-4 border-l-4 border-cyan-500">
              <p className="text-gray-600 text-sm mb-1">Total Precipitation</p>
              <p className="text-2xl font-bold text-cyan-600">
                {historicalData.reduce((sum: number, d: any) => sum + d.precipitation, 0).toFixed(1)} mm
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg shadow p-4 border-l-4 border-orange-500">
              <p className="text-gray-600 text-sm mb-1">Avg Wind Speed</p>
              <p className="text-2xl font-bold text-orange-600">
                {(historicalData.reduce((sum: number, d: any) => sum + d.windSpeed, 0) / historicalData.length).toFixed(1)} km/h
              </p>
            </div>
          </div>
        )}

        {/* Historical Charts */}
        {historicalData.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Historical Trends</h2>

            <DailyChart
              data={historicalData}
              title="Temperature Trends"
              yAxisLabel="Temperature (°C)"
              chartType="line"
              dataKey={['tempMax', 'tempMean', 'tempMin']}
              colors={['#ef4444', '#f59e0b', '#3b82f6']}
            />

            <DailyChart
              data={historicalData}
              title="Daily Precipitation"
              yAxisLabel="Precipitation (mm)"
              chartType="bar"
              dataKey="precipitation"
              colors={['#0066cc']}
            />

            <DailyChart
              data={historicalData}
              title="Wind Speed Pattern"
              yAxisLabel="Wind Speed (km/h)"
              chartType="line"
              dataKey="windSpeed"
              colors={['#f59e0b']}
            />

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Sun Cycle Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Sunrise</th>
                      <th className="px-4 py-2 text-left">Sunset</th>
                      <th className="px-4 py-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalData.slice(0, 15).map((day: any, idx: number) => {
                      const sunrise = new Date(`${day.fullDate}T${day.sunrise}`);
                      const sunset = new Date(`${day.fullDate}T${day.sunset}`);
                      const duration = Math.round((sunset.getTime() - sunrise.getTime()) / (1000 * 60 * 60 * 100)) / 100;
                      return (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2">{day.date}</td>
                          <td className="px-4 py-2">{day.sunrise}</td>
                          <td className="px-4 py-2">{day.sunset}</td>
                          <td className="px-4 py-2">{duration}h</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </LoadingSpinner>
  );
};

export default HistoricalAnalysisPage;
