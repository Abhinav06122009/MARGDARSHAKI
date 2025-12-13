import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 p-4 z-[100] backdrop-blur-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-300 text-sm">
          We use cookies to improve your experience and serve personalized ads. 
          By using our site, you agree to our <a href="/privacy" className="text-emerald-400 underline">Privacy Policy</a>.
        </p>
        <div className="flex gap-3">
          <Button onClick={acceptCookies} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm">
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
