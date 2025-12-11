import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AdSenseScript = () => {
  const location = useLocation();

  // Define strictly public paths where ads are allowed.
  // These must NOT be behind a login wall.
  const allowedPaths = [
    '/calculator',
    '/timer',
    '/features',
    '/testimonials',
    '/about',
    '/privacy',
    '/terms',
    '/blog' // Future-proofing if you add a blog
  ];

  // Check if the current path starts with one of the allowed paths
  const isAllowed = allowedPaths.some(path => location.pathname.startsWith(path));

  useEffect(() => {
    // 1. If we are NOT on an allowed public page, do nothing (or remove existing ads if you want strict cleanup)
    if (!isAllowed) return;

    // 2. Only load the script if it's not already there
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      try {
        const script = document.createElement('script');
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3982840732098678";
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      } catch (e) {
        console.error("AdSense failed to load", e);
      }
    }
  }, [location, isAllowed]);

  // Don't render anything visible
  return null;
};

export default AdSenseScript;
