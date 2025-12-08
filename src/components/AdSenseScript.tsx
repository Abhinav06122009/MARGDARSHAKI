import React, { useEffect } from 'react';

const AdSenseScript = () => {
  useEffect(() => {
    // Only load if not already present to avoid duplicates
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3982840732098678";
      script.async = true;
      // REMOVED: script.crossOrigin = "anonymous";  <-- This was causing the CORS error
      document.head.appendChild(script);
    }
  }, []);

  return null;
};

export default AdSenseScript;
