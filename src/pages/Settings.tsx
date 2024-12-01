import React from 'react';
import { Moon, Sun, Thermometer, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeatherStore } from '../store/weatherStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';

const languageOptions = [
  { 
    code: 'es', 
    name: 'Español',
    flag: 'https://flagcdn.com/w40/es.png'
  },
  { 
    code: 'en', 
    name: 'English',
    flag: 'https://flagcdn.com/w40/gb.png'
  }
];

export const Settings: React.FC = () => {
  const { preferences, setTheme, setTempUnit, setLanguage } = useWeatherStore();
  const { setUser } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success(t('settings.logout.success'));
      navigate('/login');
    } catch (error) {
      toast.error(t('settings.logout.error'));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg p-8">
        <motion.h1 
          className="text-3xl font-bold text-gray-800 dark:text-white mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {t('settings.title')}
        </motion.h1>
        
        <div className="space-y-8">
          {/* Theme Toggle */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {t('settings.theme.title')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('settings.theme.description')}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(preferences.theme === 'dark' ? 'light' : 'dark')}
                className={`p-4 rounded-xl transition-all duration-300 ${
                  preferences.theme === 'dark'
                    ? 'bg-gray-700 text-yellow-500'
                    : 'bg-blue-50 text-blue-500'
                }`}
              >
                {preferences.theme === 'dark' ? (
                  <Sun className="w-6 h-6" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Temperature Unit Toggle */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {t('settings.temperature.title')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('settings.temperature.description')}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTempUnit(preferences.tempUnit === 'C' ? 'F' : 'C')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Thermometer className="w-5 h-5" />
                <span className="text-lg font-semibold">{preferences.tempUnit}°</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Language Selection */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {t('settings.language.title')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {languageOptions.map((lang) => (
                <motion.button
                  key={lang.code}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                    preferences.language === lang.code
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <img
                    src={lang.flag}
                    alt={lang.name}
                    className="w-8 h-auto rounded shadow-sm"
                  />
                  <span className="font-medium">{lang.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Favorites List */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {t('settings.favorites.title')}
            </h2>
            <AnimatePresence>
              {preferences.favorites.length > 0 ? (
                <div className="grid gap-3">
                  {preferences.favorites.map((location, index) => (
                    <motion.div
                      key={location}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-xl text-gray-800 dark:text-white flex items-center justify-between shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {location}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-600 dark:text-gray-400 italic"
                >
                  {t('settings.favorites.empty')}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Logout Button */}
          <motion.div
            className="pt-8 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#EF4444' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t('settings.logout.button')}</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};