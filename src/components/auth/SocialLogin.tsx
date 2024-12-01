import React from 'react';
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';

interface SocialLoginProps {
  onGoogleLogin: () => void;
  isDark: boolean;
}

export const SocialLogin: React.FC<SocialLoginProps> = ({
  onGoogleLogin,
  isDark,
}) => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className={`w-full border-t ${isDark ? 'border-gray-600/30' : 'border-gray-300/50'}`}></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className={`px-6 py-2 rounded-full ${
              isDark 
                ? 'bg-gray-800/50 text-gray-300' 
                : 'bg-white/30 text-gray-600'
            } backdrop-blur-md text-base font-medium`}
          >
            O continúa con
          </motion.span>
        </div>
      </div>

      <div className="mt-6">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGoogleLogin}
          className={`
            w-full flex items-center justify-center gap-3 px-6 py-3 
            rounded-xl text-sm font-medium transition-all duration-200
            bg-white hover:bg-gray-50 text-gray-700
            shadow-md hover:shadow-lg
            border border-gray-200
            backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/50
          `}
        >
          <div className="flex items-center gap-3">
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span className="font-medium">
              Continuar con Google
            </span>
          </div>
        </motion.button>
      </div>
    </div>
  );
};