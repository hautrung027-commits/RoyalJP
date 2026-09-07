import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LuxuryIntro } from './components/LuxuryIntro';
import { CarDetailModal } from './components/CarDetailModal';
import { GalleryViewerModal } from './components/GalleryViewerModal';
import { Toast } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { CarsPage } from './pages/CarsPage';
import { ServicesPage } from './pages/ServicesPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPortal } from './pages/admin/AdminPortal';
import { Car, UserProfile } from './types';
import { GalleryImage, SHOWROOM_GALLERY } from './data/gallery';

export type PageId = 'home' | 'cars' | 'services' | 'account';

// Helper to check if current route points to admin
const checkIsAdminRoute = () => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    hash === '#admin' ||
    hash === '#/admin' ||
    hash.startsWith('#/admin')
  );
};

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => checkIsAdminRoute());
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedCarForModal, setSelectedCarForModal] = useState<Car | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<GalleryImage | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Luxury Intro state: shown when customers access the site
  const [showIntro, setShowIntro] = useState<boolean>(true);

  const handleDismissIntro = () => {
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Authentication State synchronized across the website
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('luxe_auth_status') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('luxe_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const handleLoginSuccess = (user: UserProfile) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    localStorage.setItem('luxe_auth_status', 'true');
    localStorage.setItem('luxe_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.setItem('luxe_auth_status', 'false');
    localStorage.removeItem('luxe_current_user');
    showToast('Đã đăng xuất khỏi tài khoản.');
  };

  const handleUpdateUser = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('luxe_current_user', JSON.stringify(user));
  };

  // Initialize and synchronize with URL Hash & Path for natural web page & admin navigation
  useEffect(() => {
    const handleRouteChange = () => {
      const isAdm = checkIsAdminRoute();
      setIsAdminRoute(isAdm);

      if (!isAdm) {
        const hash = window.location.hash.replace('#', '') as PageId;
        const validPages: PageId[] = ['home', 'cars', 'services', 'account'];
        if (validPages.includes(hash)) {
          setCurrentPage(hash);
        }
      }
    };

    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const handleExitAdmin = () => {
    setIsAdminRoute(false);
    try {
      window.history.pushState(null, '', '/');
    } catch {}
    window.location.hash = 'home';
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to custom event for switching images inside GalleryViewerModal
  useEffect(() => {
    const handleSelectImageEvent = (e: any) => {
      if (e.detail) {
        setSelectedGalleryImage(e.detail);
      }
    };
    window.addEventListener('select-gallery-image', handleSelectImageEvent);
    return () => window.removeEventListener('select-gallery-image', handleSelectImageEvent);
  }, []);

  const handleNavigate = (pageId: string) => {
    const validPages: PageId[] = ['home', 'cars', 'services', 'account'];
    const target = validPages.includes(pageId as PageId) ? (pageId as PageId) : 'home';
    setCurrentPage(target);
    window.location.hash = target;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 5000);
  };

  // If in Admin mode, render the Admin Portal exclusively
  if (isAdminRoute) {
    return <AdminPortal onBackToWebsite={handleExitAdmin} />;
  }

  return (
    <div
      className="min-h-screen bg-[#F7F5F0] text-[#1B2025] font-sans antialiased selection:bg-[#C8A96B] selection:text-white flex flex-col justify-between"
      style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F7F5F0 100%)' }}
    >
      {/* Luxury Cinematic Intro Screen */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <LuxuryIntro
            onComplete={handleDismissIntro}
          />
        )}
      </AnimatePresence>

      {/* Main Showroom Experience with Smooth Entrance Transition */}
      <motion.div
        className="flex-1 flex flex-col justify-between w-full"
        initial={{ opacity: 0, scale: 1.02, filter: 'blur(6px)' }}
        animate={!showIntro ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 1.02, filter: 'blur(6px)' }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top Sticky Navigation Bar */}
        <Navbar
          activePage={currentPage}
          onNavigate={handleNavigate}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onReplayIntro={handleReplayIntro}
        />

        {/* Main Page Dynamic Content */}
        <main className="flex-1 w-full">
          {currentPage === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              onSelectCar={(car) => setSelectedCarForModal(car)}
              onSelectGalleryImage={(img) => setSelectedGalleryImage(img)}
            />
          )}

          {currentPage === 'cars' && (
            <CarsPage
              onNavigate={handleNavigate}
              onSelectCar={(car) => setSelectedCarForModal(car)}
              onConsultCar={(car) => setSelectedCarForModal(car)}
            />
          )}

          {currentPage === 'services' && (
            <ServicesPage
              onNavigate={handleNavigate}
              onShowToast={showToast}
            />
          )}

          {currentPage === 'account' && (
            <AccountPage
              onNavigate={handleNavigate}
              onSelectCar={(car) => setSelectedCarForModal(car)}
              onShowToast={showToast}
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
              onLoginSuccess={handleLoginSuccess}
              onLogout={handleLogout}
              onUpdateUser={handleUpdateUser}
            />
          )}
        </main>

        {/* Showroom Footer */}
        <Footer
          onNavigate={handleNavigate}
          onReplayIntro={handleReplayIntro}
        />
      </motion.div>

      {/* Modal 1: Car Specifications & Bespoke Config */}
      <CarDetailModal
        car={selectedCarForModal}
        onClose={() => setSelectedCarForModal(null)}
        onRequestQuote={(car) => {
          showToast(`Đã gửi yêu cầu báo giá mẫu xe ${car.name}. Chuyên viên tư vấn VIP sẽ liên hệ lại với quý khách trong ít phút.`);
        }}
      />

      {/* Modal 2: High-Resolution Photo Gallery Lightbox */}
      <GalleryViewerModal
        image={selectedGalleryImage}
        allImages={SHOWROOM_GALLERY}
        onClose={() => setSelectedGalleryImage(null)}
        onConsultation={(carName) => {
          setSelectedGalleryImage(null);
          showToast(`Đã lưu yêu cầu tư vấn mẫu xe ${carName || 'VIP'}. Chuyên viên sẽ hỗ trợ quý khách ngay qua hotline 090 888 8999.`);
        }}
        onNavigateToCollection={() => {
          setSelectedGalleryImage(null);
          handleNavigate('cars');
        }}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
