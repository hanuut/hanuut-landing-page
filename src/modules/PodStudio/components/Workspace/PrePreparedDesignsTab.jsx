// src/modules/PodStudio/components/Workspace/PrePreparedDesignsTab.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';

// --- CURATED TRANSPARENT ARTWORK LIBRARY ---
const PRE_PREPARED_CATALOG = [
  {
    id: "artwork_auras_classic",
    name: "AURAS Classic Logo",
    thumbnail: "https://api.hanuut.com/image/raw/6a53719234375f0d37a15e06", 
    artworkUrl: "https://api.hanuut.com/image/raw/6a53719234375f0d37a15e06",
    defaultPlacement: { scale: 60, x: 50, y: 30, rotation: 0 }
  },
  {
    id: "artwork_urban_cyber",
    name: "Urban Cyberpunk",
    thumbnail: "https://res.cloudinary.com/dibklych5/image/upload/v1783917550/bldtcuwiphihm1lun7rv.png",
    artworkUrl: "https://res.cloudinary.com/dibklych5/image/upload/v1783917550/bldtcuwiphihm1lun7rv.png",
    defaultPlacement: { scale: 80, x: 50, y: 50, rotation: 0 }
  },
  {
    id: "artwork_distressed_rose",
    name: "Distressed Rose",
    thumbnail: "https://res.cloudinary.com/dibklych5/image/upload/v1783917603/ovh6jk2ddfh5cwawchza.png",
    artworkUrl: "https://res.cloudinary.com/dibklych5/image/upload/v1783917603/ovh6jk2ddfh5cwawchza.png",
    defaultPlacement: { scale: 75, x: 50, y: 40, rotation: 45 }
  },
  {
    id: "artwork_geometric_iso",
    name: "3D Isometric Structure",
    thumbnail: "https://api.hanuut.com/image/raw/6a543ec934375f0d37a17240",
    artworkUrl: "https://api.hanuut.com/image/raw/6a543ec934375f0d37a17240",
    defaultPlacement: { scale: 50, x: 50, y: 25, rotation: 0 }
  }
];

export default function PrePreparedDesignsTab({ onSelectArtwork, activeCategory }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const displayedArtworks = PRE_PREPARED_CATALOG;

  if (displayedArtworks.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 text-sm">
        {t('pod_studio_preprepared_empty')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 🔴 Sparks Icon rendered using clean, self-contained inline SVG */}
      <div className={`flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
        <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="15" width="15" className="text-[#39A170]" xmlns="http://www.w3.org/2000/svg">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
          <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z"></path>
          <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"></path>
        </svg>
        <span>{isRtl ? 'اختر تصميماً جاهزاً للبدء' : 'Select a Premium Artwork'}</span>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
        {displayedArtworks.map((art) => (
          <button
            type="button"
            key={art.id}
            onClick={() => onSelectArtwork(art.artworkUrl, art.defaultPlacement)}
            className="group relative bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-[#39A170]/30 rounded-xl p-3 flex flex-col items-center justify-center transition-all duration-200 text-center"
          >
            {/* Visual Thumbnail */}
            <div className="w-24 h-24 bg-black/30 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center mb-2 group-hover:scale-95 transition-transform duration-200">
              <img 
                src={art.thumbnail} 
                alt={art.name} 
                className="w-full h-full object-contain p-1"
                loading="lazy"
              />
            </div>

            {/* Label name */}
            <span className="text-xs font-semibold text-gray-400 group-hover:text-white truncate w-full px-1">
              {art.name}
            </span>

            {/* Action Overlay */}
            <div className="absolute inset-0 bg-[#39A170]/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-200 pointer-events-none" />
          </button>
        ))}
      </div>
    </div>
  );
}