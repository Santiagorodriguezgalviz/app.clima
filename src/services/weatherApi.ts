import axios from 'axios';
import { WeatherData, GeocodingResult } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

const weatherCodeToDescription: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
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

export const getWeatherIcon = (code: number, isNight: boolean = false): string => {
  // Using weatherapi.com icons for better visuals
  const iconCode = getWeatherApiCode(code, isNight);
  return `https://cdn.weatherapi.com/weather/128x128/${isNight ? 'night' : 'day'}/${iconCode}.png`;
};

const getWeatherApiCode = (code: number, isNight: boolean): number => {
  const codeMap: Record<number, number> = {
    0: isNight ? 113 : 113, // Clear
    1: isNight ? 116 : 116, // Partly cloudy
    2: 119, // Cloudy
    3: 122, // Overcast
    45: 143, // Mist
    48: 248, // Fog
    51: 263, // Light drizzle
    53: 266, // Moderate drizzle
    55: 281, // Heavy drizzle
    61: 296, // Light rain
    63: 302, // Moderate rain
    65: 308, // Heavy rain
    71: 323, // Light snow
    73: 326, // Moderate snow
    75: 338, // Heavy snow
    77: 350, // Snow grains
    80: 353, // Light rain shower
    81: 356, // Moderate rain shower
    82: 359, // Heavy rain shower
    85: 368, // Light snow shower
    86: 371, // Heavy snow shower
    95: 386, // Thunderstorm
    96: 392, // Thunderstorm with light hail
    99: 395, // Thunderstorm with heavy hail
  };
  
  return codeMap[code] || 113;
};

export const getWeatherDescription = (code: number): string => {
  return weatherCodeToDescription[code] || 'Unknown';
};

export const geocodeLocation = async (query: string): Promise<GeocodingResult> => {
  const response = await axios.get(GEOCODING_URL, {
    params: {
      name: query,
      count: 1,
      language: 'en',
      format: 'json',
    },
  });

  if (!response.data.results?.[0]) {
    throw new Error('Location not found');
  }

  const result = response.data.results[0];
  return {
    name: result.name,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  };
};

export const fetchWeather = async (location: string): Promise<WeatherData> => {
  let lat: number, lon: number, locationName: string, country: string;
  
  if (location.includes(',')) {
    const [latStr, lonStr] = location.split(',');
    lat = parseFloat(latStr);
    lon = parseFloat(lonStr);
    const reverseGeocode = await axios.get(GEOCODING_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        language: 'en',
      },
    });
    const result = reverseGeocode.data.results?.[0];
    locationName = result?.name || 'Unknown location';
    country = result?.country || '';
  } else {
    const geocoded = await geocodeLocation(location);
    lat = geocoded.latitude;
    lon = geocoded.longitude;
    locationName = geocoded.name;
    country = geocoded.country;
  }

  const response = await axios.get(WEATHER_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      hourly: 'temperature_2m,weathercode',
      daily: 'weathercode,temperature_2m_max,temperature_2m_min',
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,uv_index',
      timezone: 'auto',
    },
  });

  const { current, hourly, daily } = response.data;

  return {
    location: {
      name: locationName,
      country: country,
      lat,
      lon,
    },
    current: {
      temp: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      weatherCode: current.weather_code,
      pressure: current.surface_pressure,
      feelsLike: current.apparent_temperature,
      uv: current.uv_index,
    },
    forecast: {
      daily: daily.time.map((date: string, i: number) => ({
        date,
        tempMax: daily.temperature_2m_max[i],
        tempMin: daily.temperature_2m_min[i],
        weatherCode: daily.weathercode[i],
      })),
      hourly: hourly.time.map((time: string, i: number) => ({
        time,
        temp: hourly.temperature_2m[i],
        weatherCode: hourly.weathercode[i],
      })),
    },
  };
};