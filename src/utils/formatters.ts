import { format, parse } from 'date-fns';

export const convertToFahrenheit = (celsius: number): number => {
  return (celsius * 9/5) + 32;
};

export const formatTemperature = (celsius: number, isFahrenheit: boolean = false): string => {
  const temp = isFahrenheit ? convertToFahrenheit(celsius) : celsius;
  return `${temp.toFixed(1)}°${isFahrenheit ? 'F' : 'C'}`;
};

export const formatTime = (dateString: string, format_str: string = 'HH:mm'): string => {
  try {
    const date = parse(dateString, 'yyyy-MM-dd\'T\'HH:mm', new Date());
    return format(date, format_str);
  } catch (error) {
    return dateString;
  }
};

export const formatDate = (dateString: string, format_str: string = 'MMM dd, yyyy'): string => {
  try {
    const date = new Date(dateString);
    return format(date, format_str);
  } catch (error) {
    return dateString;
  }
};

export const getWeatherDescription = (weatherCode: number): string => {
  const codes: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light rain',
    53: 'Moderate rain',
    55: 'Heavy rain',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return codes[weatherCode] || 'Unknown';
};

export const getWindDirection = (degrees: number): string => {
  if (degrees >= 348.75 || degrees < 11.25) return 'N';
  if (degrees >= 11.25 && degrees < 33.75) return 'NNE';
  if (degrees >= 33.75 && degrees < 56.25) return 'NE';
  if (degrees >= 56.25 && degrees < 78.75) return 'ENE';
  if (degrees >= 78.75 && degrees < 101.25) return 'E';
  if (degrees >= 101.25 && degrees < 123.75) return 'ESE';
  if (degrees >= 123.75 && degrees < 146.25) return 'SE';
  if (degrees >= 146.25 && degrees < 168.75) return 'SSE';
  if (degrees >= 168.75 && degrees < 191.25) return 'S';
  if (degrees >= 191.25 && degrees < 213.75) return 'SSW';
  if (degrees >= 213.75 && degrees < 236.25) return 'SW';
  if (degrees >= 236.25 && degrees < 258.75) return 'WSW';
  if (degrees >= 258.75 && degrees < 281.25) return 'W';
  if (degrees >= 281.25 && degrees < 303.75) return 'WNW';
  if (degrees >= 303.75 && degrees < 326.25) return 'NW';
  return 'NNW';
};

export const getAQILevel = (aqi: number): string => {
  if (aqi <= 35) return 'Good';
  if (aqi <= 75) return 'Fair';
  if (aqi <= 115) return 'Moderate';
  if (aqi <= 150) return 'Poor';
  return 'Very Poor';
};

export const getAQIColor = (aqi: number): string => {
  if (aqi <= 35) return 'bg-green-500';
  if (aqi <= 75) return 'bg-yellow-500';
  if (aqi <= 115) return 'bg-orange-500';
  if (aqi <= 150) return 'bg-red-500';
  return 'bg-purple-700';
};

export const roundToTwoDecimals = (value: number): number => {
  return Math.round(value * 100) / 100;
};

export const isValidDate = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  } catch {
    return false;
  }
};

export const getDateRange = (days: number): { start: string; end: string } => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};
