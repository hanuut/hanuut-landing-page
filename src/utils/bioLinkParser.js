import React from 'react';
import { 
  FaInstagram, FaFacebook, FaTiktok, FaWhatsapp, 
  FaGlobe, FaExternalLinkAlt 
} from 'react-icons/fa';

const FAMOUS_PLATFORMS = [
  { regex: /instagram\.com/i, icon: <FaInstagram />, color: '#E1306C', name: 'Instagram' },
  { regex: /facebook\.com/i, icon: <FaFacebook />, color: '#1877F2', name: 'Facebook' },
  { regex: /tiktok\.com/i, icon: <FaTiktok />, color: '#000000', name: 'TikTok' },
  { regex: /wa\.me/i, icon: <FaWhatsapp />, color: '#25D366', name: 'WhatsApp' },
  { regex: /whatsapp\.com/i, icon: <FaWhatsapp />, color: '#25D366', name: 'WhatsApp' }
];

export const parseBioLinks = (linksArray = [], socialObject = {}) => {
  const parsedItems = [];
  const assignedLabels = new Set();

  // 1. Process explicit social handles
  Object.entries(socialObject).forEach(([platform, value]) => {
    if (!value) return;
    const matched = FAMOUS_PLATFORMS.find(p => p.name.toLowerCase() === platform.toLowerCase());
    const cleanUrl = value.startsWith('http') ? value : `https://${value}`;

    parsedItems.push({
      label: matched ? matched.name : platform,
      url: cleanUrl,
      icon: matched ? matched.icon : <FaGlobe />,
      color: matched ? matched.color : '#6B7280',
      isPrimary: false
    });
  });

  // 2. Process Custom Links with Collision Avoidance
  linksArray.forEach((link) => {
    if (!link.url || link.isActive === false) return;

    // Check if it matches a famous platform
    const matched = FAMOUS_PLATFORMS.find(p => p.regex.test(link.url));
    if (matched) {
      parsedItems.push({
        label: link.title || matched.name,
        url: link.url,
        icon: matched.icon,
        color: matched.color,
        isPrimary: link.isPrimary || false
      });
      return;
    }

    // Custom link abbreviation generation (e.g. Medium -> "me", etc.)
    let domain = '';
    try {
      domain = new URL(link.url).hostname.replace('www.', '').split('.')[0];
    } catch {
      domain = link.title || 'LK';
    }

    let abbreviation = domain.substring(0, 2).toLowerCase();
    
    // Collision detection loop
    if (assignedLabels.has(abbreviation)) {
      abbreviation = (domain.charAt(0) + (domain.charAt(2) || 'K')).toLowerCase();
    }
    let counter = 1;
    while (assignedLabels.has(abbreviation)) {
      abbreviation = `${domain.substring(0, 2)}${counter}`.toLowerCase();
      counter++;
    }

    assignedLabels.add(abbreviation);

    parsedItems.push({
      label: link.title || domain,
      abbreviation: abbreviation.toUpperCase(),
      url: link.url,
      icon: <span className="custom-abbr font-bold text-xs">{abbreviation.toUpperCase()}</span>,
      color: '#3B82F6', // Tech Blue default
      isPrimary: link.isPrimary || false
    });
  });

  return parsedItems;
};