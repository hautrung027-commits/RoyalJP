import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Shield, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { LanguageSwitcher } from './LanguageSwitcher';
import { RoyalJpLogo } from './RoyalJpLogo';

interface NavbarProps {
  activePage: string;
  onNavigate: (pageId: string) => void;
  isLoggedIn?: boolean;
  currentUser?: UserProfile | null;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  isLoggedIn = false,
  currentUser = null,
  onReplayIntro,
}) => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'cars', label: t('nav.cars') },
    { id: 'services', label: t('nav.services') },
    { id: 'account', label: isLoggedIn ? (t('nav.myAccount') || 'Tài khoản') : (t('nav.login') || 'Đăng nhập / Đăng ký') }
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="navbar-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 shadow-[0_4px_24px_rgba(23,33,43,0.06)]'
          : 'bg-white/90'
      } backdrop-blur-[16px] border-b border-[#E2E5E8]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo */}
          <button
            id="nav-logo-button"
            onClick={() => handleItemClick('home')}
            className="group text-left cursor-pointer focus:outline-none"
            aria-label="royalJPcar Home"
          >
            <RoyalJpLogo variant="navbar" />
          </button>

          {/* Desktop Navigation */}
          <nav id="desktop-navigation" className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  className={`relative px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#C8A96B]'
                      : 'text-[#1B2025] hover:text-[#C8A96B]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C8A96B]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons with Language Switcher */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Mobile Actions: Language Switcher + Hamburger */}
          <div className="lg:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-sm text-[#17212B] hover:text-[#C8A96B] focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white/98 border-t border-[#E2E5E8] px-4 pt-3 pb-6 shadow-xl"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  className={`text-left px-4 py-3 rounded text-sm font-medium transition-colors ${
                    activePage === item.id
                      ? 'bg-[#F7F5F0] text-[#C8A96B] font-semibold'
                      : 'text-[#1B2025] hover:text-[#C8A96B] hover:bg-[#F1F2F3]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 border-t border-[#E2E5E8] flex flex-col gap-3">
                {/* Language selection in mobile drawer */}
                <LanguageSwitcher variant="mobile" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
