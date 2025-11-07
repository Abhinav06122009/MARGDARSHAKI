import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-800">Privacy Policy</h1>
          <p className="mt-2 text-gray-600">Last updated: November 7, 2025</p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
          <p className="text-gray-700 mb-6">
            Welcome to Margdarshak. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Information We Collect</h2>
          <p className="text-gray-700 mb-6">
            We may collect personal information from you such as your name, email address, and other details when you register on our site, subscribe to our newsletter, or fill out a form.
          </p>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Use Your Information</h2>
          <p className="text-gray-700 mb-6">
            We use the information we collect to personalize your experience, improve our website, and send periodic emails. We implement a variety of security measures to maintain the safety of your personal information.
          </p>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@margdarshak.com" className="text-blue-500">privacy@margdarshak.com</a>.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
