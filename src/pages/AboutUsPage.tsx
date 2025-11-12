import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-800">About Us</h1>
          <p className="mt-2 text-gray-600">Meet the team behind Margdarshak</p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            Our mission is to empower students by providing a comprehensive and intuitive platform to manage their academic journey. We aim to foster productivity, organization, and success by offering powerful tools for task management, scheduling, grade tracking, and collaborative learning. We believe that by simplifying the complexities of student life, we can help every student achieve their full potential and prepare for a successful future. For more info contact at abhinavjha393@gmail.com
          </p>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800">Abhinav Jha</h3>
              <p className="text-gray-600">Founder & CEO</p>
              <p className="text-gray-500 mt-2">A passionate developer and visionary leader, Abhinav is dedicated to creating tools that make a real difference in students' lives.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800">Post Vacant</h3>
              <p className="text-gray-600">Co-Founder & CTO</p>
              <p className="text-gray-500 mt-2">We are looking for a talented and driven individual to join our team as Co-Founder & CTO. If you are passionate about education technology, let's connect!</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800">Abhinav Jha</h3>
              <p className="text-gray-600">Lead Developer</p>
              <p className="text-gray-500 mt-2">With expertise in full-stack development, Abhinav is the architect behind the Margdarshak platform, ensuring a seamless and robust user experience.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUsPage;