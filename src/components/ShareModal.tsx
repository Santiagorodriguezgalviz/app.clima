import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Twitter, Facebook, MessageCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { WeatherData } from '../types/weather';
import { useTranslation } from 'react-i18next';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherData: WeatherData;
  unit: 'C' | 'F';
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, weatherData, unit }) => {
  const { t } = useTranslation();

  const shareText = `${t('share.currentWeather')} ${weatherData.location.name}: ${Math.round(weatherData.current.temp)}°${unit} - ${weatherData.location.country}`;
  const shareUrl = window.location.href;

  const shareOptions = [
    {
      name: 'Copy',
      icon: Copy,
      color: 'bg-gray-500 hover:bg-gray-600',
      action: async () => {
        try {
          await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
          toast.success(t('share.copied'));
          onClose();
        } catch (error) {
          toast.error(t('alerts.shareError'));
        }
      }
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-400 hover:bg-blue-500',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        toast.success(t('alerts.shareSuccess'));
        onClose();
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        toast.success(t('alerts.shareSuccess'));
        onClose();
      }
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`, '_blank');
        toast.success(t('alerts.shareSuccess'));
        onClose();
      }
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {t('share.title')}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {shareOptions.map((option) => (
                <motion.button
                  key={option.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={option.action}
                  className={`${option.color} text-white p-4 rounded-xl flex flex-col items-center gap-2 transition-colors shadow-lg`}
                >
                  <option.icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{option.name}</span>
                </motion.button>
              ))}
            </div>

            {navigator.share && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  try {
                    await navigator.share({
                      title: t('share.currentWeather'),
                      text: shareText,
                      url: shareUrl
                    });
                    toast.success(t('alerts.shareSuccess'));
                    onClose();
                  } catch (error) {
                    if (error instanceof Error && error.name !== 'AbortError') {
                      toast.error(t('alerts.shareError'));
                    }
                  }
                }}
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <Share2 className="w-5 h-5" />
                <span>{t('share.native')}</span>
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};