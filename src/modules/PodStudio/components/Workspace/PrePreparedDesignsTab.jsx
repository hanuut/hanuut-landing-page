import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FaPalette, FaSpinner } from 'react-icons/fa';

export default function PrePreparedDesignsTab({ onSelectArtwork, activeCategory }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = useMemo(() => {
    return process.env.REACT_APP_API_PROD_URL || "https://api.hanuut.com";
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Fetch design documents belonging exclusively to this collection
    axios
      .get(`${API_URL}/image/pod-designs/catalog?collection=${encodeURIComponent(activeCategory || '')}`)
      .then((res) => {
        if (isMounted && res.data) {
          setDesigns(res.data);
        }
      })
      .catch((err) => {
        console.warn("Failed to retrieve matching collection designs:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeCategory, API_URL]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0', color: '#a1a1aa' }}>
        <FaSpinner className="fa-spin" />
      </div>
    );
  }

  if (designs.length === 0) {
    return (
      <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#71717a', fontSize: '0.85rem' }}>
        {t('pod_studio_preprepared_empty', 'No alternative designs found in this collection.')}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        fontSize: '0.75rem', 
        fontWeight: '800', 
        color: '#71717a', 
        textTransform: 'uppercase',
        letterSpacing: '1px',
        direction: isRtl ? 'rtl' : 'ltr',
        textAlign: isRtl ? 'right' : 'left'
      }}>
        <FaPalette style={{ color: '#39A170' }} />
        <span>{isRtl ? 'اختر تصميماً آخر من التشكيلة' : 'Select Alternative Collection Design'}</span>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '0.75rem', 
        maxHeight: '160px', 
        overflowY: 'auto',
        paddingRight: '4px'
      }}>
        {designs.map((art) => {
          const artworkUrl = `${API_URL}/image/raw/${art._id || art.id}`;
          const cleanName = (art.originalname || '').split('.')[0].replace(/[_-]/g, ' ');
          const placement = art.podDesignMetadata?.defaultPlacement || {};

          return (
            <button
              type="button"
              key={art._id || art.id}
              onClick={() => onSelectArtwork(artworkUrl, placement)}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#f07a48';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              <div style={{ 
                width: '100%', 
                aspectRatio: '1', 
                background: 'rgba(0,0,0,0.3)', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifycontent: 'center',
                padding: '4px',
                boxSizing: 'border-box'
              }}>
                <img 
                  src={artworkUrl} 
                  alt={cleanName} 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  loading="lazy"
                />
              </div>
              <span style={{ 
                fontSize: '0.7rem', 
                color: '#a1a1aa', 
                fontWeight: '700',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                display: 'block'
              }}>
                {cleanName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

PrePreparedDesignsTab.propTypes = {
  onSelectArtwork: PropTypes.func.isRequired,
  activeCategory: PropTypes.string,
};