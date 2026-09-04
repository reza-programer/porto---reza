'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ScreenshotLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const ScreenshotLightbox: React.FC<ScreenshotLightboxProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex flex-col justify-between bg-black/90 backdrop-blur-md p-4 sm:p-6 text-white"
        onClick={onClose}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between w-full max-w-6xl mx-auto z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            {title && <span className="font-semibold text-sm sm:text-base text-slate-200">{title}</span>}
            {images.length > 1 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300 font-mono">
                {currentIndex + 1} / {images.length}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            title="Close (Esc)"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Center image container */}
        <div
          className="relative flex-1 flex items-center justify-center my-2 sm:my-4 max-w-6xl w-full mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-1 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white transition-transform hover:scale-105 active:scale-95"
              title="Previous (Left Arrow)"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative max-h-[75vh] w-full flex items-center justify-center">
            <img
              src={images[currentIndex]}
              alt={`${title || 'Screenshot'} - ${currentIndex + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded-lg border border-white/10 shadow-2xl transition-all duration-300"
            />
          </div>

          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-1 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white transition-transform hover:scale-105 active:scale-95"
              title="Next (Right Arrow)"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Bottom thumbnail strip */}
        {images.length > 1 && (
          <div
            className="w-full max-w-4xl mx-auto overflow-x-auto py-2 flex items-center justify-center gap-2 z-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 w-16 h-10 sm:w-20 sm:h-12 rounded-md overflow-hidden border-2 transition-all ${
                  idx === currentIndex
                    ? 'border-[#5c7254] scale-105 opacity-100 shadow-md'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
