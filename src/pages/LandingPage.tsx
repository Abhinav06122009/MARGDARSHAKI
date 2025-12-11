import React, { useState, useEffect, useRef } from 'react'; // Removed Suspense/lazy imports
import { motion, useSpring, useTransform, useMotionValue, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Award, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import logo from "@/components/logo/logo.png";

// DIRECT IMPORTS (Fixes the "Failed to fetch dynamically imported module" error)
// We assume LandingPageSections.tsx exports these components as named exports
import { 
  Features, 
  Testimonials, 
  About, 
  Pricing, 
  CTA, 
  Footer 
} from './LandingPageSections';

const AnimatedGradientText = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <span 
      className={`bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-[length:200%_auto] bg-clip-text text-transparent ${className}`}
      style={{ animation: 'gradient 5s linear infinite' }}
    >
      {children}
    </span>
  );
};

const MagneticButton = ({ children, className = '', ...props }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current && isHovering) {
        const button = ref.current.getBoundingClientRect();
        const centerX = button.left + button.width / 2;
        const centerY = button.top + button.height / 2;
        const deltaX = e.pageX - centerX;
        const deltaY = e.pageY - centerY;
        
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        if (distance < 100) {
          x.set(deltaX * 0.4);
          y.set(deltaY * 0.4);
        } else {
          x.set(0);
          y.set(0);
        }
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovering, x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); x.set(0); y.set(0); }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`text-white sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? 'py-3 bg-black/70 backdrop-blur-xl border-white/10' : 'py-4 bg-transparent border-transparent'}`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="MARGDARSHAK Logo" className="h-10 w-10 rounded-lg" />
            <h1 className="text-2xl font-bold tracking-wider text-white">MARGDARSHAK</h1>
        </Link>
        
        <ul className="hidden md:flex items-center space-x-8">
            <li>
                <Link to="/calculator" className="text-gray-300 hover:text-white transition-colors">Tools</Link>
            </li>
            <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
            </li>
            {['features', 'testimonials', 'about'].map(item => (
            <li key={item}>
                <a href={`${item}`} className="capitalize text-gray-300 hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                </a>
            </li>
            ))}
        </ul>

        <div className="flex gap-4">
            <Link to="/auth" className="text-white font-medium py-3 px-4 hover:text-emerald-400 transition-colors">
                Login
            </Link>
            <MagneticButton>
                <Link to="/auth" className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:shadow-lg hover:shadow-emerald-500/40 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300">
                Get Started
                </Link>
            </MagneticButton>
        </div>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.section 
      id="home" 
      style={{ scale, opacity }}
      className="relative text-white text-center px-6 overflow-hidden h-screen flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-grid-white/[0.07] z-0"></div>
      <div className="relative z-10 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6"
      >
        <AnimatedGradientText>Unlock Your Academic Potential</AnimatedGradientText>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10"
      >
        MARGDARSHAK is the all-in-one, AI-powered student management system designed to streamline your studies.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <MagneticButton>
          <Link to="/auth" className="inline-flex items-center gap-3 bg-white text-gray-900 font-bold py-4 px-10 rounded-xl text-lg shadow-2xl shadow-emerald-500/30 group hover:bg-emerald-50 transition-colors">
            Start Learning Now <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </MagneticButton>
        
        <Link to="/calculator" className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md text-white font-bold py-4 px-10 rounded-xl text-lg border border-white/20 hover:bg-white/20 transition-all">
            Try Calculator
        </Link>
      </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20"
        >
          {[
            { icon: Users, value: '50K+', label: 'Active Students' },
            { icon: Award, value: '98%', label: 'Success Rate' },
            { icon: TrendingUp, value: '4.9/5', label: 'User Rating' },
            { icon: Zap, value: '24/7', label: 'Support' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1, type: "spring" }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4"
            >
              <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

const ParticleBackground = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; }> = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(147, 197, 253, 0.5)';
      
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#0A0A0A]">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.1),rgba(255,255,255,0))]"></div>
    </div>
  );
});

const LandingPage = () => {
  return (
    <div className="bg-[#0A0A0A] min-h-screen font-sans text-white">
      <ParticleBackground />
      <Header />
      <main className="relative z-10">
        <Hero />
        {/* Removed Suspense wrapper as components are now direct imports */}
        <Features />
        <Testimonials />
        <About />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
