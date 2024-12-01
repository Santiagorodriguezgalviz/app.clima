import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWeatherStore } from '../store/weatherStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onLocationRequest: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationRequest }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { searchHistory } = useWeatherStore();
  const { t } = useTranslation();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const handleLocationClick = () => {
    setShowSuggestions(false);
    onLocationRequest();
  };

  const filteredHistory = searchHistory.filter(location =>
    location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <motion.input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className="w-full px-4 py-3 pl-12 pr-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-800 dark:text-white placeholder-gray-500 shadow-lg transition-all duration-300 hover:bg-white/30"
          placeholder={t('app.search.placeholder')}
          whileFocus={{ scale: 1.02 }}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <motion.button
          type="button"
          onClick={handleLocationClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
          title={t('app.search.useLocation')}
        >
          <MapPin className="w-5 h-5" />
        </motion.button>
      </form>

      <AnimatePresence>
        {showSuggestions && filteredHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 max-h-60 overflow-y-auto z-50"
          >
            {filteredHistory.map((location, index) => (
              <motion.button
                key={location}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  onSearch(location);
                  setQuery('');
                  setShowSuggestions(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors text-gray-800 dark:text-white"
              >
                <History className="w-4 h-4 text-gray-400" />
                {location}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};