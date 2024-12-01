import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from '../components/SearchBar';
import { WeatherCard } from '../components/WeatherCard';
import { WeatherForecast } from '../components/WeatherForecast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useWeatherStore } from '../store/weatherStore';
import { WeatherData } from '../types/weather';
import { fetchWeather } from '../services/weatherApi';
import { getCityImage } from '../services/unsplashApi';

export const Home: React.FC = () => {
  const [location, setLocation] = React.useState<string>('Bogotá');
  const { addToHistory } = useWeatherStore();
  const { t } = useTranslation();
  const [cityImage, setCityImage] = React.useState<string>('');
  const [isImageLoading, setIsImageLoading] = React.useState(true);

  const { data, isLoading, error, refetch } = useQuery<WeatherData>({
    queryKey: ['weather', location],
    queryFn: () => fetchWeather(location),
    enabled: !!location,
    staleTime: 300000,
    retry: 2,
  });

  React.useEffect(() => {
    if (data?.location.name) {
      setIsImageLoading(true);
      getCityImage(data.location.name).then((url) => {
        setCityImage(url);
      });
    }
  }, [data?.location.name]);

  React.useEffect(() => {
    if (location) {
      refetch();
    }
  }, []);

  const handleSearch = (query: string) => {
    setLocation(query);
    addToHistory(query);
  };

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude},${position.coords.longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <SearchBar onSearch={handleSearch} onLocationRequest={handleLocationRequest} />
      
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex justify-center p-8"
          >
            <LoadingSpinner />
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg"
          >
            {t('errors.loading')}
          </motion.div>
        )}

        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-4xl space-y-6"
          >
            <motion.div
              className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {cityImage && (
                <motion.div
                  className="absolute inset-0 bg-center bg-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 10, ease: "linear" }}
                  style={{
                    backgroundImage: `url(${cityImage})`,
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-6 text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {data.location.name}
                </h1>
                <p className="text-xl md:text-2xl text-gray-200">
                  {data.location.country}
                </p>
              </motion.div>
            </motion.div>
            
            <WeatherCard data={data} />
            <WeatherForecast data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};