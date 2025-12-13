import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { supabase } from '@/integrations/supabase/client';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Session } from '@supabase/supabase-js';

// --- PAGE IMPORTS ---
import Index from "@/pages/Index"; // Login
import NotFound from "@/pages/NotFound";
import LandingPage from '@/pages/LandingPage';
import ResetPasswordPage from '@/pages/reset-password';
import AboutUsPage from '@/pages/AboutUsPage';
import ContactUsPage from '@/pages/ContactUsPage';
import SitemapPage from '@/pages/SitemapPage';
import FeaturesPage from '@/pages/FeaturesPage';
import TestimonialsPage from '@/pages/TestimonialsPage';
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsAndConditions from "@/pages/TermsAndConditions";
import BlogPage from "@/pages/BlogPage"; // Restore Blog
import HelpPage from "@/pages/HelpPage"; // Restore Help
import AdminMessages from "@/pages/AdminMessages"; // Restore Admin

// --- COMPONENT IMPORTS ---
import Dashboard from "@/components/dashboard/Dashboard";
import ProgressTracker from "@/components/progress/ProgressTracker";
import Grades from "@/components/grades/Grades";
import Attendance from "@/components/attendance/Attendance";
import Tasks from "@/components/tasks/Tasks";
import Notes from "@/components/notes/Notes";
import StudyTimer from "@/components/timer/StudyTimer";
import Calculator from "@/components/calculator/Calculator";
import Calendar from "@/components/calendar/CalendarPage";
import Timetable from "@/components/timetable/Timetable";
import CourseManagement from "@/components/courses/CourseManagement";
import Syllabus from "@/components/syllabus/Syllabus";
import Resources from "@/components/resources/Resources";
import Settings from "@/components/settings/Settings";
import { Button } from '@/components/ui/button';
import AdSenseScript from '@/components/AdSenseScript';
import CookieConsent from '@/components/CookieConsent'; // IMPORT COOKIE CONSENT
import { CursorProvider } from '@/lib/CursorContext';

