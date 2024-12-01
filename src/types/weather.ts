export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    pressure: number;
    feelsLike: number;
    uv: number;
  };
  forecast: {
    daily: Array<{
      date: string;
      tempMax: number;
      tempMin: number;
      weatherCode: number;
    }>;
    hourly: Array<{
      time: string;
      temp: number;
      weatherCode: number;
    }>;
  };
}

export interface UserPreferences {
  tempUnit: 'C' | 'F';
  theme: 'light' | 'dark';
  language: string;
  favorites: string[];
}

export interface GeocodingResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}