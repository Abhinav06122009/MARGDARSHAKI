import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { BarChart, BookOpen, Calendar, Cpu, Shield, Zap, Star, MessageSquare, Twitter, Linkedin, Github, CheckCircle2, Clock, Target, TrendingUp, Users } from 'lucide-react';
import logo from "@/components/logo/logo.png";

// Helper components inside the same file for easier import
const SectionWrapper = ({ children, id, className = '' }: { children: React.ReactNode, id: string, className?: string }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  React.useEffect(() => { if (inView) { controls.start('visible'); } }, [controls, inView]);
  return <motion.section id={id} ref={ref} initial="hidden" animate={controls} variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }} className={`py-20 md:py-28 px-6 relative ${className}`}>{children}</motion.section>;
};

const TiltCard = ({ icon, title, description }: any) => (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);

const SectionHeader = ({ title, subtitle }: any) => (
    <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">{subtitle}</p>
    </div>
);

export const Features = () => (
  <SectionWrapper id="features" className="bg-black/20">
    <div className="container mx-auto">
      <SectionHeader title="Everything You Need to Succeed" subtitle="A comprehensive suite of tools designed to elevate your learning experience." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        <TiltCard icon={<Cpu size={32} className="text-blue-400"/>} title="AI-Powered Dashboard" description="Get instant insights with a smart dashboard that tracks your productivity score." />
        <TiltCard icon={<Zap size={32} className="text-yellow-400"/>} title="Task Management" description="Organize your academic life. Prioritize assignments and never miss a deadline." />
        <TiltCard icon={<BarChart size={32} className="text-green-400"/>} title="Grade Analytics" description="Visualize your study habits and track grade distribution to identify strengths." />
        <TiltCard icon={<BookOpen size={32} className="text-purple-400"/>} title="Course Hub" description="Manage all your courses, from materials to schedules, in one centralized location." />
        <TiltCard icon={<Calendar size={32} className="text-red-400"/>} title="Smart Timetable" description="Stay on top of your schedule with an intelligent timetable for upcoming classes." />
        <TiltCard icon={<Shield size={32} className="text-emerald-400"/>} title="Secure Data" description="Your data is protected with enterprise-grade security and zero-trust architecture." />
      </div>
    </div>
  </SectionWrapper>
);

export const Testimonials = () => (
  <SectionWrapper id="testimonials">
    <div className="container mx-auto">
      <SectionHeader title="Loved by Students" subtitle="Hear what our users have to say about MARGDARSHAK." />
      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <div className="flex gap-1 text-yellow-400 mb-4"><Star className="fill-yellow-400 w-4 h-4"/><Star className="fill-yellow-400 w-4 h-4"/><Star className="fill-yellow-400 w-4 h-4"/><Star className="fill-yellow-400 w-4 h-4"/><Star className="fill-yellow-400 w-4 h-4"/></div>
                <p className="text-gray-300 mb-4">"This platform completely changed how I organize my studies. The grade tracker is a lifesaver!"</p>
                <p className="text-white font-bold">- Student User</p>
            </div>
        ))}
      </div>
    </div>
  </SectionWrapper>
);

export const About = () => (
  <SectionWrapper id="about" className="bg-black/20">
    <div className="container mx-auto text-center max-w-4xl">
      <SectionHeader title="About MARGDARSHAK" subtitle="Our Mission" />
      <div className="text-lg text-gray-300 space-y-6">
        <p>MARGDARSHAK is a revolutionary platform meticulously engineered to make learning more engaging, effective, and accessible for everyone.</p>
        <p>Our mission is to empower students with the tools they need to thrive in the digital age. We fuse user-friendly interfaces with powerful analytics to create a holistic academic ecosystem.</p>
      </div>
    </div>
  </SectionWrapper>
);

export const Pricing = () => (
    <SectionWrapper id="pricing">
        <div className="container mx-auto">
            <SectionHeader title="Simple Pricing" subtitle="Start for free, upgrade for more." />
            <div className="flex justify-center">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl border border-emerald-500/50 max-w-sm w-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">FREE FOREVER</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Student Basic</h3>
                    <div className="text-4xl font-bold text-white mb-6">₹0<span className="text-sm text-gray-400 font-normal">/mo</span></div>
                    <ul className="space-y-3 mb-8 text-gray-300">
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400"/> Task Manager</li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400"/> Grade Tracker</li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400"/> Basic Timetable</li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400"/> Access to Resources</li>
                    </ul>
                    <Link to="/auth">
                        <button className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors">Get Started</button>
                    </Link>
                </div>
            </div>
        </div>
    </SectionWrapper>
);

export const CTA = () => (
  <section className="relative bg-gray-900 py-32 px-6 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
    <div className="container mx-auto relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Ready to Transform Your Academic Journey?
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          Join 50,000+ students who are already achieving their goals with MARGDARSHAK.
        </p>
        <Link 
          to="/auth"
          className="inline-block px-12 py-5 bg-white text-gray-900 font-bold rounded-xl text-xl hover:shadow-2xl hover:shadow-white/20 transition-all transform hover:scale-105"
        >
          Start Free Today
        </Link>
    </div>
  </section>
);

// --- UPDATED FOOTER ---
export const Footer = () => (
  <footer className="bg-black/90 border-t border-white/10 text-gray-400 py-16 px-6">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="MARGDARSHAK Logo" className="h-10 w-10 rounded-lg" />
            <p className="font-bold text-xl text-white tracking-wider">MARGDARSHAK</p>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            Your trusted digital guide to academic excellence. Empowering the next generation of learners with advanced tools and resources.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5"/></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5"/></a>
            <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5"/></a>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Platform</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/calculator" className="hover:text-emerald-400 transition-colors">Scientific Calculator</Link></li>
            <li><Link to="/resources" className="hover:text-emerald-400 transition-colors">Resource Library</Link></li>
            <li><Link to="/interview" className="hover:text-emerald-400 transition-colors">Interview Prep</Link></li>
            <li><Link to="/career" className="hover:text-emerald-400 transition-colors">Career Pathways</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Support</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/help" className="hover:text-emerald-400 transition-colors">Help Center</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
            <li><Link to="/sitemap" className="hover:text-emerald-400 transition-colors">Sitemap</Link></li>
            <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} MARGDARSHAK. Developed & Maintained by VSAV GYANTAPA.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
            <span>Made with ❤️ in India</span>
        </div>
      </div>
    </div>
  </footer>
);
