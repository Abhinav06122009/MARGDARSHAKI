import React from 'react';
import { Helmet, HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { TooltipProvider } from "@/components/ui/tooltip";
import { CursorProvider } from '@/lib/CursorContext';
import { Toaster } from "@/components/ui/toaster";

// --- PAGE IMPORTS ---
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import LandingPage from '@/pages/LandingPage';
import ResetPasswordPage from '@/pages/reset-password';
import AboutUsPage from '@/pages/AboutUsPage';
import ContactUsPage from '@/pages/ContactUsPage';
import SitemapPage from '@/pages/SitemapPage';
import BlogPage from '@/pages/BlogPage';
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsAndConditions from "@/pages/TermsAndConditions";

// --- PUBLIC TOOLS & FEATURES ---
import Calculator from "@/components/calculator/Calculator";
import Resources from "@/components/resources/Resources";
import InterviewPrep from "@/components/interview/InterviewPrep";
import CareerPathways from "@/components/career/CareerPathways";

// --- DASHBOARD COMPONENTS ---
import Dashboard from "@/components/dashboard/Dashboard";
import ProgressTracker from "@/components/progress/ProgressTracker";
import Grades from "@/components/grades/Grades";
import Attendance from "@/components/attendance/Attendance";
import Tasks from "@/components/tasks/Tasks";
import Notes from "@/components/notes/Notes";
import StudyTimer from "@/components/timer/StudyTimer";
import Calendar from "@/components/calendar/CalendarPage";
import Timetable from "@/components/timetable/Timetable";
import CourseManagement from "@/components/courses/CourseManagement";
import Syllabus from "@/components/syllabus/Syllabus";
import Settings from "@/components/settings/Settings";

// --- UTILS ---
import { Button } from '@/components/ui/button';
import AdSenseScript from "@/components/AdSenseScript";
import CookieConsent from "@/components/CookieConsent";

// SEO Component
const PageHelmet = ({ title, description }: { title: string, description: string }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <link rel="canonical" href={window.location.href} />
  </Helmet>
);

// Styles
const addAppStyles = () => {
  if (document.getElementById('app-styles')) return;
};

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1, refetchOnWindowFocus: false },
  },
});

// Animations
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
      <motion.div key={location.pathname} initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransitions} className="page-transition">
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Auth Context
const AuthContext = React.createContext<{ session: Session | null; loading: boolean }>({ session: null, loading: true });
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session); setLoading(false); });
    return () => subscription.unsubscribe();
  }, []);
  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>;
};
const useAuth = () => React.useContext(AuthContext);

// --- GLOBAL NAVBAR (VISIBLE THROUGHOUT) ---
const Navbar = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/auth'); };

  return (
    <nav className="bg-gray-900 border-b border-white/10 text-white p-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="container mx-auto flex justify-between items-center">
        <div 
          className="text-xl font-bold cursor-pointer bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity" 
          onClick={() => navigate(session ? '/dashboard' : '/')}
        >
          MARGDARSHAK
        </div>
        <div className="hidden md:flex space-x-4">
          {session ? (
            <>
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="hover:bg-white/10">Dashboard</Button>
              <Button variant="ghost" onClick={() => navigate('/tasks')} className="hover:bg-white/10">Tasks</Button>
              <Button variant="destructive" size="sm" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/')} className="hover:bg-white/10">Home</Button>
              <Button variant="ghost" onClick={() => navigate('/blog')} className="hover:bg-white/10">Blog</Button>
              <Button variant="default" size="sm" onClick={() => navigate('/auth')} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">Login</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// Layouts
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#0A0A0A]">
    <Navbar />
    <main>{children}</main>
  </div>
);

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#0A0A0A]">
    <Navbar />
    <main>{children}</main>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => { if (!loading && !session) navigate('/auth', { replace: true }); }, [session, loading, navigate]);
  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  return session ? <>{children}</> : null;
};

// --- APP CONTENT ---
const AppContent = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => navigate(`/${page}`);

  return (
    <>
      <AnimatedRoute>
        <Routes>
          {/* Public Routes (AdSense Enabled + PublicLayout) */}
          <Route path="/" element={<><AdSenseScript /><PageHelmet title="MARGDARSHAK" description="Student Planner" /><LandingPage /></>} />
          <Route path="/auth" element={<><PageHelmet title="Login" description="Login" /><Index /></>} />
          
          <Route path="/calculator" element={<PublicLayout><AdSenseScript /><PageHelmet title="Scientific Calculator" description="Free online calculator" /><Calculator /></PublicLayout>} />
          <Route path="/resources" element={<PublicLayout><AdSenseScript /><PageHelmet title="Resources" description="Study materials" /><Resources onBack={() => navigate('/')} /></PublicLayout>} />
          <Route path="/interview" element={<PublicLayout><AdSenseScript /><PageHelmet title="Interview Prep" description="Interview guide" /><InterviewPrep onBack={() => navigate('/')} /></PublicLayout>} />
          <Route path="/career" element={<PublicLayout><AdSenseScript /><PageHelmet title="Career Pathways" description="Career guide" /><CareerPathways onBack={() => navigate('/')} /></PublicLayout>} />
          <Route path="/blog/*" element={<PublicLayout><AdSenseScript /><PageHelmet title="Blog" description="Student blog" /><BlogPage /></PublicLayout>} />

          {/* Legal Pages */}
          <Route path="/sitemap" element={<PublicLayout><SitemapPage /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><TermsAndConditions /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutUsPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactUsPage /></PublicLayout>} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><ProtectedLayout><PageHelmet title="Dashboard" description="Student dashboard" /><Dashboard onNavigate={handleNavigate} /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><ProtectedLayout><Tasks /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><ProtectedLayout><CourseManagement /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/grades" element={<ProtectedRoute><ProtectedLayout><Grades /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><ProtectedLayout><ProgressTracker /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><ProtectedLayout><Attendance /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><ProtectedLayout><Notes /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/timer" element={<ProtectedRoute><ProtectedLayout><StudyTimer /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><ProtectedLayout><Calendar /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/timetable" element={<ProtectedRoute><ProtectedLayout><Timetable /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/syllabus" element={<ProtectedRoute><ProtectedLayout><Syllabus /></ProtectedLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><ProtectedLayout><Settings /></ProtectedLayout></ProtectedRoute>} />
          
          <Route path="/help" element={<div className="min-h-screen bg-black text-white flex items-center justify-center p-8"><h1>Help Center</h1><Button onClick={() => navigate('/dashboard')} className="ml-4">Back</Button></div>} />
          <Route path="*" element={<><PageHelmet title="404" description="Page not found" /><NotFound /></>} />
        </Routes>
      </AnimatedRoute>
      <CookieConsent />
      <Toaster />
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CursorProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider><AppContent /></AuthProvider>
          </BrowserRouter>
        </CursorProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
