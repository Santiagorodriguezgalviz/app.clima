import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent"
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1],
          borderWidth: ["4px", "2px", "4px"]
        }}
        transition={{ 
          rotate: { duration: 1, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity },
          borderWidth: { duration: 2, repeat: Infinity }
        }}
      />
      <motion.p
        className="text-gray-600 dark:text-gray-300 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Cargando datos del clima...
      </motion.p>
    </div>
  );
};