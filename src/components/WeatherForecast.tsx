import React from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { WeatherData } from '../types/weather';
import { getWeatherIcon, getWeatherDescription } from '../services/weatherApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeatherForecastProps {
  data: WeatherData;
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ data }) => {
  const { t } = useTranslation();
  const [view, setView] = React.useState<'hourly' | 'daily'>('hourly');
  const [selectedDay, setSelectedDay] = React.useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (selectedDay < data.forecast.daily.length - 1) {
        setSelectedDay(prev => prev + 1);
      }
    },
    onSwipedRight: () => {
      if (selectedDay > 0) {
        setSelectedDay(prev => prev - 1);
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const hourlyData = {
    labels: data.forecast.hourly
      .slice(0, 24)
      .map(h => format(new Date(h.time), 'HH:mm')),
    datasets: [
      {
        label: t('weather.temperature'),
        data: data.forecast.hourly.slice(0, 24).map(h => h.temp),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y}°C`;
          }
        }
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: function(value: any) {
            return `${value}°`;
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 1000,
    },
  };

  return (
    <div className="mt-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
          {t('weather.forecast')}
        </h3>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('hourly')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              view === 'hourly'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('weather.hourly')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('daily')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              view === 'daily'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('weather.daily')}
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'hourly' ? (
          <motion.div
            key="hourly"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-64"
          >
            <Line data={hourlyData} options={chartOptions} />
          </motion.div>
        ) : (
          <motion.div
            key="daily"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
            {...handlers}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
              {data.forecast.daily.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: selectedDay === index ? 1.05 : 1,
                  }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.3
                  }}
                  onClick={() => setSelectedDay(index)}
                  className={`flex flex-col items-center p-4 rounded-xl shadow-lg transition-all duration-300 cursor-pointer
                    ${selectedDay === index 
                      ? 'bg-gradient-to-br from-blue-500/90 to-blue-600/90 dark:from-blue-600/90 dark:to-blue-700/90 text-white transform scale-105' 
                      : 'bg-gradient-to-br from-blue-50/90 to-blue-100/90 dark:from-gray-700/90 dark:to-gray-600/90 hover:shadow-xl hover:-translate-y-1'
                    }`}
                >
                  <span className="text-sm font-medium capitalize mb-2">
                    {format(new Date(day.date), 'EEE d', { locale: es })}
                  </span>
                  <motion.div 
                    className="relative w-16 h-16 my-2"
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.img
                      src={getWeatherIcon(day.weatherCode)}
                      alt={getWeatherDescription(day.weatherCode)}
                      className="w-full h-full object-contain drop-shadow-lg"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      loading="lazy"
                    />
                  </motion.div>
                  <div className="flex flex-col items-center mt-2">
                    <span className="text-lg font-bold">
                      {Math.round(day.tempMax)}°
                    </span>
                    <span className="text-sm opacity-75">
                      {Math.round(day.tempMin)}°
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};