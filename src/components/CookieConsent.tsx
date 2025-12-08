import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const consent = localStorage.getItem('margdarshak_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('margdarshak_cookie_consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-white/10 p-4 z-50 animate-in slide-in-from-bottom-full duration-500 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-gray-300 text-sm text-center md:text-left max-w-3xl">
          <p className="font-semibold text-white mb-1">🍪 We value your privacy</p>
          <p>
            We use cookies to enhance your browsing experience, serve personalized ads, and analyze our traffic. 
            By clicking "Accept", you consent to our use of cookies. Read our <a href="/privacy" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4">Privacy Policy</a>.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShow(false)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Decline
          </Button>
          <Button 
            size="sm" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-900/20" 
            onClick={accept}
          >
            Accept Cookies
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
