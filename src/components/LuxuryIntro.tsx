import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import heroCarImg from '../assets/images/hero_luxury_car_1788423241155.jpg';
import { RoyalJpLogo } from './RoyalJpLogo';

interface LuxuryIntroProps {
  onComplete: () => void;
}

interface IntroCar {
  id: string;
  brand: string;
  name: string;
  specs: string;
  image: string;
}

// 3 High-End Supercar Images from the Project (Slow, Cinematic Presentation)
const INTRO_CARS: IntroCar[] = [
  {
    id: 'car-01',
    brand: 'AURUM BESPOKE',
    name: 'GT-650 EXECUTIVE COUPÉ',
    specs: '650 HP • 0-100 km/h 3.2s',
    image: heroCarImg,
  },
  {
    id: 'car-02',
    brand: 'MERCEDES-MAYBACH',
    name: 'S680 FIRST CLASS',
    specs: 'V12 TWIN-TURBO • 621 HP',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'car-03',
    brand: 'PORSCHE',
    name: 'PANAMERA TURBO E-HYBRID',
    specs: '680 HP • 315 km/h',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop',
  },
];

export const LuxuryIntro: React.FC<LuxuryIntroProps> = ({ onComplete }) => {
  const { i18n } = useTranslation();
  const isJa = i18n.language === 'ja';
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // 0 to 2 for cars, 3 for final brand reveal
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const safeComplete = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    onComplete();
  };

  // Preload car images to guarantee instant 60 FPS montage
  useEffect(() => {
    let isCancelled = false;
    const preloadPromises = INTRO_CARS.map((car) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = car.image;
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });

    const maxWaitTimeout = new Promise<void>((resolve) => setTimeout(resolve, 500));

    Promise.race([Promise.all(preloadPromises), maxWaitTimeout]).then(() => {
      if (!isCancelled) {
        setIsPreloaded(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Cinematic Timeline Orchestration: Total ~8.8s (Slow, calm, luxury presentation)
  // 3 curated cars, each displayed gracefully for 2.4s without rushing
  // 0.0s → Car 01: Aurum GT-650 Executive Coupé (2.4s)
  // 2.4s → Car 02: Mercedes-Maybach S680 First Class (2.4s)
  // 4.8s → Car 03: Porsche Panamera Turbo E-Hybrid (2.4s)
  // 7.2s → Brand Finale: Monogram L & Luxe Showroom seal (1.6s)
  // 8.8s → Smooth cinematic transition to Homepage
  useEffect(() => {
    if (!isPreloaded) return;

    const startTime = performance.now();
    const TOTAL_MS = 8800;

    const interval = window.setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, (elapsed / TOTAL_MS) * 100);
      setProgress(pct);

      if (elapsed < 2400) {
        setCurrentIndex(0);
      } else if (elapsed < 4800) {
        setCurrentIndex(1);
      } else if (elapsed < 7200) {
        setCurrentIndex(2);
      } else if (elapsed < 8800) {
        setCurrentIndex(3); // Brand Finale
      } else {
        safeComplete();
      }
    }, 16);

    timerRef.current = interval;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        safeComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPreloaded]);

  const activeCar = currentIndex < INTRO_CARS.length ? INTRO_CARS[currentIndex] : null;

  return (
    <motion.div
      id="luxury-splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.99, filter: 'blur(8px)' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      onClick={safeComplete}
      className="fixed inset-0 z-[99999] overflow-hidden select-none cursor-pointer flex flex-col justify-between"
      style={{
        backgroundColor: '#F7F5F0',
        background: 'radial-gradient(ellipse at 50% 40%, #FFFFFF 0%, #F7F5F0 60%, #E8E6E0 100%)',
      }}
    >
      {/* Subtle Showroom Environment & Cinematic Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Ambient Studio Grain */}
        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(#17212B 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Top Studio Ambient Soft Light */}
        <div
          className="absolute top-0 left-0 right-0 h-80 opacity-70"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(247,245,240,0) 100%)',
          }}
        />

        {/* Polished Showroom Floor Line */}
        <div className="absolute top-[56%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#DFDCD4] to-transparent opacity-80" />

        {/* Floor Horizon & Subtle Warm Reflections */}
        <div
          className="absolute top-[56%] inset-x-0 bottom-0 opacity-45"
          style={{
            background: 'linear-gradient(180deg, rgba(232,230,224,0.5) 0%, rgba(200,169,107,0.06) 45%, rgba(247,245,240,0.85) 100%)',
          }}
        />

        {/* Champagne Gold Ambient Light Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[850px] h-[360px] pointer-events-none rounded-full blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(200,169,107,0.16) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* TOP HEADER: BRAND IDENTITY & AUDIO TOGGLE */}
      <div className="relative z-30 flex items-center justify-between px-6 sm:px-12 pt-6 sm:pt-8 w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="h-8 w-auto px-2 py-0.5 bg-black rounded-sm border border-[#C8A96B]/50 flex items-center justify-center shadow-xs">
            <img
              src="/royal_jp_logo.jpg"
              alt="royalJPcar Logo"
              referrerPolicy="no-referrer"
              className="h-7 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-0.5">
              <span className="font-serif font-bold text-[#C8A96B] text-xs uppercase tracking-[0.18em]">
                Royal
              </span>
              <span className="font-sans font-black italic text-[#E5252A] text-xs">
                JP
              </span>
              <span className="font-sans font-bold italic text-[#17212B] text-xs">
                car
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#8C95A0]">
              TOKYO SHOWROOM 2026
            </span>
          </div>
        </motion.div>

        {/* Skip Intro button in header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <button
            id="skip-intro-top-button"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              safeComplete();
            }}
            className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#E2E5E8] text-xs text-[#69727C] hover:text-[#17212B] transition-all shadow-xs cursor-pointer"
          >
            <span className="text-[10px] uppercase tracking-wider font-semibold">SKIP INTRO</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C8A96B] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* CENTER STAGE: CINEMATIC MONTAGE & BRAND REVEAL */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-8">
        
        {/* CAR MONTAGE (3 Cars displayed slowly and gracefully) */}
        <AnimatePresence mode="wait">
          {activeCar && currentIndex < INTRO_CARS.length && (
            <motion.div
              key={activeCar.id}
              initial={{
                opacity: 0,
                scale: 1.04,
                x: currentIndex % 2 === 0 ? -24 : 24,
                filter: 'blur(5px)',
              }}
              animate={{
                opacity: 1,
                scale: 1.0,
                x: 0,
                filter: 'blur(0px)',
              }}
              exit={{
                opacity: 0,
                scale: 0.98,
                x: currentIndex % 2 === 0 ? 18 : -18,
                filter: 'blur(4px)',
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex flex-col items-center justify-center w-full max-w-5xl mx-auto"
            >
              {/* Showroom Floor Soft Contact Shadow */}
              <div
                className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-[78%] h-8 sm:h-12 rounded-[100%] pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(23, 33, 43, 0.42) 0%, rgba(23, 33, 43, 0.12) 50%, transparent 75%)',
                  filter: 'blur(9px)',
                }}
              />

              {/* Polished Floor Mirror Reflection */}
              <div
                className="absolute top-[82%] left-0 right-0 h-28 overflow-hidden pointer-events-none opacity-20 hidden sm:block"
                style={{
                  transform: 'scaleY(-1)',
                  filter: 'blur(4px)',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 75%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 75%)',
                }}
              >
                <img
                  src={activeCar.image}
                  alt=""
                  className="w-full h-full object-contain filter contrast-90 brightness-95"
                />
              </div>

              {/* Pristine Supercar Image Container (Strictly preserves aspect ratio and design) */}
              <div className="relative w-full max-h-[50vh] sm:max-h-[58vh] md:max-h-[62vh] flex items-center justify-center">
                <img
                  src={activeCar.image}
                  alt={activeCar.name}
                  className="max-h-[48vh] sm:max-h-[56vh] md:max-h-[60vh] w-auto max-w-[90vw] object-contain filter drop-shadow-[0_16px_32px_rgba(23,33,43,0.16)]"
                />

                {/* Subtle Light Sheen reflection sweep across car */}
                <motion.div
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={{ x: '100%', opacity: [0, 0.35, 0] }}
                  transition={{ duration: 1.4, ease: 'easeInOut' }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.65) 50%, rgba(200,169,107,0.45) 55%, transparent 70%)',
                    mixBlendMode: 'screen',
                  }}
                />
              </div>

              {/* Minimalist Floating Telemetry HUD Label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 }}
                className="mt-4 sm:mt-6 flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#E2E5E8] shadow-xs text-xs font-mono"
              >
                <span className="text-[#C8A96B] font-bold">0{currentIndex + 1} / 0{INTRO_CARS.length}</span>
                <span className="text-[#DFDCD4]">•</span>
                <span className="text-[#17212B] font-semibold tracking-wider uppercase">{activeCar.brand}</span>
                <span className="text-[#DFDCD4]">•</span>
                <span className="text-[#69727C] font-normal tracking-wide hidden sm:inline">{activeCar.name}</span>
                <span className="text-[#DFDCD4] hidden md:inline">•</span>
                <span className="text-[#C8A96B] font-medium hidden md:inline">{activeCar.specs}</span>
              </motion.div>
            </motion.div>
          )}

          {/* FINAL CLIMAX BRAND REVEAL (Step 3: 7.2s - 8.8s) */}
          {currentIndex === INTRO_CARS.length && (
            <motion.div
              key="brand-finale"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1.0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center max-w-xl mx-auto"
            >
              {/* royalJPcar Official Logo Brand Reveal */}
              <div className="relative mb-5 p-3 sm:p-4 bg-black rounded-2xl border border-[#C8A96B]/60 shadow-[0_20px_50px_rgba(0,0,0,0.6)] max-w-[320px] sm:max-w-[400px]">
                <img
                  src="/royal_jp_logo.jpg"
                  alt="royalJPcar Showroom Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>

              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#C8A96B]">
                  Royal
                </span>
                <span className="font-sans text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter text-[#E5252A]">
                  JP
                </span>
                <span className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold italic tracking-tight text-[#17212B]">
                  car
                </span>
              </div>

              <div className="flex items-center gap-3 w-full justify-center my-2">
                <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#C8A96B]/70" />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#69727C]">
                  THE BESPOKE COLLECTION 2026 • TOKYO
                </span>
                <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#C8A96B]/70" />
              </div>

              <p className="text-xs text-[#8C95A0] tracking-[0.22em] uppercase font-light mt-1">
                {isJa ? '至高のマスターピースを体感する' : 'KHÁM PHÁ TUYỆT TÁC Ô TÔ THƯỢNG HẠNG'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* BOTTOM CONTROL BAR: TIMELINE TRACK & "SKIP INTRO →" */}
      <div className="relative z-30 flex items-center justify-between px-6 sm:px-12 pb-6 sm:pb-8 w-full max-w-7xl mx-auto">
        {/* Progress Bar & Sequence Dots */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-[#8C95A0]">
          <span className="hidden sm:inline uppercase tracking-wider text-[10px]">
            {isJa ? 'シネマティック・イントロ' : 'CINEMATIC PRELUDE'}
          </span>
          <div className="w-28 sm:w-44 h-[2px] bg-[#E2E5E8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C8A96B] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Active step indicators */}
          <div className="hidden sm:flex items-center gap-1.5">
            {INTRO_CARS.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  currentIndex === i
                    ? 'bg-[#C8A96B] scale-125'
                    : currentIndex > i
                    ? 'bg-[#17212B]'
                    : 'bg-[#DFDCD4]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* SKIP INTRO BUTTON */}
        <button
          id="skip-intro-button"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            safeComplete();
          }}
          className="group flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-medium text-[#69727C] hover:text-[#C8A96B] transition-colors cursor-pointer focus:outline-none py-1 px-2"
        >
          <span>{isJa ? 'スキップ' : 'SKIP INTRO'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};
