import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings as SettingsIcon } from 'lucide-react';

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
           Climatic
          </Link>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`p-2 rounded-lg transition-colors ${
                location.pathname === '/'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Home className="w-5 h-5" />
            </Link>
            <Link
              to="/settings"
              className={`p-2 rounded-lg transition-colors ${
                location.pathname === '/settings'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <SettingsIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};