// --- SEO COMPONENT ---
const PageHelmet = ({ title, description }: { title: string, description: string }) => {
  const location = useLocation();
  // Canonical tag prevents "Duplicate Content" errors
  const canonicalUrl = `https://margdarshan.tech${location.pathname === '/' ? '' : location.pathname}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

const helmetData = {
  landing: { title: "MARGDARSHAK: The Ultimate Student Planner & Learning Platform", description: "MARGDARSHAK is the all-in-one student management system. Boost productivity with our task manager, timetable creator, and grade tracker." },
  auth: { title: "Student Login | MARGDARSHAK", description: "Access your MARGDARSHAK student dashboard. Your central hub for online education." },
  dashboard: { title: "Student Dashboard | MARGDARSHAK", description: "Your personal student dashboard. Get an overview of your class schedule and academic progress." },
  calculator: { title: "Free Online Scientific Calculator | MARGDARSHAK", description: "Use our free online scientific calculator for students. Supports trigonometry, logarithms, and advanced math functions." },
  timer: { title: "Free Pomodoro Study Timer | MARGDARSHAK", description: "Boost focus with our free online Pomodoro study timer. Custom intervals for effective learning." },
  contact: { title: "Contact Us | MARGDARSHAK", description: "Get in touch with the MARGDARSHAK team for support, feedback, or inquiries." },
  help: { title: "Help Center | MARGDARSHAK", description: "Frequently asked questions and support for MARGDARSHAK users." },
  admin: { title: "Admin Inbox | MARGDARSHAK", description: "View and manage contact form submissions." },
  progress: { title: "Academic Progress", description: "Track your study progress." },
  grades: { title: "Grade Tracker", description: "Manage your grades and GPA." },
  attendance: { title: "Attendance Tracker", description: "Keep track of your class attendance." },
  tasks: { title: "Task Manager", description: "Manage your academic tasks and to-dos." },
  notes: { title: "Digital Notes", description: "Create and organize your study notes." },
  calendar: { title: "Academic Calendar", description: "View your schedule and important dates." },
  timetable: { title: "Class Timetable", description: "Manage your weekly class schedule." },
  courses: { title: "Course Management", description: "Overview of your enrolled courses." },
  syllabus: { title: "Syllabus Tracker", description: "Track your syllabus coverage." },
  resources: { title: "Study Resources", description: "Access educational materials." },
};

const addAppStyles = () => { if (document.getElementById('app-styles')) return; };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  in: { opacity: 1, y: 0, scale: 1 },
  out: { opacity: 0, y: -20, scale: 0.98 }
};

const pageTransitions = { type: "tween", ease: "easeInOut", duration: 0.4 };

const AnimatedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  React.useEffect(() => { addAppStyles(); }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransitions}
        className="page-transition"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const AuthContext = React.createContext<{ session: Session | null; loading: boolean }>({ session: null, loading: true });

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => React.useContext(AuthContext);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !session) {
      navigate('/auth', { replace: true });
    }
  }, [session, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  return session ? <>{children}</> : null;
};

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold cursor-pointer bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent" onClick={() => navigate('/dashboard')}>
          MARGDARSHAK
        </div>
        <div className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="hover:text-emerald-400">Dashboard</Button>
          <Button variant="ghost" onClick={() => navigate('/courses')} className="hover:text-emerald-400">Courses</Button>
          <Button variant="ghost" onClick={() => navigate('/tasks')} className="hover:text-emerald-400">Tasks</Button>
          <Button variant="ghost" onClick={() => navigate('/admin/messages')} className="hover:text-emerald-400">Inbox</Button>
          <Button variant="ghost" onClick={() => navigate('/settings')} className="hover:text-emerald-400">Settings</Button>
          <Button variant="destructive" onClick={handleLogout} className="ml-4 bg-red-600/20 text-red-400 hover:bg-red-600/30">Logout</Button>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2" aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 bg-gray-900 p-4 rounded-lg border border-gray-800">
          <Button variant="ghost" className="block w-full text-left mb-2" onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}>Dashboard</Button>
          <Button variant="ghost" className="block w-full text-left mb-2" onClick={() => { navigate('/admin/messages'); setIsMobileMenuOpen(false); }}>Inbox</Button>
          <Button variant="ghost" className="block w-full text-left mb-2" onClick={() => { navigate('/courses'); setIsMobileMenuOpen(false); }}>Courses</Button>
          <Button variant="ghost" className="block w-full text-left mb-2" onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }}>Settings</Button>
          <Button variant="destructive" className="block w-full text-left mt-4" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>Logout</Button>
        </div>
      )}
    </nav>
  );
};

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="p-4">{children}</main>
    </div>
  );
};

const AppContent = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => navigate(`/${page}`);

  return (
    <>
      <AdSenseScript />
      <AnimatedRoute>
        <Routes>
          {/* ================= PUBLIC ROUTES (AdSense & Bots Must See These) ================= */}
          <Route path="/" element={<><PageHelmet title={helmetData.landing.title} description={helmetData.landing.description} /><LandingPage /></>} />
          <Route path="/auth" element={<><PageHelmet title={helmetData.auth.title} description={helmetData.auth.description} /><Index /></>} />
          
          <Route path="/features" element={<><PageHelmet title="Features | MARGDARSHAK" description="Explore our student tools." /><FeaturesPage /></>} />
          <Route path="/testimonials" element={<><PageHelmet title="Success Stories | MARGDARSHAK" description="Student reviews." /><TestimonialsPage /></>} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<><PageHelmet title={helmetData.contact.title} description={helmetData.contact.description} /><ContactUsPage /></>} />
          <Route path="/help" element={<><PageHelmet title={helmetData.help.title} description={helmetData.help.description} /><HelpPage /></>} />
          
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          
          <Route path="/blog/*" element={<BlogPage />} />

          {/* Tools MUST be public for AdSense */}
          <Route path="/calculator" element={<><PageHelmet title={helmetData.calculator.title} description={helmetData.calculator.description} /><Calculator /></>} />
          <Route path="/timer" element={<><PageHelmet title={helmetData.timer.title} description={helmetData.timer.description} /><StudyTimer /></>} />

          {/* ================= PROTECTED ROUTES (Dashboard) ================= */}
          <Route path="/admin/messages" element={<ProtectedRoute><ProtectedLayout><PageHelmet title={helmetData.admin.title} description={helmetData.admin.description} /><AdminMessages /></ProtectedLayout></ProtectedRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute><ProtectedLayout><PageHelmet title={helmetData.dashboard.title} description={helmetData.dashboard.description} /><Dashboard onNavigate={handleNavigate} /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><ProtectedLayout><ProgressTracker /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/grades" element={<ProtectedRoute><ProtectedLayout><Grades /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><ProtectedLayout><Attendance /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><ProtectedLayout><Tasks /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><ProtectedLayout><Notes /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><ProtectedLayout><Calendar /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/timetable" element={<ProtectedRoute><ProtectedLayout><Timetable /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><ProtectedLayout><CourseManagement /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/syllabus" element={<ProtectedRoute><ProtectedLayout><Syllabus /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><ProtectedLayout><Resources /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><ProtectedLayout><Settings /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<><PageHelmet title="404 Not Found" description="Page not found" /><NotFound /></>} />
        </Routes>
      </AnimatedRoute>
    </>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CursorProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AuthProvider>
                <AppContent />
                <Toaster />
                <Sonner />
                <CookieConsent /> {/* <<< THIS FIXES PRIVACY SCORE >>> */}
              </AuthProvider>
            </BrowserRouter>
          </CursorProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
