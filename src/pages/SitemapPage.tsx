import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Map, FileText, Lock, Layout, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const SitemapPage = () => {
  const links = [
    {
      category: "Main",
      icon: Layout,
      items: [
        { name: "Home", path: "/" },
        { name: "Login/Signup", path: "/auth" },
        { name: "Pricing", path: "/#pricing" },
        { name: "Features", path: "/#features" }
      ]
    },
    {
      category: "Free Tools",
      icon: Map,
      items: [
        { name: "Scientific Calculator", path: "/calculator" },
        // Add more public tools here as you build them
      ]
    },
    {
      category: "Resources",
      icon: BookOpen,
      items: [
        { name: "Blog", path: "/blog" },
        { name: "Study Techniques", path: "/blog/study-techniques-2025" },
        { name: "Exam Stress Tips", path: "/blog/manage-exam-stress" },
        { name: "Digital vs Paper Notes", path: "/blog/digital-notes-vs-paper" },
        { name: "Help Center", path: "/help" }
      ]
    },
    {
      category: "Company & Legal",
      icon: FileText,
      items: [
        { name: "About Us", path: "/about" },
        { name: "Contact Us", path: "/contact" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms & Conditions", path: "/terms" }
      ]
    },
    {
      category: "Student Portal (Login Required)",
      icon: Lock,
      items: [
        { name: "Dashboard", path: "/dashboard" },
        { name: "My Grades", path: "/grades" },
        { name: "Tasks", path: "/tasks" },
        { name: "Timetable", path: "/timetable" },
        { name: "Notes", path: "/notes" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Link to="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Sitemap</h1>
            <p className="text-gray-400">Overview of all pages on MARGDARSHAK</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {links.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <section.icon className="w-6 h-6 text-emerald-500" />
                  <h2 className="text-xl font-bold">{section.category}</h2>
                </div>
                <ul className="space-y-3">
                  {section.items.map((link, i) => (
                    <li key={i}>
                      <Link 
                        to={link.path} 
                        className="text-gray-400 hover:text-white hover:underline transition-all flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 mt-12 py-8 text-center text-gray-500 text-sm">
        <p>© 2025 MARGDARSHAK. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SitemapPage;
