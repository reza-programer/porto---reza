'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

interface ScreenshotLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

type LightboxPanelProps = Omit<ScreenshotLightboxProps, 'isOpen'>;

/**
 * Mounted only while open, so the index starts from initialIndex every time
 * without having to reset state in an effect.
 */
const LightboxPanel: React.FC<LightboxPanelProps> = ({ images, initialIndex = 0, onClose, title }) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handlePrev, handleNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[70] flex flex-col bg-paper/95 backdrop-blur-xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} screenshots` : 'Screenshots'}
    >
      {/* Top bar */}
      <div className="wrap flex h-16 shrink-0 items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <div className="eyebrow flex items-center gap-4">
          {title && <span className="text-ink">{title}</span>}
          {images.length > 1 && (
            <span className="tabular-nums">
              {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="eyebrow -mr-2 flex cursor-pointer items-center gap-2 rounded-full p-2 text-ink"
          title="Close (Esc)"
        >
          Close <FiX className="h-4 w-4" />
        </button>
      </div>

      {/* Image */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={images[currentIndex]}
            src={images[currentIndex]}
            alt={`${title || 'Screenshot'} - ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="max-h-full max-w-full rounded-lg border border-line object-contain shadow-[0_40px_80px_-40px_rgba(0,0,0,0.35)]"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 cursor-pointer rounded-full border border-line bg-surface p-3 text-ink transition-colors hover:border-ink sm:left-6"
              title="Previous (←)"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 cursor-pointer rounded-full border border-line bg-surface p-3 text-ink transition-colors hover:border-ink sm:right-6"
              title="Next (→)"
            >
              <FiArrowRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className="no-scrollbar mx-auto flex w-full max-w-4xl shrink-0 gap-2 overflow-x-auto px-4 py-4 sm:justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-11 w-[72px] shrink-0 cursor-pointer overflow-hidden rounded-md border transition-all ${
                idx === currentIndex ? 'border-ink opacity-100' : 'border-line opacity-50 hover:opacity-90'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover object-top" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const ScreenshotLightbox: React.FC<ScreenshotLightboxProps> = ({ isOpen, images, ...rest }) => (
  <AnimatePresence>
    {isOpen && images.length > 0 && <LightboxPanel key="lightbox" images={images} {...rest} />}
  </AnimatePresence>
);
