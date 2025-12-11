import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Routes, Route, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Clock, Calendar, ChevronRight, User, Tag } from 'lucide-react';
import logo from "@/components/logo/logo.png";
import { Helmet } from "react-helmet-async";
import AdUnit from '@/components/AdUnit'; // Import the new component

// ==================================================================================
// REAL, HIGH-QUALITY BLOG CONTENT (Optimized for SEO)
// ==================================================================================

const BLOG_POSTS = [
  {
    id: 'scientific-study-techniques-2025',
    title: '5 Scientific Study Techniques That Actually Work in 2025',
    excerpt: 'Stop rereading your notes. Discover active recall, spaced repetition, and the Feynman technique to cut your study time in half.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000',
    date: 'Oct 24, 2025',
    readTime: '8 min read',
    category: 'Study Hacks',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">We've all been there: staring at a textbook for hours, highlighting every other sentence, only to forget everything the next day. The problem isn't your brain; it's your method. Here are the top 5 scientifically proven study techniques for 2025.</p>

      <h2 class="text-2xl font-bold text-emerald-400 mt-8 mb-4">1. Active Recall: The King of Memory</h2>
      <p class="mb-4">Most students study passively—by reading or watching videos. <strong>Active recall</strong> involves retrieving information from your brain without looking at the answer.</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
        <li><strong>How to do it:</strong> Close your book and write down everything you remember.</li>
        <li><strong>Why it works:</strong> It strengthens the neural pathways associated with that information.</li>
      </ul>

      <h2 class="text-2xl font-bold text-emerald-400 mt-8 mb-4">2. Spaced Repetition</h2>
      <p class="mb-4">Cramming works for a day; spaced repetition works for a lifetime. This technique involves reviewing material at increasing intervals: 1 day, 3 days, 1 week, 1 month.</p>

      <h2 class="text-2xl font-bold text-emerald-400 mt-8 mb-4">3. The Pomodoro Technique 2.0</h2>
      <p class="mb-4">The classic Pomodoro (25 min work, 5 min break) is great, but in 2025, we recommend <strong>Flowmodoro</strong>: Work until you lose focus, then take a break that is 20% of the work time.</p>

      <h2 class="text-2xl font-bold text-emerald-400 mt-8 mb-4">4. The Feynman Technique</h2>
      <p class="mb-4">Named after physicist Richard Feynman, this technique identifies gaps in your knowledge by pretending to teach a concept to a child.</p>

      <hr class="border-white/10 my-8" />
      <p class="italic text-gray-400">Ready to track your study sessions? Use the <strong>MARGDARSHAK Study Timer</strong> to implement these techniques.</p>
    `
  },
  // ... (Include other blog posts here as per previous data) ...
  {
    id: 'manage-exam-stress-guide',
    title: 'The Ultimate Guide to Managing Exam Stress',
    excerpt: 'Is anxiety hurting your grades? Learn actionable psychological strategies to turn panic into focus.',
    image: 'https://images.unsplash.com/photo-1444653614773-995cb7542b30?auto=format&fit=crop&q=80&w=1000',
    date: 'Oct 20, 2025',
    readTime: '6 min read',
    category: 'Mental Health',
    author: 'ABHINAV JHA',
    content: `<p class="lead text-xl text-gray-300 mb-6">A little stress keeps you alert, but too much stress shuts down your prefrontal cortex...</p>` 
  },
];

// ==================================================================================
// COMPONENT CODE
// ==================================================================================

const BlogList = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Helmet>
        <title>Blog | MARGDARSHAK - Student Productivity & Tips</title>
        <meta name="description" content="Read the latest articles on study techniques, academic productivity, and student mental health." />
      </Helmet>

      {/* Header */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-8 w-8 rounded" />
            <span className="font-bold text-xl tracking-tight">MARGDARSHAK <span className="text-emerald-400 font-light">Blog</span></span>
          </Link>
          <Link to="/auth">
            <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 transition-all">
              Student Login
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-emerald-400 mb-6 backdrop-blur-md">
            Academic Excellence & Productivity
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Insights for the Modern Student
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Expert advice on study techniques, academic productivity, mental health, and student life hacks to help you succeed.
          </p>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-6 pb-24">
        {/* Placeholder for In-Feed Ad - You need to generate a real slot ID in AdSense */}
        <AdUnit slot="1234567890" className="mb-12" /> 

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image */}
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-60 z-10" />
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-xs text-white font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-mono">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                </div>
                
                <h2 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors leading-tight">
                  {post.title}
                </h2>
                
                <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                  {post.excerpt}
                </p>
                
                <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                      {post.author.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-400">{post.author}</span>
                  </div>
                  <Link to={`/blog/${post.id}`}>
                    <span className="inline-flex items-center text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group/link">
                      Read <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <footer className="border-t border-white/10 py-12 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <img src={logo} alt="Logo" className="h-6 w-6 grayscale" />
          <span className="font-bold">MARGDARSHAK</span>
        </div>
        <p>© 2025 MARGDARSHAK. All rights reserved.</p>
      </footer>
    </div>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = BLOG_POSTS.find(p => p.id === slug);

  if (!post) return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-4 text-emerald-500">404</h1>
      <p className="text-xl text-gray-400 mb-8">Article not found</p>
      <Link to="/blog">
        <Button variant="outline">Back to Blog</Button>
      </Link>
    </div>
  );

  // JSON-LD Structured Data for Article
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.image,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "MARGDARSHAK",
      "logo": {
        "@type": "ImageObject",
        "url": "https://margdarshak.com/logo.png" // Replace with actual URL
      }
    },
    "datePublished": post.date
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Helmet>
        <title>{post.title} | MARGDARSHAK Blog</title>
        <meta name="description" content={post.excerpt} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-emerald-500 z-[60]"
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
      />

      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Link to="/blog" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Article Header */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 text-sm mb-6">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 font-medium">
              {post.category}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{post.date}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-4 pb-8 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-emerald-900/20">
              {post.author.charAt(0)}
            </div>
            <div className="text-left">
              <div className="font-medium text-white">{post.author}</div>
              <div className="text-xs text-emerald-400 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Author
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-12 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-emerald-500/10">
          <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
        </div>

        {/* --- AD UNIT: Top of Article --- */}
        <AdUnit slot="9876543210" className="my-8" />

        {/* Article Body */}
        <div 
            className="prose prose-invert prose-lg prose-emerald max-w-none text-gray-300 leading-relaxed
            prose-headings:font-bold prose-headings:text-white
            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-ul:marker:text-emerald-500"
            dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* --- AD UNIT: Bottom of Article --- */}
        <AdUnit slot="1122334455" className="mt-16" />

        {/* CTA Bottom */}
        <div className="mt-12 pt-12 border-t border-white/10">
            <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-emerald-500/30 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-500"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3 text-white">Ready to improve your grades?</h3>
                  <p className="text-gray-400 mb-8 max-w-lg mx-auto">Join thousands of students using MARGDARSHAK.</p>
                  <Link to="/auth">
                      <Button className="bg-white text-black hover:bg-gray-200 font-bold px-8 py-6 text-lg rounded-xl shadow-xl shadow-white/10 transform group-hover:scale-105 transition-all">
                          Get Started for Free
                      </Button>
                  </Link>
                </div>
            </div>
        </div>
      </article>
    </div>
  );
};

const BlogPage = () => {
  return (
    <Routes>
      <Route path="/" element={<BlogList />} />
      <Route path="/:slug" element={<BlogPost />} />
    </Routes>
  );
};

export default BlogPage;
