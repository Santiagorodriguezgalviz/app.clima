import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPreferences } from '../types/weather';

interface WeatherStore {
  preferences: UserPreferences;
  setTempUnit: (unit: 'C' | 'F') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: string) => void;
  toggleFavorite: (location: string) => void;
  searchHistory: string[];
  addToHistory: (location: string) => void;
}

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set) => ({
      preferences: {
        tempUnit: 'C',
        theme: 'light',
        language: 'en',
        favorites: [],
      },
      searchHistory: [],
      setTempUnit: (unit) =>
        set((state) => ({
          preferences: { ...state.preferences, tempUnit: unit },
        })),
      setTheme: (theme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme: theme },
        })),
      setLanguage: (lang) =>
        set((state) => ({
          preferences: { ...state.preferences, language: lang },
        })),
      toggleFavorite: (location) =>
        set((state) => {
          const favorites = state.preferences.favorites.includes(location)
            ? state.preferences.favorites.filter((fav) => fav !== location)
            : [...state.preferences.favorites, location];
          return {
            preferences: { ...state.preferences, favorites },
          };
        }),
      addToHistory: (location) =>
        set((state) => ({
          searchHistory: [
            location,
            ...state.searchHistory.filter((loc) => loc !== location),
          ].slice(0, 10),
        })),
    }),
    {
      name: 'weather-storage',
    }
  )
);