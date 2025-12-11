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

// --- FEATURE IMPORTS (CRITICAL: These must be imported to be used in Routes) ---
import Calculator from "@/components/calculator/Calculator";
import Resources from "@/components/resources/Resources";
import InterviewPrep from "@/components/interview/InterviewPrep";
import CareerPathways from "@/components/career/CareerPathways";

// --- DASHBOARD IMPORTS ---
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

// --- UTILITY IMPORTS ---
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !session) navigate('/auth');
  }, [session, loading, navigate]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  return session ? <>{children}</> : null;
};

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/auth'); };
  return (
    <nav className="bg-gray-900 border-b border-white/10 text-white p-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold cursor-pointer bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent" onClick={() => navigate('/dashboard')}>
          MARGDARSHAK
        </div>
        <div className="hidden md:flex space-x-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
          <Button variant="destructive" size="sm" onClick={handleLogout}>Logout</Button>
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

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* --- PUBLIC ROUTES (ADS ENABLED) --- */}
          <Route path="/" element={<><AdSenseScript /><PageHelmet title="MARGDARSHAK" description="Student Planner." /><LandingPage /></>} />
          <Route path="/auth" element={<><PageHelmet title="Login" description="Login." /><Index /></>} />
          
          {/* THE CALCULATOR ROUTE - This is likely where your error was originating if imports were missing */}
          <Route 
            path="/calculator" 
            element={
              <>
                <AdSenseScript />
                <PageHelmet title="Scientific Calculator" description="Free online calculator." />
                <Calculator /> 
              </>
            } 
          />
          
          <Route path="/resources" element={<><AdSenseScript /><PageHelmet title="Resources" description="Free study materials." /><Resources onBack={() => navigate('/')} /></>} />
          <Route path="/interview" element={<><AdSenseScript /><PageHelmet title="Interview Prep" description="Mock interviews." /><InterviewPrep onBack={() => navigate('/')} /></>} />
          <Route path="/career" element={<><AdSenseScript /><PageHelmet title="Career Pathways" description="Career guidance." /><CareerPathways onBack={() => navigate('/')} /></>} />
          <Route path="/blog/*" element={<><AdSenseScript /><PageHelmet title="Blog" description="Study tips." /><BlogPage /></>} />
          
          {/* --- LEGAL PAGES --- */}
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* --- PROTECTED ROUTES --- */}
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
          
          <Route path="/help" element={<div className="p-8 text-white bg-black min-h-screen"><h1>Help Center</h1><Button onClick={() => navigate('/dashboard')}>Back</Button></div>} />
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
