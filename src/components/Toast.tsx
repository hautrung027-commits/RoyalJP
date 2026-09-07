import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 max-w-md bg-white border border-[#C8A96B] rounded-xl shadow-[0_12px_36px_rgba(23,33,43,0.14)] p-4 flex items-start gap-3 text-xs sm:text-sm text-[#17212B]"
        >
          <div className="w-6 h-6 rounded-full bg-[#F7F5F0] border border-[#C8A96B] flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-[#C8A96B]" />
          </div>

          <div className="flex-1 pr-2">
            <span className="font-serif font-bold text-[#17212B] block text-xs uppercase tracking-wider mb-0.5">
              Thông Báo Showroom
            </span>
            <p className="text-[#69727C] leading-relaxed">{message}</p>
          </div>

          <button
            onClick={onClose}
            className="text-[#69727C] hover:text-[#17212B] transition-colors p-1 cursor-pointer"
            aria-label="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
