import React, { useEffect } from 'react';

const AdSenseScript = () => {
  useEffect(() => {
    // Only load if not already present
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3982840732098678";
      script.async = true;
      // Note: crossOrigin is intentionally omitted to prevent CORS errors on some setups
      document.head.appendChild(script);
    }
  }, []);

  return null;
};

export default AdSenseScript;
