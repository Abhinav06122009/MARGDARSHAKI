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

// --- PAGES ---
import Index from "@/pages/Index"; 
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
import BlogPage from "@/pages/BlogPage"; // CONNECTED
import HelpPage from "@/pages/HelpPage";   // CONNECTED
import AdminMessages from "@/pages/AdminMessages"; // CONNECTED

// --- COMPONENTS ---
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
import AdSenseScript from '@/components/AdSenseScript';
import CookieConsent from '@/components/CookieConsent'; // CONNECTED
import { CursorProvider } from '@/lib/CursorContext';

const PageHelmet = ({ title, description }: { title: string, description: string }) => {
  const location = useLocation();
  const canonicalUrl = `https://margdarshan.tech${location.pathname === '/' ? '' : location.pathname}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

const helmetData = {
  landing: { title: "MARGDARSHAK: The Ultimate Student Planner", description: "All-in-one student management system. Boost productivity with our task manager, timetable creator, and grade tracker." },
  auth: { title: "Student Login | MARGDARSHAK", description: "Access your MARGDARSHAK dashboard." },
  dashboard: { title: "Student Dashboard", description: "Overview of your academic progress." },
  calculator: { title: "Free Scientific Calculator", description: "Online scientific calculator for students." },
  timer: { title: "Pomodoro Study Timer", description: "Boost focus with our study timer." },
  contact: { title: "Contact Us", description: "Get in touch with MARGDARSHAK support." },
  blog: { title: "Student Blog", description: "Study tips and academic advice." },
  help: { title: "Help Center", description: "FAQs and support." }
};

const addAppStyles = () => { if (document.getElementById('app-styles')) return; };
const queryClient = new QueryClient();

const pageVariants = { initial: { opacity: 0 }, in: { opacity: 1 }, out: { opacity: 0 } };
const AnimatedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  React.useEffect(() => { addAppStyles(); }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} initial="initial" animate="in" exit="out" variants={pageVariants}>
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
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session); setLoading(false); });
    return () => subscription.unsubscribe();
  }, []);
  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>;
};
const useAuth = () => React.useContext(AuthContext);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => { if (!loading && !session) navigate('/auth', { replace: true }); }, [session, loading, navigate]);
  if (loading) return <div>Loading...</div>;
  return session ? <>{children}</> : null;
};

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/auth'); };
  return (
    <nav className="bg-gray-900 border-b border-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold cursor-pointer" onClick={() => navigate('/dashboard')}>MARGDARSHAK</div>
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
          <Button variant="ghost" onClick={() => navigate('/admin/messages')}>Inbox</Button>
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </nav>
  );
};

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#0A0A0A] text-white">
    <Navbar />
    <main className="p-4">{children}</main>
  </div>
);

const AppContent = () => (
  <>
    <AdSenseScript />
    <AnimatedRoute>
      <Routes>
        {/* --- PUBLIC ROUTES (AdSense Safe) --- */}
        <Route path="/" element={<><PageHelmet title={helmetData.landing.title} description={helmetData.landing.description} /><LandingPage /></>} />
        <Route path="/auth" element={<><PageHelmet title={helmetData.auth.title} description={helmetData.auth.description} /><Index /></>} />
        
        {/* Blog & Tools (MUST BE PUBLIC) */}
        <Route path="/blog/*" element={<BlogPage />} />
        <Route path="/calculator" element={<><PageHelmet title={helmetData.calculator.title} description={helmetData.calculator.description} /><Calculator /></>} />
        <Route path="/timer" element={<><PageHelmet title={helmetData.timer.title} description={helmetData.timer.description} /><StudyTimer /></>} />
        
        {/* Content Pages */}
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<><PageHelmet title={helmetData.contact.title} description={helmetData.contact.description} /><ContactUsPage /></>} />
        <Route path="/help" element={<><PageHelmet title={helmetData.help.title} description={helmetData.help.description} /><HelpPage /></>} />
        
        {/* Legal */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/sitemap" element={<SitemapPage />} />

        {/* --- PROTECTED ROUTES --- */}
        <Route path="/dashboard" element={<ProtectedRoute><ProtectedLayout><PageHelmet title={helmetData.dashboard.title} description={helmetData.dashboard.description} /><Dashboard /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/admin/messages" element={<ProtectedRoute><ProtectedLayout><AdminMessages /></ProtectedLayout></ProtectedRoute>} />
        
        {/* Dashboard Features */}
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatedRoute>
  </>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CursorProvider>
          <BrowserRouter>
            <AuthProvider>
              <AppContent />
              <Toaster />
              <Sonner />
              <CookieConsent /> {/* <<< COOKIE CONSENT ENABLED >>> */}
            </AuthProvider>
          </BrowserRouter>
        </CursorProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
