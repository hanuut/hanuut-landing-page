import { useState, useEffect } from 'react';

const useDetectedPlatform = () => {
  const [platform, setPlatform] = useState('other');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      setPlatform('ios');
    } else if (/Android/.test(ua)) {
      setPlatform('android');
    } else if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(ua)) {
      setPlatform('macos');
    } else if (/Win/.test(ua)) {
      setPlatform('windows');
    } else {
      setPlatform('other'); // fallback: will default to Windows as primary
    }
  }, []);

  return platform;
};

export default useDetectedPlatform;