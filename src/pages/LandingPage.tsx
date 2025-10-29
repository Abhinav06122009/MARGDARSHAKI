import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, useAnimation, useSpring, useTransform, useMotionValue, useScroll, useInView as useFramerInView } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { BarChart, BookOpen, Calendar, CheckSquare, Cpu, Shield, Zap, Star, MessageSquare, ArrowRight, Twitter, Linkedin, Github } from 'lucide-react';
import logo from "@/components/logo/logo.png";

const Features = lazy(() => import('./LandingPageSections').then(module => ({ default: module.Features })));
const Testimonials = lazy(() => import('./LandingPageSections').then(module => ({ default: module.Testimonials })));
const About = lazy(() => import('./LandingPageSections').then(module => ({ default: module.About })));
const Pricing = lazy(() => import('./LandingPageSections').then(module => ({ default: module.Pricing })));
const CTA = lazy(() => import('./LandingPageSections').then(module => ({ default: module.CTA })));
const Footer = lazy(() => import('./LandingPageSections').then(module => ({ default: module.Footer })));

// ====================================================================================
// NEW & ENHANCED COMPONENTS (Inspired by reference)
// ====================================================================================

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
        const maxDistance = 100;
        const strength = 0.4;

        if (distance < maxDistance) {
          const factor = 1 - distance / maxDistance;
          x.set(deltaX * factor * strength);
          y.set(deltaY * factor * strength);
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

const SectionWrapper = ({ children, id, className = '' }: { children: React.ReactNode, id: string, className?: string }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  React.useEffect(() => {
    if (inView) { controls.start('visible'); }
  }, [controls, inView]);

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] } }
      }}
      className={`py-20 md:py-28 px-6 relative ${className}`}
    >
      {children}
    </motion.section>
  );
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`text-white sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? 'py-3 bg-black/70 backdrop-blur-xl border-white/10' : 'py-4 bg-transparent border-transparent'}`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="MARGDARSHAK Logo" className="h-10 w-10 rounded-lg" />
          <h1 className="text-2xl font-bold tracking-wider text-white">MARGDARSHAK</h1>
        </div>
        <ul className="hidden md:flex items-center space-x-8">
          {['home', 'features', 'testimonials', 'about'].map(item => (
            <li key={item}>
              <a href={`#${item}`} className="capitalize text-gray-300 hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden md:block">
          <MagneticButton>
            <Link to="/auth" className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:shadow-lg hover:shadow-emerald-500/40 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 button-interactive button-glow relative overflow-hidden shimmer-effect button-nova">
              Get Started
            </Link>
          </MagneticButton>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 px-6 pb-4">
          <ul className="flex flex-col items-center space-y-4">
            {['home', 'features', 'testimonials', 'about'].map(item => (
              <li key={item}>
                <a href={`#${item}`} onClick={() => setIsMobileMenuOpen(false)} className="capitalize text-gray-300 hover:text-white transition-colors relative group">
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-center">
            <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:shadow-lg hover:shadow-emerald-500/40 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 button-interactive button-glow relative overflow-hidden shimmer-effect button-nova">
              Get Started
            </Link>
          </div>
        </div>
      )}
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
        MARGDARSHAK is the all-in-one, AI-powered student management system designed to streamline your studies. Use our task manager, schedule maker, and grade tracker to boost productivity and secure your academic journey.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6, type: 'spring', stiffness: 150 }}
      >
        <MagneticButton>
          <Link to="/auth" className="inline-flex items-center gap-3 bg-white text-gray-900 font-bold py-4 px-10 rounded-xl text-lg shadow-2xl shadow-emerald-500/30 button-interactive relative overflow-hidden shimmer-effect button-nova group">
            Start Learning Now <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </MagneticButton>
        </motion.div>

        {/* Stats Section */}
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

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <motion.div animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1 h-2 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="text-center mb-16">
    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h2>
    <p className="text-lg text-gray-400 max-w-2xl mx-auto">{subtitle}</p>
    <motion.div      
      className="w-24 h-1 bg-blue-500 mx-auto mt-4 rounded-full"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1, transition: { duration: 0.8, ease: 'easeOut' } }}
      viewport={{ once: true }}
    />
  </div>
);

import { Users, Award, TrendingUp } from 'lucide-react';


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

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        const dxMouse = mouseX - particle.x;
        const dyMouse = mouseY - particle.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        const maxDist = 150;

        if (distMouse < maxDist) {
          const force = (maxDist - distMouse) / maxDist;
          particle.vx -= (dxMouse / distMouse) * force * 0.1;
          particle.vy -= (dyMouse / distMouse) * force * 0.1;
        }

        particle.vx *= 0.99; // friction
        particle.vy *= 0.99; // friction
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(147, 197, 253, 0.5)'; // blue-300 with 50% opacity
        ctx.fill();

        particles.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(147, 197, 253, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-[#0A0A0A]">
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
        <Suspense fallback={<div className="h-screen" />}>
          <Features />
          <Testimonials />
          <About />
          <Pricing />
          <CTA />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default LandingPage;
