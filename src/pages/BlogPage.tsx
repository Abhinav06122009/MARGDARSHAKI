import React from 'react';
import { motion } from 'framer-motion';
import { Link, Routes, Route, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Calendar, ChevronRight } from 'lucide-react';
import logo from "@/components/logo/logo.png";

// Mock Data for Blog Posts
const BLOG_POSTS = [
  {
    id: 'study-techniques-2025',
    title: 'Top 5 Scientific Study Techniques for 2025',
    excerpt: 'Discover the Pomodoro Technique, Active Recall, and Spaced Repetition methods to boost your grades instantly.',
    content: `
      <h2>1. The Pomodoro Technique</h2>
      <p>The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.</p>
      
      <h2>2. Active Recall</h2>
      <p>Active recall is a principle of efficient learning, which claims the need to actively stimulate memory during the learning process. It contrasts with passive review, in which the learning material is processed passively (e.g. by reading, watching, etc.).</p>
      
      <h2>3. Spaced Repetition</h2>
      <p>Spaced repetition is an evidence-based learning technique that is usually performed with flashcards. Newly introduced and more difficult flashcards are shown more frequently, while older and less difficult flashcards are shown less frequently in order to exploit the psychological spacing effect.</p>
    `,
    date: 'Oct 15, 2025',
    readTime: '5 min read',
    category: 'Productivity'
  },
  {
    id: 'manage-exam-stress',
    title: 'How to Manage Exam Stress effectively',
    excerpt: 'Feeling overwhelmed? Learn practical mindfulness strategies to stay calm and focused during exam season.',
    content: `
      <p>Exams can be stressful, but managing that stress is key to performance. Here are three tips:</p>
      <ul>
        <li><strong>Sleep Well:</strong> Never underestimate the power of a good night's sleep before an exam.</li>
        <li><strong>Visualize Success:</strong> Spend 5 minutes visualizing yourself taking the test calmly.</li>
        <li><strong>Breathing Exercises:</strong> Box breathing (4-4-4-4) can lower cortisol levels instantly.</li>
      </ul>
    `,
    date: 'Oct 12, 2025',
    readTime: '4 min read',
    category: 'Mental Health'
  },
  {
    id: 'digital-notes-vs-paper',
    title: 'Digital Notes vs. Paper: Which is Better?',
    excerpt: 'We analyze the pros and cons of typing vs. writing to help you choose the best workflow for your classes.',
    content: `
      <p>The debate between iPad notes and traditional notebooks continues. Studies suggest that writing by hand improves retention, while digital notes offer better organization and searchability.</p>
      <p>At MARGDARSHAK, we believe in a hybrid approach. Use our Notes feature for quick capture and searchability, but don't be afraid to sketch diagrams on paper!</p>
    `,
    date: 'Oct 10, 2025',
    readTime: '6 min read',
    category: 'Technology'
  }
];

const BlogList = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-8 w-8" />
            <span className="font-bold text-xl">MARGDARSHAK Blog</span>
          </Link>
          <Link to="/auth">
            <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
              Student Login
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Student Resources & Insights
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Expert advice on study techniques, academic productivity, and student life.
        </p>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-emerald-400 mb-4 font-mono">
                  <span>{post.category}</span>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-3 group-hover:text-emerald-300 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link to={`/blog/${post.id}`}>
                  <div className="inline-flex items-center text-sm font-semibold text-white hover:text-emerald-400 transition-colors">
                    Read Article <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        <p>© 2025 MARGDARSHAK. All rights reserved.</p>
      </footer>
    </div>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = BLOG_POSTS.find(p => p.id === slug);

  if (!post) return <div className="text-white text-center py-20">Article not found</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Link to="/blog" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-8 text-center">
            <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-mono mb-4">
                {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">{post.title}</h1>
            <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {post.date}</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.readTime}</span>
            </div>
        </div>

        <div 
            className="prose prose-invert prose-emerald max-w-none text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 pt-8 border-t border-white/10">
            <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 p-8 rounded-2xl border border-emerald-500/20 text-center">
                <h3 className="text-xl font-bold mb-2">Ready to improve your grades?</h3>
                <p className="text-gray-400 mb-6">Join thousands of students using MARGDARSHAK to track tasks and grades.</p>
                <Link to="/auth">
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        Get Started for Free
                    </Button>
                </Link>
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
