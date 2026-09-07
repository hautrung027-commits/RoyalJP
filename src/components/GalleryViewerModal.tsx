import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { GalleryImage } from '../data/gallery';

interface GalleryViewerModalProps {
  image: GalleryImage | null;
  allImages: GalleryImage[];
  onClose: () => void;
  onConsultation?: (carModelName?: string) => void;
  onNavigateToCollection: () => void;
}

export const GalleryViewerModal: React.FC<GalleryViewerModalProps> = ({
  image,
  allImages,
  onClose,
  onConsultation,
  onNavigateToCollection,
}) => {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === 'ja';

  if (!image) return null;

  const currentIndex = allImages.findIndex((img) => img.id === image.id);

  const displayTitle = isJa && image.titleJa ? image.titleJa : image.title;
  const displaySubtitle = isJa && image.subtitleJa ? image.subtitleJa : image.subtitle;
  const displayCategory = isJa && image.categoryNameJa ? image.categoryNameJa : image.categoryName;
  const displayCarName = isJa && image.carNameJa ? image.carNameJa : image.carName;
  const displayHighlight = isJa && image.highlightJa ? image.highlightJa : image.highlight;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      const prevImg = allImages[currentIndex - 1];
      const event = new CustomEvent('select-gallery-image', { detail: prevImg });
      window.dispatchEvent(event);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < allImages.length - 1) {
      const nextImg = allImages[currentIndex + 1];
      const event = new CustomEvent('select-gallery-image', { detail: nextImg });
      window.dispatchEvent(event);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#17212B]/85 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl bg-[#17212B] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96B]/20 text-[#C8A96B] border border-[#C8A96B]/40 text-[10px] font-bold uppercase tracking-wider">
                {displayCategory}
              </span>
              <span className="text-white text-sm font-serif font-bold hidden sm:inline">
                {displayCarName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#B8C0C7] mr-3">
                {currentIndex + 1} / {allImages.length}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Photo Canvas */}
          <div className="relative flex-1 bg-black flex items-center justify-center min-h-[350px] sm:min-h-[460px] overflow-hidden group">
            <img
              src={image.imageUrl}
              alt={displayTitle}
              className="max-h-[60vh] w-auto object-contain select-none"
            />

            {/* Navigation arrows */}
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-[#C8A96B] text-white hover:text-[#17212B] backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {currentIndex < allImages.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-[#C8A96B] text-white hover:text-[#17212B] backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Footer Details */}
          <div className="p-6 bg-[#17212B] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-1">
                {displayTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#B8C0C7] max-w-xl leading-relaxed mb-2">
                {displaySubtitle}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#C8A96B]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{displayHighlight}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToCollection();
                }}
                className="px-4 py-2.5 rounded-sm border border-white/20 hover:border-[#C8A96B] text-white hover:text-[#C8A96B] text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>{isJa ? '在庫車両一覧' : 'Xem Dòng Xe'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onConsultation) {
                    onConsultation(displayCarName);
                  } else {
                    window.location.href = 'tel:0908888999';
                  }
                }}
                className="px-5 py-2.5 rounded-sm bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isJa ? 'VIPホットライン相談' : 'Liên Hệ Hotline Tư Vấn'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
