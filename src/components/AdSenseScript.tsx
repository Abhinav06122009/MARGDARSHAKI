import React, { useEffect } from 'react';

const AdSenseScript = () => {
  useEffect(() => {
    // Check if script is already present to avoid duplicates
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3982840732098678";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  }, []);

  return null;
};

export default AdSenseScript;
