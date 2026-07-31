import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { Maximize2, ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'Toutes les photos' },
    { id: 'Santé', label: 'Santé' },
    { id: 'Environnement', label: 'Environnement' },
    { id: 'Humanitaire', label: 'Humanitaire' },
    { id: 'Formation', label: 'Formation' },
    { id: 'Éducation', label: 'Éducation' },
  ];

  const filtered = gallery.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filtered.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
    }
  };

  return (
    <section id="galerie" className="py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            GALERIE PHOTOS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-gray-900 dark:text-white">
            Nos <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">moments forts</span> en images
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Revivez les moments clés de nos actions sur le terrain, nos ateliers et la vie du club.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={getOptimizedImageUrl(item.image, 800)}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                  {item.category}
                </span>
                <h3 className="text-base font-bold font-poppins text-white">
                  {item.title}
                </h3>
                {item.date && (
                  <span className="text-[11px] text-gray-300 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                )}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-50"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevLightbox}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-50"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          <button
            onClick={nextLightbox}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-50"
            aria-label="Suivant"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={filtered[lightboxIndex].image}
              alt={filtered[lightboxIndex].title}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="text-center mt-4 text-white">
              <h3 className="text-lg font-bold font-poppins">
                {filtered[lightboxIndex].title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {filtered[lightboxIndex].category} • Photo {lightboxIndex + 1} sur {filtered.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
