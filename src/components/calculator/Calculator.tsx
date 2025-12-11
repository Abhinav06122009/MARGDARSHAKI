import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import logo from "@/components/logo/logo.png";
import { Link } from 'react-router-dom';
import { BookOpen, HelpCircle, Calculator as CalcIcon, Settings, RotateCcw } from 'lucide-react';

interface CalculatorProps {
  onBack?: () => void;
}

type CalculatorMode = 'scientific' | 'standard';
type ThemeMode = 'light' | 'dark' | 'neon';import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { BarChart, BookOpen, Calendar, Cpu, Shield, Zap, Star, MessageSquare, Twitter, Linkedin, Github, CheckCircle2, Clock, Target, TrendingUp, Users } from 'lucide-react';
import logo from "@/components/logo/logo.png";

// ... (Keep existing components: SectionWrapper, cardVariants, TiltCard, SectionHeader) ...
// For brevity, assuming you have the helper components above. If you copy-paste, ensure they are present.

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

// --- SECTIONS ---

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
            <li><Link to="/terms" className="hover:text-emerald-400 transition-colors">Cookie Policy</Link></li>
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

interface CalculatorButton {
  label: string;
  type: 'number' | 'operation' | 'equals' | 'decimal' | 'clear' | 'function' | 'memory' | 'scientific' | 'mode';
  className: string;
  span?: number;
  value?: string;
}

interface CalculationStep {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

const Calculator: React.FC<CalculatorProps> = ({ onBack }) => {
  // --- STATE ---
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState<CalculationStep[]>([]);
  const [mode, setMode] = useState<CalculatorMode>('scientific');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [showHistory, setShowHistory] = useState(false);
  const [angleUnit, setAngleUnit] = useState<'deg' | 'rad'>('deg');
  
  // --- THEMES ---
  const themes = useMemo(() => ({
    light: {
      background: 'bg-gradient-to-br from-blue-50 via-white to-gray-100',
      card: 'bg-white/90 shadow-xl',
      display: 'bg-gray-50/95',
      text: 'text-gray-900',
      accent: 'blue-500',
      functionBtn: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      numberBtn: 'bg-white hover:bg-gray-50 text-gray-900',
      operationBtn: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
      card: 'bg-gray-800/90 shadow-xl border border-gray-700',
      display: 'bg-gray-900/95 text-white',
      text: 'text-white',
      accent: 'blue-400',
      functionBtn: 'bg-gray-700 hover:bg-gray-600 text-white',
      numberBtn: 'bg-gray-800 hover:bg-gray-700 text-white',
      operationBtn: 'bg-blue-600 hover:bg-blue-500 text-white'
    },
    neon: {
      background: 'bg-black',
      card: 'bg-black/90 shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-purple-500/30',
      display: 'bg-gray-900/95 text-purple-400 font-mono',
      text: 'text-purple-100',
      accent: 'purple-500',
      functionBtn: 'bg-gray-900 border border-purple-500/30 text-purple-300 hover:bg-purple-900/20',
      numberBtn: 'bg-gray-900 border border-purple-500/30 text-white hover:bg-purple-900/20',
      operationBtn: 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/50'
    }
  }), []);

  const currentTheme = themes[theme];

  // --- LOGIC ---
  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const inputValue = parseFloat(display);
    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    setWaitingForNewValue(true);
    setOperation(op);
  };

