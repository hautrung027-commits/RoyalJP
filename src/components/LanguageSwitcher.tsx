import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { LanguageCode, changeLanguage } from '../i18n';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'header' | 'mobile';
}

interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'ja', label: '日本語', nativeLabel: 'Japanese', flag: '🇯🇵' },
  { code: 'vi', label: 'Tiếng Việt', nativeLabel: 'Vietnamese', flag: '🇻🇳' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language === 'vi' ? 'vi' : 'ja') as LanguageCode;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: LanguageCode) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'mobile') {
    return (
      <div className={`w-full py-2 ${className}`}>
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#69727C] mb-2 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-[#C8A96B]" />
          <span>Ngôn ngữ / 言語選択</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-sm border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#17212B] text-white border-[#C8A96B] shadow-xs'
                    : 'bg-white text-[#17212B] border-[#E2E5E8] hover:border-[#C8A96B]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#C8A96B]" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        id="language-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#FAF8F5] hover:bg-white border border-[#E2E5E8] hover:border-[#C8A96B] text-[#17212B] transition-all cursor-pointer shadow-2xs group focus:outline-none focus:ring-1 focus:ring-[#C8A96B]"
      >
        <span className="text-sm select-none">{currentOption.flag}</span>
        <span className="text-xs font-semibold tracking-wide text-[#17212B] group-hover:text-[#C8A96B] transition-colors">
          {currentOption.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#69727C] group-hover:text-[#17212B] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#C8A96B]' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-1.5 w-44 rounded-md bg-white border border-[#E2E5E8] shadow-xl z-50 py-1.5 overflow-hidden ring-1 ring-black/5"
          >
            <div className="px-3 py-1.5 border-b border-[#F1F2F3] text-[9px] uppercase tracking-widest text-[#8C95A0] font-bold">
              Language / 言語
            </div>
            {LANGUAGES.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#FAF8F5] text-[#17212B] font-bold'
                      : 'text-[#69727C] hover:bg-[#F7F5F0] hover:text-[#17212B]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <div>
                      <div className="leading-tight text-xs text-[#17212B] font-medium">
                        {lang.label}
                      </div>
                      <div className="text-[10px] text-[#8C95A0]">
                        {lang.nativeLabel}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#C8A96B]" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
