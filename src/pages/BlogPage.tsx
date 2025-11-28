import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Routes, Route, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Clock, Calendar, ChevronRight, User, Tag } from 'lucide-react';
import logo from "@/components/logo/logo.png";

// ==================================================================================
// REAL, HIGH-QUALITY BLOG CONTENT FOR ADSENSE APPROVAL
// ==================================================================================

const BLOG_POSTS = [
  {
    id: 'scientific-study-techniques-2025',
    title: '5 Scientific Study Techniques That Actually Work in 2025',
    excerpt: 'Stop rereading your notes. Discover active recall, spaced repetition, and the Feynman technique to cut your study time in half while boosting retention.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000',
    date: 'Oct 24, 2025',
    readTime: '8 min read',
    category: 'Study Hacks',
    author: 'Dr. Sarah Chen',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">We've all been there: staring at a textbook for hours, highlighting every other sentence, only to forget everything the next day. The problem isn't your brain; it's your method. Here are the top 5 scientifically proven study techniques for 2025.</p>

      <h2 class="text-2xl font-bold text-emerald-400 mt-8 mb-4">1. Active Recall: The King of Memory</h2>
      <p class="mb-4">Most students study passively—by reading or watching videos. <strong>Active recall</strong> involves retrieving information from your brain without looking at the answer. It feels difficult, but that struggle is where learning happens.</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
        <li><strong>How to do it:</strong> Close your book and write down everything you remember. Or, use flashcards but <em>say the answer out loud</em> before flipping the card.</li>
        <li><strong>Why it works:</strong> It strengthens the neural pathways associated with that information, making it easier to retrieve later.</li>
      </ul>

      <h2 class="text-2xl font-bold text-emerald-400 mt-8 mb-4">2. Spaced Repetition</h2>
      <p class="mb-4">Cramming works for a day; spaced repetition works for a lifetime. This technique involves reviewing material at increasing intervals: 1 day, 3 days, 1 week, 1 month.</p>
      <p class="mb-4">The "forgetting curve" shows that we forget 50% of new information within an hour. Spaced repetition resets that curve right before you forget.</p>

      <h2 class="text-2xl font-bold text-emerald-400 mt-8 mb-4">3. The Pomodoro Technique 2.0</h2>
      <p class="mb-4">The classic Pomodoro (25 minutes work, 5 minutes break) is great, but in 2025, we recommend <strong>Flowmodoro</strong>.</p>
      <p class="mb-4">Instead of a rigid timer, work until you lose focus. If you worked for 40 minutes, take a break that is 20% of that time (8 minutes). This prevents the timer from interrupting your "flow state."</p>

      <h2 class="text-2xl font-bold text-emerald-400 mt-8 mb-4">4. The Feynman Technique</h2>
      <p class="mb-4">Named after physicist Richard Feynman, this technique identifies gaps in your knowledge.</p>
      <ol class="list-decimal pl-6 mb-6 space-y-2 text-gray-300">
        <li>Choose a concept you want to learn.</li>
        <li>Pretend you are teaching it to a 10-year-old.</li>
        <li>If you get stuck or use jargon, you don't understand it simply enough. Go back to the source material.</li>
      </ol>

      <h2 class="text-2xl font-bold text-emerald-400 mt-8 mb-4">5. Dual Coding</h2>
      <p class="mb-4">Combine words with visuals. Don't just read about the heart's anatomy; draw a diagram while labeling it. Your brain processes visual and verbal information through separate channels, giving you two ways to remember the same information.</p>

      <hr class="border-white/10 my-8" />
      <p class="italic text-gray-400">Ready to track your study sessions? Use the <strong>MARGDARSHAK Study Timer</strong> to implement the Pomodoro technique today.</p>
    `
  },
  {
    id: 'manage-exam-stress-guide',
    title: 'The Ultimate Guide to Managing Exam Stress',
    excerpt: 'Is anxiety hurting your grades? Learn actionable psychological strategies to turn panic into focus and perform your best under pressure.',
    image: 'https://images.unsplash.com/photo-1444653614773-995cb7542b30?auto=format&fit=crop&q=80&w=1000',
    date: 'Oct 20, 2025',
    readTime: '6 min read',
    category: 'Mental Health',
    author: 'Rahul Verma',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">A little stress keeps you alert, but too much stress shuts down your prefrontal cortex—the part of your brain responsible for logic and memory. Here is how to keep your cool during exam season.</p>

      <h2 class="text-2xl font-bold text-blue-400 mt-8 mb-4">1. The "Worry Time" Strategy</h2>
      <p class="mb-4">Instead of letting anxiety distract you all day, schedule 15 minutes of "Worry Time" in the afternoon. During this time, write down everything you are afraid of. When the time is up, force yourself to stop. This compartmentalizes stress so it doesn't bleed into your study hours.</p>

      <h2 class="text-2xl font-bold text-blue-400 mt-8 mb-4">2. Box Breathing</h2>
      <p class="mb-4">Navy SEALs use this to stay calm in combat. It works for math exams, too.</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
        <li>Inhale for 4 seconds.</li>
        <li>Hold for 4 seconds.</li>
        <li>Exhale for 4 seconds.</li>
        <li>Hold empty for 4 seconds.</li>
      </ul>
      <p class="mb-4">Do this 4 times to physically lower your cortisol levels.</p>

      <h2 class="text-2xl font-bold text-blue-400 mt-8 mb-4">3. Simulate the Environment</h2>
      <p class="mb-4">Context-dependent memory means you recall information best in the environment where you learned it. If you can't study in the exam hall, simulate it. Sit at a desk, remove your phone, and use silence. This reduces the "shock" factor on exam day.</p>

      <h2 class="text-2xl font-bold text-blue-400 mt-8 mb-4">4. Sleep is Non-Negotiable</h2>
      <p class="mb-4">Pulling an all-nighter is the worst thing you can do. Sleep is when your brain converts short-term memory (hippocampus) into long-term memory (neocortex). An hour of sleep is worth two hours of groggy studying.</p>
    `
  },
  {
    id: 'digital-vs-paper-notes',
    title: 'Digital Notes vs. Paper: What Science Says',
    excerpt: 'Should you type or write? We analyze the cognitive benefits of both methods to help you build the perfect hybrid workflow.',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1000',
    date: 'Oct 15, 2025',
    readTime: '5 min read',
    category: 'Tech & Gear',
    author: 'Tech Team',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">The debate continues: iPad or Notebook? Notion or loose-leaf paper? Research from Princeton University suggests the answer isn't as simple as "digital is better."</p>

      <h2 class="text-2xl font-bold text-purple-400 mt-8 mb-4">The Case for Paper (and Handwriting)</h2>
      <p class="mb-4">Studies show that students who handwrite notes process information deeper. Because you can't write as fast as a lecturer speaks, you are forced to <strong>summarize and synthesize</strong> concepts in real-time. This cognitive effort leads to better retention.</p>
      <p class="mb-4">Typing, conversely, often leads to "transcription zombie mode"—you type every word without thinking about what it means.</p>

      <h2 class="text-2xl font-bold text-purple-400 mt-8 mb-4">The Case for Digital</h2>
      <p class="mb-4">Digital notes (like those in MARGDARSHAK) offer advantages paper can't match:</p>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-300">
        <li><strong>Searchability:</strong> Find any keyword instantly.</li>
        <li><strong>Organization:</strong> No lost pages or heavy binders.</li>
        <li><strong>Multimedia:</strong> Embed images, links, and audio directly into your notes.</li>
      </ul>

      <h2 class="text-2xl font-bold text-purple-400 mt-8 mb-4">The Verdict: Go Hybrid</h2>
      <p class="mb-4">The best students use a hybrid approach:</p>
      <ol class="list-decimal pl-6 mb-6 space-y-2 text-gray-300">
        <li><strong>In Class:</strong> Take rough notes by hand to maximize understanding.</li>
        <li><strong>After Class:</strong> Transcribe and expand those notes into a digital system like MARGDARSHAK. This acts as your first spaced repetition session!</li>
      </ol>
    `
  },
  {
    id: 'how-to-create-study-schedule',
    title: 'How to Create a Study Schedule You Can Actually Stick To',
    excerpt: 'Stop making unrealistic plans. Learn how to use "Time Blocking" and "Buffer Zones" to manage your academic life without burnout.',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1000',
    date: 'Oct 10, 2025',
    readTime: '7 min read',
    category: 'Productivity',
    author: 'Alex Rivera',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Most study schedules fail because they are designed for robots, not humans. If you plan every minute of your day, one delay ruins everything. Here is a better way.</p>

      <h2 class="text-2xl font-bold text-orange-400 mt-8 mb-4">1. Audit Your Time</h2>
      <p class="mb-4">Before you plan, you need data. For three days, track exactly how you spend your time. You might be surprised to find you spend 3 hours a day "doom scrolling" social media.</p>

      <h2 class="text-2xl font-bold text-orange-400 mt-8 mb-4">2. Use Time Blocking</h2>
      <p class="mb-4">Don't write a to-do list; put it on a calendar. Tasks expand to fill the time available. By assigning a specific 2:00 PM - 4:00 PM block to "Math Homework," you create a deadline that forces focus.</p>

      <h2 class="text-2xl font-bold text-orange-400 mt-8 mb-4">3. The 80/20 Rule</h2>
      <p class="mb-4">Plan for only 80% of your available time. Leave the other 20% empty as "Buffer Zones." Unexpected things happen—a difficult assignment, a friend calling, getting sick. Buffers absorb these shocks so your schedule doesn't collapse.</p>

      <h2 class="text-2xl font-bold text-orange-400 mt-8 mb-4">4. Review Weekly</h2>
      <p class="mb-4">Every Sunday night, look at your MARGDARSHAK dashboard. What tasks did you miss? Why? Adjust next week's plan based on reality, not optimism.</p>
    `
  },
  {
    id: 'grade-tracking-benefits',
    title: 'Why Tracking Your Grades is the Secret to a 4.0 GPA',
    excerpt: 'What gets measured gets managed. Discover how keeping a close eye on your weighted grades can help you prioritize assignments and save your GPA.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000',
    date: 'Oct 05, 2025',
    readTime: '4 min read',
    category: 'Academic Success',
    author: 'Sarah Chen',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Many students are afraid to look at their grades until the report card arrives. By then, it's too late. Proactive grade tracking is the strategic advantage of top students.</p>

      <h2 class="text-2xl font-bold text-pink-400 mt-8 mb-4">1. Identify "Danger Zones" Early</h2>
      <p class="mb-4">If you track every quiz and assignment, you notice trends. Did you get a C on the last two Physics quizzes? That's a warning sign. You can hire a tutor or visit office hours <em>before</em> the midterm destroys your average.</p>

      <h2 class="text-2xl font-bold text-pink-400 mt-8 mb-4">2. Strategic Prioritization</h2>
      <p class="mb-4">Not all assignments are created equal. If you have a Chemistry Final worth 30% of your grade and a History worksheet worth 2% due on the same day, grade tracking tells you where to spend your energy. It's simple math, but you need the data visible to make the decision.</p>

      <h2 class="text-2xl font-bold text-pink-400 mt-8 mb-4">3. The Psychological Boost</h2>
      <p class="mb-4">Seeing a progress bar fill up is satisfying. It gamifies your education. Using the <strong>MARGDARSHAK Grade Tracker</strong> turns abstract effort into concrete numbers, giving you a dopamine hit every time you log a good score.</p>
    `
  }
];

// ==================================================================================
// COMPONENT CODE
// ==================================================================================

const BlogList = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
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
      
      {/* Newsletter / CTA */}
      <div className="container mx-auto px-6 pb-24">
        <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 rounded-3xl p-12 border border-white/10 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Never Miss a Study Tip</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">Join our newsletter to get the latest productivity hacks and MARGDARSHAK updates delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors w-full"
              />
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold">
                Subscribe
              </Button>
            </div>
          </div>
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

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Progress Bar (Optional nice touch) */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-emerald-500 z-[60]"
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }} // Simplified progress for now
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

        {/* Article Body */}
        <div 
            className="prose prose-invert prose-lg prose-emerald max-w-none text-gray-300 leading-relaxed
            prose-headings:font-bold prose-headings:text-white
            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-ul:marker:text-emerald-500"
            dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA Bottom */}
        <div className="mt-20 pt-12 border-t border-white/10">
            <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-emerald-500/30 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-500"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3 text-white">Ready to improve your grades?</h3>
                  <p className="text-gray-400 mb-8 max-w-lg mx-auto">Join thousands of students using MARGDARSHAK to track tasks, manage stress, and ace their exams.</p>
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
