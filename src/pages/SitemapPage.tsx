import React from 'react';

const SitemapPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-800">Sitemap</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <ul className="list-disc list-inside">
            <li className="mb-2"><a href="/" className="text-blue-500">Home</a></li>
            <li className="mb-2"><a href="/about" className="text-blue-500">About Us</a></li>
            <li className="mb-2"><a href="/contact" className="text-blue-500">Contact Us</a></li>
            <li className="mb-2"><a href="/privacy" className="text-blue-500">Privacy Policy</a></li>
            <li className="mb-2"><a href="/terms" className="text-blue-500">Terms & Conditions</a></li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default SitemapPage;