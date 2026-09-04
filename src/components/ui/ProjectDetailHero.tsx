'use client';

import React, { useState } from 'react';
import { ProjectShowcase } from '@/components/ui/ProjectShowcase';
import { ScreenshotLightbox } from '@/components/ui/ScreenshotLightbox';
import { FiImage } from 'react-icons/fi';

interface ProjectDetailHeroProps {
  images: string[];
  title: string;
}

export const ProjectDetailHero: React.FC<ProjectDetailHeroProps> = ({
  images,
  title,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="mb-12">
        <ProjectShowcase
          images={images}
          alt={title}
          aspectRatio="aspect-[16/10]"
          onOpenLightbox={openLightbox}
        />
      </div>

      {/* Lightbox Modal */}
      <ScreenshotLightbox
        isOpen={lightboxOpen}
        images={images}
        initialIndex={lightboxIndex}
        title={title}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
};

export const ProjectDetailGalleryGrid: React.FC<{
  images: string[];
  title: string;
}> = ({ images, title }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (images.length <= 1) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-[#D9D6CE] flex items-center gap-2">
        <FiImage className="w-5 h-5 text-[#5c7254]" /> Screenshot Gallery ({images.length})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((imgUrl, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(idx)}
            className="aspect-16/10 bg-[#faf9f6] rounded-xl overflow-hidden border border-[#D9D6CE] cursor-pointer group hover:border-[#a8b8a2] transition-all"
          >
            <img
              src={imgUrl}
              alt={`${title} - ${idx + 1}`}
              className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-250"
            />
          </div>
        ))}
      </div>

      <ScreenshotLightbox
        isOpen={lightboxOpen}
        images={images}
        initialIndex={lightboxIndex}
        title={title}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
