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

// --- PAGES ---
import LandingPage from './pages/LandingPage';
import Index from "./pages/Index"; // Auth Page
import NotFound from "./pages/NotFound";
import SitemapPage from './pages/SitemapPage';
import BlogPage from './pages/BlogPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import ResetPasswordPage from './pages/reset-password';

// --- TOOLS & FEATURES (PUBLIC) ---
import Calculator from "@/components/calculator/Calculator";
import Resources from "@/components/resources/Resources";
import InterviewPrep from "@/components/interview/InterviewPrep";
import CareerPathways from "@/components/career/CareerPathways";

// --- DASHBOARD (PRIVATE) ---
import Dashboard from "@/components/dashboard/Dashboard";
import Tasks from "@/components/tasks/Tasks";
import CourseManagement from "@/components/courses/CourseManagement";
import Grades from "@/components/grades/Grades";
import ProgressTracker from "@/components/progress/ProgressTracker";
import Attendance from "@/components/attendance/Attendance";
import Notes from "@/components/notes/Notes";
import StudyTimer from "@/components/timer/StudyTimer";
import Calendar from "@/components/calendar/CalendarPage";
import Timetable from "@/components/timetable/Timetable";
import Syllabus from "@/components/syllabus/Syllabus";
import Settings from "@/components/settings/Settings";

// --- UTILS ---
import { Button } from '@/components/ui/button';
import AdSenseScript from "@/components/AdSenseScript";
import CookieConsent from "@/components/CookieConsent";

// Enhanced SEO Component
const PageHelmet = ({ title, description }: { title: string, description: string }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <link rel="canonical" href={window.location.href} />
  </Helmet>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Authentication Context
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

  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>;
};

const useAuth = () => React.useContext(AuthContext);

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !session) {
      navigate('/auth');
    }
  }, [session, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return session ? <>{children}</> : null;
};

// Application Navigation
const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <nav className="bg-gray-900 border-b border-white/10 text-white p-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="container mx-auto flex justify-between items-center">
        <div 
          className="text-xl font-bold cursor-pointer bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity" 
          onClick={() => navigate('/dashboard')}
        >
          MARGDARSHAK
        </div>
        <div className="hidden md:flex space-x-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="hover:bg-white/10">Dashboard</Button>
          <Button variant="ghost" onClick={() => navigate('/tasks')} className="hover:bg-white/10">Tasks</Button>
          <Button variant="destructive" size="sm" onClick={handleLogout} className="shadow-md">Logout</Button>
        </div>
      </div>
    </nav>
  );
};

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#0A0A0A]">
    <Navbar />
    <main>{children}</main>
  </div>
);

// Main Content with Routes
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* --- PUBLIC ROUTES (AdSense Enabled + Rich SEO) --- */}
          <Route 
            path="/" 
            element={
              <>
                <AdSenseScript />
                <PageHelmet 
                  title="MARGDARSHAK: The Ultimate Student Planner & Learning Platform" 
                  description="Boost your academic success with MARGDARSHAK. All-in-one student management system featuring grade tracking, task management, and free educational tools." 
                />
                <LandingPage />
              </>
            } 
          />
          
          <Route 
            path="/auth" 
            element={
              <>
                <PageHelmet title="Login to MARGDARSHAK" description="Access your personalized student dashboard." />
                <Index />
              </>
            } 
          />
          
          <Route 
            path="/calculator" 
            element={
              <>
                <AdSenseScript />
                <PageHelmet 
                  title="Free Scientific Calculator Online | MARGDARSHAK Tools" 
                  description="Use our free online scientific calculator for algebra, calculus, and trigonometry. Features standard, scientific, and graphing modes for students." 
                />
                <Calculator />
              </>
            } 
          />
          
          <Route 
            path="/resources" 
            element={
              <>
                <AdSenseScript />
                <PageHelmet 
                  title="Free Educational Resources Library | Study Notes & Worksheets" 
                  description="Download free PDF study notes, printable worksheets, and exam preparation guides for CBSE, ICSE, and competitive exams." 
                />
                <Resources onBack={() => navigate('/')} />
              </>
            } 
          />
          
          <Route 
            path="/interview" 
            element={
              <>
                <AdSenseScript />
                <PageHelmet 
                  title="Interview Preparation Guide 2025 | Mock Questions & Tips" 
                  description="Prepare for your next job interview with our comprehensive guide. Practice technical coding questions, HR answers, and aptitude tests." 
                />
                <InterviewPrep onBack={() => navigate('/')} />
              </>
            } 
          />
          
          <Route 
            path="/career" 
            element={
              <>
                <AdSenseScript />
                <PageHelmet 
                  title="Career Pathways & Guidance | Roadmaps for Students" 
                  description="Explore detailed career roadmaps, salary insights, and skill requirements for high-growth fields like AI, Engineering, and Management." 
                />
                <CareerPathways onBack={() => navigate('/')} />
              </>
            } 
          />
          
          <Route 
            path="/blog/*" 
            element={
              <>
                <AdSenseScript />
                <PageHelmet 
                  title="Student Success Blog | Study Tips & Productivity" 
                  description="Read the latest articles on effective study techniques, time management hacks, and exam strategies for students." 
                />
                <BlogPage />
              </>
            } 
          />
          
          {/* --- LEGAL & UTILITY PAGES --- */}
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* --- PROTECTED ROUTES (NO ADS) --- */}
          <Route path="/dashboard" element={<ProtectedRoute><ProtectedLayout><Dashboard onNavigate={(p) => navigate(`/${p}`)} /></ProtectedLayout></ProtectedRoute>} />
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
          
          <Route 
            path="/help" 
            element={
              <div className="p-8 text-white bg-black min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4">Help Center</h1>
                <p className="mb-6 text-gray-400">Need assistance? Reach out to our support team.</p>
                <Button onClick={() => navigate('/contact')}>Contact Support</Button>
                <Button variant="ghost" className="mt-4" onClick={() => navigate('/')}>Back Home</Button>
              </div>
            } 
          />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
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
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </BrowserRouter>
        </CursorProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
