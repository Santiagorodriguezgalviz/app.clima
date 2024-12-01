import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Droplets, Wind, Sun, Thermometer, Compass, Share2 } from 'lucide-react';
import { useSpring, animated } from 'react-spring';
import { Tilt } from 'react-tilt';
import { toast } from 'sonner';
import { useWeatherStore } from '../store/weatherStore';
import { WeatherData } from '../types/weather';
import { getWeatherIcon, getWeatherDescription } from '../services/weatherApi';
import { useTranslation } from 'react-i18next';
import { WeatherEffects } from './WeatherEffects';
import { ShareModal } from './ShareModal';
import Confetti from 'react-confetti';

interface WeatherCardProps {
  data: WeatherData;
}

const defaultTiltOptions = {
  reverse: false,
  max: 10,
  perspective: 1000,
  scale: 1,
  speed: 1000,
  transition: true,
  axis: null,
  reset: true,
  easing: "cubic-bezier(.03,.98,.52,.99)",
};

export const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const { preferences, toggleFavorite } = useWeatherStore();
  const { t } = useTranslation();
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const isFavorite = preferences.favorites.includes(data.location.name);

  const temp = preferences.tempUnit === 'C' ? data.current.temp : (data.current.temp * 9/5) + 32;
  const feelsLike = preferences.tempUnit === 'C' ? data.current.feelsLike : (data.current.feelsLike * 9/5) + 32;
  const isNight = new Date().getHours() > 18 || new Date().getHours() < 6;

  const tempSpring = useSpring({
    number: Math.round(temp),
    from: { number: 0 },
    config: { tension: 100, friction: 10 },
  });

  const handleFavoriteClick = () => {
    toggleFavorite(data.location.name);
    if (!isFavorite) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success(t('alerts.addedToFavorites'));
    } else {
      toast.success(t('alerts.removedFromFavorites'));
    }
  };

  const weatherStats = [
    {
      icon: <Thermometer className="w-5 h-5 text-orange-500" />,
      label: t('weather.feelsLike'),
      value: `${Math.round(feelsLike)}°${preferences.tempUnit}`,
      color: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
    },
    {
      icon: <Droplets className="w-5 h-5 text-blue-500" />,
      label: t('weather.humidity'),
      value: `${data.current.humidity}%`,
      color: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
    },
    {
      icon: <Wind className="w-5 h-5 text-teal-500" />,
      label: t('weather.wind'),
      value: `${Math.round(data.current.windSpeed)} km/h`,
      color: 'from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20',
    },
    {
      icon: <Sun className="w-5 h-5 text-purple-500" />,
      label: t('weather.uv'),
      value: data.current.uv,
      color: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
    },
    {
      icon: <Compass className="w-5 h-5 text-indigo-500" />,
      label: t('weather.pressure'),
      value: `${Math.round(data.current.pressure)} hPa`,
      color: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20',
    },
  ];

  return (
    <>
      <Tilt options={defaultTiltOptions}>
        <motion.div
          className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg p-6 w-full transform transition-all duration-300 overflow-hidden"
        >
          {showConfetti && <Confetti numberOfPieces={100} recycle={false} />}
          <WeatherEffects weatherCode={data.current.weatherCode} />
          
          <div className="relative z-20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <motion.h2 
                  className="text-3xl font-bold text-gray-800 dark:text-white"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {data.location.name}
                </motion.h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">{data.location.country}</p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsShareModalOpen(true)}
                  className="p-2 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Share2 className="w-7 h-7" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleFavoriteClick}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  <Star className="w-7 h-7" fill={isFavorite ? 'currentColor' : 'none'} />
                </motion.button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <motion.img
                  src={getWeatherIcon(data.current.weatherCode, isNight)}
                  alt={getWeatherDescription(data.current.weatherCode)}
                  className="w-24 h-24 drop-shadow-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                />
                <div className="ml-4">
                  <div className="text-6xl font-bold text-gray-800 dark:text-white flex items-baseline">
                    <animated.span>
                      {tempSpring.number.to((n) => Math.floor(n))}
                    </animated.span>
                    <span className="text-4xl">°{preferences.tempUnit}</span>
                  </div>
                  <motion.p 
                    className="text-xl text-gray-600 dark:text-gray-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {getWeatherDescription(data.current.weatherCode)}
                  </motion.p>
                </div>
              </div>
            </div>

            <motion.div 
              className="grid grid-cols-2 md:grid-cols-5 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AnimatePresence>
                {weatherStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl transform transition-all duration-300 hover:shadow-lg relative z-20`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {stat.icon}
                      <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                    </div>
                    <p className="text-xl font-semibold text-gray-800 dark:text-white">
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </Tilt>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        weatherData={data}
        unit={preferences.tempUnit}
      />
    </>
  );
};