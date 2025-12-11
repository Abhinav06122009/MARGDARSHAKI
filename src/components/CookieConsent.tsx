import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('margdarshak_cookie_consent');
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('margdarshak_cookie_consent', 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-white/10 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-300 text-sm text-center md:text-left max-w-4xl">
              <p className="font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-2">
                🍪 Cookie & Privacy Notice
              </p>
              <p>
                We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. 
                We also share information about your use of our site with our social media, advertising and analytics partners.
                <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline ml-1">Learn more</a>.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setShow(false)} className="border-white/20 text-white hover:bg-white/10">Decline</Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/20" onClick={accept}>Accept & Continue</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
