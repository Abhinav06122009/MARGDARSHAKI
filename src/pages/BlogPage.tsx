import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Routes, Route, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Clock, Calendar, ChevronRight, User, Tag } from 'lucide-react';
import logo from "@/components/logo/logo.png";
import { Helmet } from "react-helmet-async";
import AdUnit from '@/components/AdUnit';

// ==================================================================================
// 20 HIGH-QUALITY BLOG POSTS FOR ADSENSE APPROVAL
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
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">We've all been there: staring at a textbook for hours, highlighting every other sentence, only to forget everything the next day. The problem isn't your brain; it's your method.</p>
      <h2 class="text-2xl font-bold text-emerald-400 mt-8 mb-4">1. Active Recall</h2>
      <p class="mb-4">Most students study passively. Active recall involves retrieving information from your brain without looking at the answer. It strengthens neural pathways.</p>
      <h2 class="text-2xl font-bold text-emerald-400 mt-8 mb-4">2. Spaced Repetition</h2>
      <p class="mb-4">Reviewing material at increasing intervals (1 day, 3 days, 1 week) combats the forgetting curve effectively.</p>
      <h2 class="text-2xl font-bold text-emerald-400 mt-8 mb-4">3. The Feynman Technique</h2>
      <p class="mb-4">If you can't explain it simply to a child, you don't understand it. This technique forces you to simplify complex concepts.</p>
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
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">A little stress keeps you alert, but too much stress shuts down your prefrontal cortex.</p>
      <h2 class="text-2xl font-bold text-blue-400 mt-8 mb-4">Box Breathing</h2>
      <p class="mb-4">Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. This Navy SEAL technique physically lowers cortisol.</p>
      <h2 class="text-2xl font-bold text-blue-400 mt-8 mb-4">Simulate the Environment</h2>
      <p class="mb-4">Take practice tests in conditions that mimic the real exam hall. Silence, no phone, timed conditions.</p>
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
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Handwriting notes forces your brain to synthesize information, leading to better retention. Typing allows for speed and searchability.</p>
      <h2 class="text-2xl font-bold text-purple-400 mt-8 mb-4">The Hybrid Approach</h2>
      <p class="mb-4">Take rough notes by hand during class to maximize understanding. Then, transcribe them into a digital system like Notion or Obsidian later for organization.</p>
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
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Most schedules fail because they assume you are a robot. You need breaks, buffer times, and flexibility.</p>
      <h2 class="text-2xl font-bold text-orange-400 mt-8 mb-4">The 80/20 Rule</h2>
      <p class="mb-4">Plan for only 80% of your day. Leave 20% open for the unexpected—an assignment taking longer than expected or a surprise errand.</p>
    `
  },
  {
    id: 'grade-tracking-benefits',
    title: 'Why Tracking Your Grades is the Secret to a 4.0 GPA',
    excerpt: 'What gets measured gets managed. Discover how keeping a close eye on your weighted grades can help you prioritize assignments.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000',
    date: 'Oct 05, 2025',
    readTime: '4 min read',
    category: 'Academic Success',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Don't wait for the report card. Calculating your current standing helps you decide where to focus your energy.</p>
      <h2 class="text-2xl font-bold text-pink-400 mt-8 mb-4">Strategic Prioritization</h2>
      <p class="mb-4">If you have an A in Math but a C in History, you know exactly which homework to prioritize tonight. Use the MARGDARSHAK Grade Tracker to visualize this data.</p>
    `
  },
  {
    id: 'deep-work-for-students',
    title: 'The Power of Deep Work: Studying Less but Better',
    excerpt: 'Cal Newport’s concept of Deep Work changed the industry. Here is how students can apply it to finish homework in record time.',
    image: 'https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&q=80&w=1000',
    date: 'Oct 01, 2025',
    readTime: '6 min read',
    category: 'Productivity',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Deep Work is the ability to focus without distraction on a cognitively demanding task.</p>
      <h2 class="text-2xl font-bold text-indigo-400 mt-8 mb-4">The Equation</h2>
      <p class="mb-4"><strong>Work Produced = (Time Spent) x (Intensity of Focus)</strong>. If your intensity is low (checking phone every 5 mins), you have to spend huge amounts of time to get results. Increase intensity to decrease time.</p>
    `
  },
  {
    id: 'stop-procrastination-2-minute-rule',
    title: 'How to Stop Procrastinating: The 2-Minute Rule',
    excerpt: 'Struggling to start? This simple psychological trick will help you overcome the friction of starting difficult assignments.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1000',
    date: 'Sep 28, 2025',
    readTime: '3 min read',
    category: 'Psychology',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">The hardest part of any task is starting. The 2-Minute Rule states: "If it takes less than 2 minutes, do it now."</p>
      <h2 class="text-2xl font-bold text-red-400 mt-8 mb-4">For Bigger Tasks</h2>
      <p class="mb-4">Scale it down. Don't say "Write Essay." Say "Write the first sentence." Once you start, the momentum usually carries you forward.</p>
    `
  },
  {
    id: 'brain-food-snacks',
    title: '10 Healthy Snacks for Maximum Brain Power',
    excerpt: 'Your brain consumes 20% of your body’s energy. Fuel it right with these snacks designed for sustained focus during exam season.',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80&w=1000',
    date: 'Sep 25, 2025',
    readTime: '5 min read',
    category: 'Health',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Sugar crashes kill productivity. Swap the candy bar for these alternatives.</p>
      <ul class="list-disc pl-6 space-y-2 text-gray-300">
        <li><strong>Blueberries:</strong> High in antioxidants that improve communication between brain cells.</li>
        <li><strong>Dark Chocolate:</strong> Contains caffeine and antioxidants for a quick focus boost.</li>
        <li><strong>Walnuts:</strong> Packed with DHA, a type of Omega-3 fatty acid crucial for brain performance.</li>
      </ul>
    `
  },
  {
    id: 'sleep-hygiene-students',
    title: 'Why "Night Owls" Often Struggle (and How to Fix It)',
    excerpt: 'Sleep is when memory consolidation happens. If you are cutting sleep to study, you are actually learning less.',
    image: 'https://images.unsplash.com/photo-1541781777621-af2ea27520ce?auto=format&fit=crop&q=80&w=1000',
    date: 'Sep 20, 2025',
    readTime: '6 min read',
    category: 'Health',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Pulling all-nighters destroys the hippocampus function—the part of the brain responsible for creating new memories.</p>
      <h2 class="text-2xl font-bold text-teal-400 mt-8 mb-4">The 90-Minute Cycle</h2>
      <p class="mb-4">Sleep happens in 90-minute cycles. Waking up in the middle of deep sleep causes grogginess. Try to sleep in multiples of 90 minutes (6 hours, 7.5 hours, or 9 hours).</p>
    `
  },
  {
    id: 'email-professors-guide',
    title: 'How to Email Your Professor (Templates Included)',
    excerpt: 'Need an extension? Want to ask for a recommendation letter? Use these professional templates to get a "Yes."',
    image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=1000',
    date: 'Sep 15, 2025',
    readTime: '4 min read',
    category: 'Career',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Professional communication is a superpower. Here is the golden rule: Be brief, be polite, and identify yourself clearly.</p>
      <h2 class="text-2xl font-bold text-cyan-400 mt-8 mb-4">The Subject Line</h2>
      <p class="mb-4">Bad: "Question." <br/>Good: "Question about Midterm - [Course Name] - [Your Name]"</p>
      <h2 class="text-2xl font-bold text-cyan-400 mt-8 mb-4">Asking for an Extension</h2>
      <p class="mb-4">"Dear Professor X, I am writing to respectfully request a 24-hour extension on the paper due Tuesday. I have been managing a personal health issue..."</p>
    `
  },
  {
    id: 'budgeting-101-students',
    title: 'Budgeting 101: Managing Money in College',
    excerpt: 'Textbooks, food, and social life add up fast. Learn the 50/30/20 rule to manage your finances without living on just ramen.',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1000',
    date: 'Sep 10, 2025',
    readTime: '7 min read',
    category: 'Finance',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Financial stress is a huge distraction from studies. The 50/30/20 rule is a simple way to budget.</p>
      <ul class="list-disc pl-6 space-y-2 text-gray-300">
        <li><strong>50% Needs:</strong> Rent, tuition, groceries.</li>
        <li><strong>30% Wants:</strong> Dining out, Netflix, hobbies.</li>
        <li><strong>20% Savings:</strong> Emergency fund and future goals.</li>
      </ul>
    `
  },
  {
    id: 'best-apps-students-2025',
    title: 'Top 10 Apps Every Student Needs in 2025',
    excerpt: 'Beyond MARGDARSHAK: From citation generators to focus blockers, these tools will build your ultimate productivity tech stack.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000',
    date: 'Sep 05, 2025',
    readTime: '8 min read',
    category: 'Tech & Gear',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Technology can be a distraction or a superpower. Here are the essential apps.</p>
      <h2 class="text-2xl font-bold text-violet-400 mt-8 mb-4">1. Forest</h2>
      <p class="mb-4">Gamifies staying off your phone. Plant a virtual tree; if you leave the app, the tree dies.</p>
      <h2 class="text-2xl font-bold text-violet-400 mt-8 mb-4">2. Anki</h2>
      <p class="mb-4">The gold standard for flashcards using spaced repetition algorithms.</p>
      <h2 class="text-2xl font-bold text-violet-400 mt-8 mb-4">3. Wolfram Alpha</h2>
      <p class="mb-4">More than a calculator—it's a computational knowledge engine for math and science majors.</p>
    `
  },
  {
    id: 'morning-routines-success',
    title: 'The Morning Routines of Straight-A Students',
    excerpt: 'How you start your day determines how you finish it. We analyzed the habits of top performers to find the common threads.',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=1000',
    date: 'Sep 01, 2025',
    readTime: '5 min read',
    category: 'Productivity',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Success leaves clues. Here is what productive students do before 8 AM.</p>
      <ol class="list-decimal pl-6 space-y-2 text-gray-300">
        <li><strong>Hydrate Immediately:</strong> Your brain is dehydrated after sleep.</li>
        <li><strong>Review, Don't Study:</strong> Spend 10 minutes reviewing yesterday's notes to prime your brain.</li>
        <li><strong>Eat Protein:</strong> A carb-heavy breakfast leads to a mid-morning crash. Eggs or yogurt are better than sugary cereal.</li>
      </ol>
    `
  },
  {
    id: 'group-projects-leadership',
    title: 'How to Survive Group Projects (Without Doing All the Work)',
    excerpt: 'Group projects can be a nightmare. Learn leadership skills to delegate tasks effectively and deal with "social loafing."',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000',
    date: 'Aug 28, 2025',
    readTime: '6 min read',
    category: 'Soft Skills',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">The "freeloader" problem is real. Here is how to handle it professionally.</p>
      <h2 class="text-2xl font-bold text-yellow-400 mt-8 mb-4">Set Expectations Early</h2>
      <p class="mb-4">In the first meeting, create a written contract. "Who does what by when." If someone misses a deadline, refer to the agreement.</p>
      <h2 class="text-2xl font-bold text-yellow-400 mt-8 mb-4">Play to Strengths</h2>
      <p class="mb-4">Don't assign tasks randomly. The design student should do the slides; the English major should edit the text.</p>
    `
  },
  {
    id: 'coding-for-non-cs',
    title: 'Why Every Student Should Learn Basic Coding (Even Arts Majors)',
    excerpt: 'Python isn’t just for engineers. Automating boring tasks can save you hours of research and formatting time.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
    date: 'Aug 25, 2025',
    readTime: '5 min read',
    category: 'Skills',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Coding is the new literacy. You don't need to build apps, but knowing how to script can save your life.</p>
      <h2 class="text-2xl font-bold text-green-400 mt-8 mb-4">Automate Excel</h2>
      <p class="mb-4">Business majors can use Python to clean data instantly instead of manually editing thousands of rows.</p>
      <h2 class="text-2xl font-bold text-green-400 mt-8 mb-4">Logical Thinking</h2>
      <p class="mb-4">Programming teaches you how to break big problems into small, solvable steps—a skill useful in Philosophy, Law, and History too.</p>
    `
  },
  {
    id: 'internship-guide-2025',
    title: 'The Comprehensive Guide to Landing Your First Internship',
    excerpt: 'GPA isn’t everything. Recruiters care about projects and initiative. Here is how to build a resume with no experience.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1000',
    date: 'Aug 20, 2025',
    readTime: '9 min read',
    category: 'Career',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">The "experience paradox": you need experience to get a job, but you need a job to get experience.</p>
      <h2 class="text-2xl font-bold text-blue-500 mt-8 mb-4">Build Personal Projects</h2>
      <p class="mb-4">If you are a CS student, build a website. If you are a Marketing student, grow a social media page. Show, don't just tell.</p>
      <h2 class="text-2xl font-bold text-blue-500 mt-8 mb-4">Networking > Applying</h2>
      <p class="mb-4">80% of jobs aren't posted online. Reach out to alumni from your school on LinkedIn for a "virtual coffee chat."</p>
    `
  },
  {
    id: 'sq3r-reading-method',
    title: 'How to Read Textbooks: The SQ3R Method',
    excerpt: 'Stop highlighting everything. Use Survey, Question, Read, Recite, Review to actually retain complex academic texts.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000',
    date: 'Aug 15, 2025',
    readTime: '6 min read',
    category: 'Study Hacks',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Textbooks are dense. SQ3R is a framework to extract information efficiently.</p>
      <ul class="list-disc pl-6 space-y-2 text-gray-300">
        <li><strong>Survey:</strong> Skim headings and summaries first.</li>
        <li><strong>Question:</strong> Turn headings into questions (e.g., "What are the causes of WWI?").</li>
        <li><strong>Read:</strong> Read to find the answers to your questions.</li>
        <li><strong>Recite:</strong> Say the answer out loud.</li>
        <li><strong>Review:</strong> Go over your notes the next day.</li>
      </ul>
    `
  },
  {
    id: 'failure-growth-mindset',
    title: 'Why Failure is Part of the Process: Embracing Growth Mindset',
    excerpt: 'A failed test isn’t the end. It’s data. Learn how to analyze your mistakes to prevent them from happening again.',
    image: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&q=80&w=1000',
    date: 'Aug 10, 2025',
    readTime: '5 min read',
    category: 'Mental Health',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Carol Dweck's research shows that believing intelligence can be developed is the biggest predictor of success.</p>
      <h2 class="text-2xl font-bold text-rose-400 mt-8 mb-4">The "Not Yet" Philosophy</h2>
      <p class="mb-4">You didn't fail; you just haven't mastered it <em>yet</em>. Analyze your test paper. Did you fail because of a concept error, a calculation error, or reading the question wrong? Each requires a different fix.</p>
    `
  },
  {
    id: 'library-vs-cafe-study',
    title: 'Library vs. Cafe: Where Should You Study?',
    excerpt: 'Does background noise help or hurt? We look at the science of ambient noise and "coffee shop effect" on creativity vs. focus.',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&q=80&w=1000',
    date: 'Aug 05, 2025',
    readTime: '4 min read',
    category: 'Environment',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Your environment dictates your focus. The ideal spot depends on the task.</p>
      <h2 class="text-2xl font-bold text-amber-400 mt-8 mb-4">Cafe: For Creativity</h2>
      <p class="mb-4">Moderate ambient noise (70 decibels) enhances abstract thinking. Good for writing essays or brainstorming projects.</p>
      <h2 class="text-2xl font-bold text-amber-400 mt-8 mb-4">Library: For Deep Focus</h2>
      <p class="mb-4">For memorization or solving complex math problems, silence is golden. Any speech distraction disrupts your working memory.</p>
    `
  },
  {
    id: 'importance-of-extracurriculars',
    title: 'Why Extracurriculars Matter More Than You Think',
    excerpt: 'Colleges and employers want well-rounded humans, not just grade bots. How to choose activities that show leadership.',
    image: 'https://images.unsplash.com/photo-1526634338573-06900a8972ca?auto=format&fit=crop&q=80&w=1000',
    date: 'Aug 01, 2025',
    readTime: '6 min read',
    category: 'Career',
    author: 'ABHINAV JHA',
    content: `
      <p class="lead text-xl text-gray-300 mb-6">Being captain of the chess club shows dedication, strategy, and leadership.</p>
      <h2 class="text-2xl font-bold text-lime-400 mt-8 mb-4">Quality Over Quantity</h2>
      <p class="mb-4">It is better to have a leadership role in one club for 3 years than to be a passive member of 10 clubs. Show impact: "Raised $500" or "Organized an event for 50 people."</p>
    `
  }
];

// ==================================================================================
// COMPONENT CODE
// ==================================================================================

const BlogList = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Helmet>
        <title>Blog | MARGDARSHAK - Student Productivity & Tips</title>
        <meta name="description" content="Read expert articles on study techniques, academic productivity, mental health, and student life hacks to help you succeed." />
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
        {/* Placeholder for In-Feed Ad */}
        <AdUnit slot="9876543210" className="mb-12" /> 

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }} // Faster stagger
              className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image */}
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-60 z-10" />
                <img 
                  src={post.image} 
                  alt={post.title} 
                  loading="lazy"
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
        <p>© 2025 VSAV GYANTAPA. All rights reserved.</p>
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
        "url": "https://margdarshak.com/logo.png"
      }
    },
    "datePublished": post.date,
    "description": post.excerpt
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