  const calculate = (a: number, b: number, op: string) => {
    switch(op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(previousValue, inputValue, operation);
      
      // Save to history
      const newHistoryItem: CalculationStep = {
        id: Date.now().toString(),
        expression: `${previousValue} ${operation} ${inputValue}`,
        result: String(result),
        timestamp: new Date()
      };
      setHistory([newHistoryItem, ...history].slice(0, 10)); // Keep last 10
      
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  // --- BUTTONS CONFIG ---
  const buttons = [
    { label: 'C', type: 'clear', className: currentTheme.functionBtn },
    { label: '(', type: 'function', className: currentTheme.functionBtn },
    { label: ')', type: 'function', className: currentTheme.functionBtn },
    { label: '÷', type: 'operation', className: currentTheme.operationBtn },
    { label: '7', type: 'number', className: currentTheme.numberBtn },
    { label: '8', type: 'number', className: currentTheme.numberBtn },
    { label: '9', type: 'number', className: currentTheme.numberBtn },
    { label: '×', type: 'operation', className: currentTheme.operationBtn },
    { label: '4', type: 'number', className: currentTheme.numberBtn },
    { label: '5', type: 'number', className: currentTheme.numberBtn },
    { label: '6', type: 'number', className: currentTheme.numberBtn },
    { label: '-', type: 'operation', className: currentTheme.operationBtn },
    { label: '1', type: 'number', className: currentTheme.numberBtn },
    { label: '2', type: 'number', className: currentTheme.numberBtn },
    { label: '3', type: 'number', className: currentTheme.numberBtn },
    { label: '+', type: 'operation', className: currentTheme.operationBtn },
    { label: '0', type: 'number', className: `${currentTheme.numberBtn} col-span-2` },
    { label: '.', type: 'decimal', className: currentTheme.numberBtn },
    { label: '=', type: 'equals', className: currentTheme.operationBtn },
  ];

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} flex flex-col relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className={`absolute top-20 left-20 w-72 h-72 bg-${currentTheme.accent} rounded-full filter blur-3xl`}></div>
        <div className={`absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl`}></div>
      </div>

      <div className="max-w-2xl mx-auto p-4 flex-grow flex flex-col justify-center relative z-10 w-full">
        {/* Nav Header */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="outline" className="backdrop-blur-md border-white/20 hover:bg-white/10">
              Back Home
            </Button>
          </Link>
          <div className="flex gap-2">
            {['light', 'dark', 'neon'].map((t) => (
              <button 
                key={t}
                onClick={() => setTheme(t as ThemeMode)}
                className={`w-8 h-8 rounded-full border-2 ${theme === t ? `border-${currentTheme.accent}` : 'border-transparent'} bg-${t === 'light' ? 'white' : t === 'neon' ? 'black' : 'gray-800'}`}
              />
            ))}
          </div>
        </div>

        {/* Calculator Body */}
        <Card className={`${currentTheme.card} border-0 rounded-3xl overflow-hidden backdrop-blur-xl`}>
          <CardHeader className="p-6 pb-2">
            <div className={`text-right text-4xl font-light p-4 rounded-xl mb-4 ${currentTheme.display} min-h-[80px] break-all`}>
              {display}
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-4 gap-3">
              {buttons.map((btn, idx) => (
                <Button
                  key={idx}
                  onClick={() => {
                    if (btn.type === 'number') handleNumber(btn.label);
                    if (btn.type === 'operation') handleOperation(btn.label);
                    if (btn.type === 'equals') handleEquals();
                    if (btn.type === 'clear') handleClear();
                  }}
                  className={`h-16 text-xl rounded-2xl shadow-sm transition-all hover:scale-105 active:scale-95 ${btn.className} ${btn.label === '0' ? 'col-span-2' : ''}`}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* History Toggle */}
        <div className="mt-4 text-center">
          <Button variant="ghost" onClick={() => setShowHistory(!showHistory)} className="text-white/60 hover:text-white">
            <RotateCcw className="w-4 h-4 mr-2" /> 
            {showHistory ? 'Hide History' : 'Show History'}
          </Button>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl p-4 max-h-40 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-center text-sm opacity-50">No history yet</p>
            ) : (
              history.map((step) => (
                <div key={step.id} className="flex justify-between text-sm py-1 border-b border-white/5 last:border-0">
                  <span className="opacity-60">{step.expression}</span>
                  <span className="font-bold">{step.result}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* --- SEO CONTENT SECTION (CRITICAL FOR ADSENSE) --- */}
      <div className="max-w-4xl mx-auto mt-16 mb-12 px-6 text-gray-300 relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <CalcIcon className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Free Online Scientific Calculator</h1>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Master Complex Math Problems Instantly</h2>
              <p className="leading-relaxed text-white/80">
                Welcome to the MARGDARSHAK Free Online Scientific Calculator. Designed for students, engineers, and professionals, 
                this tool allows you to perform advanced mathematical operations directly from your browser. Whether you are solving 
                algebraic equations, calculating trigonometric functions for physics, or handling statistical data, our calculator 
                provides precision and speed without the need for downloads.
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-black/20 p-5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Standard Features</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-white/70">
                  <li><strong>Basic Arithmetic:</strong> Addition, subtraction, multiplication, and division with high precision.</li>
                  <li><strong>Percentages:</strong> Quickly calculate discounts, tips, and interest rates.</li>
                  <li><strong>Memory Bank:</strong> Store and recall numbers (M+, M-, MR) for multi-step problems.</li>
                </ul>
              </div>
              <div className="bg-black/20 p-5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Scientific Features</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-white/70">
                  <li><strong>Trigonometry:</strong> Sin, Cos, Tan, and their inverse functions (in Degrees or Radians).</li>
                  <li><strong>Advanced Math:</strong> Logarithms (Log, Ln), Exponentials (x², x³), and Square Roots.</li>
                  <li><strong>Constants:</strong> Built-in values for Pi (π) and Euler's number (e).</li>
                </ul>
              </div>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Why Use Our Calculator?</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2.5"></div>
                  <p className="text-white/80"><strong>Accessible Anywhere:</strong> Works on all devices—iPhone, Android, iPad, Windows, and Mac. No installation required.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2.5"></div>
                  <p className="text-white/80"><strong>Completely Private:</strong> All calculations are processed locally in your browser. We never store or track your mathematical data.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2.5"></div>
                  <p className="text-white/80"><strong>Eye-Friendly Themes:</strong> Switch between Light, Dark, and Neon modes to reduce eye strain during late-night study sessions.</p>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5"/> Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <h4 className="font-bold text-white text-sm mb-1">How do I switch between Degrees and Radians?</h4>
                  <p className="text-sm text-white/60">Use the "Settings" gear icon or the toggle button labeled 'DEG/RAD' to switch your angle mode for trigonometric calculations.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h4 className="font-bold text-white text-sm mb-1">Is this calculator free to use?</h4>
                  <p className="text-sm text-white/60">Yes, the MARGDARSHAK calculator is 100% free for educational and professional use.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer className="mt-8 py-8 border-t border-white/10 text-center text-sm opacity-60">
        <div className="flex items-center justify-center gap-2 mb-2">
            <img src={logo} alt="Logo" className="w-6 h-6 grayscale opacity-80" />
            <span className="font-semibold tracking-wider">MARGDARSHAK</span>
        </div>
        <p>© {new Date().getFullYear()} VSAV GYANTAPA. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Calculator;
