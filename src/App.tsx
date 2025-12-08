import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { supabase } from '@/integrations/supabase/client';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LandingPage from './pages/LandingPage';
import ResetPasswordPage from './pages/reset-password';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import SitemapPage from './pages/SitemapPage';
import BlogPage from './pages/BlogPage';
import { CursorProvider } from '@/lib/CursorContext';
import { Session } from '@supabase/supabase-js';

// Import additional page components for direct routing
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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Settings from "@/components/settings/Settings";
import { Button } from '@/components/ui/button';

// --- NEW IMPORTS FOR ADSENSE COMPLIANCE ---
import AdSenseScript from "@/components/AdSenseScript";
import CookieConsent from "@/components/CookieConsent";

// SEO Component for dynamic head tags
const PageHelmet = ({ title, description }: { title: string, description: string }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta name="robots" content="index, follow" />
  </Helmet>
);

const helmetData = {
  landing: { title: "MARGDARSHAK: The Ultimate Student Planner & Learning Platform", description: "MARGDARSHAK is the all-in-one student management system for online learning. Boost productivity with our task manager, timetable creator, grade tracker, and note-taking app." },
  auth: { title: "MARGDARSHAK Student Portal", description: "Access your MARGDARSHAK student dashboard. Your central hub for online education, project management software, and academic progress tracking." },
  dashboard: { title: "Student Dashboard | MARGDARSHAK", description: "Your personal student dashboard. Get an overview of your class schedule, project tasks, and academic progress on our online learning platform. The best student dashboard for productivity." },
  calculator: { title: "Free Online Scientific Calculator | MARGDARSHAK Tools", description: "Use our free online scientific calculator for algebra, calculus, and more. No login required. Features standard and scientific modes." },
  blog: { title: "Study Tips & Academic Resources | MARGDARSHAK Blog", description: "Read the latest study tips, productivity hacks, and academic advice from the MARGDARSHAK team. Improve your grades and time management." }
};

// Add styles function (if needed)
const addAppStyles = () => {
  if (document.getElementById('app-styles')) {
    return;
  }
};

// React Query client setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('auth')) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Page animation variants and transitions
const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  in: { opacity: 1, y: 0, scale: 1 },
  out: { opacity: 0, y: -20, scale: 0.98 }
};

const pageTransitions = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.4
};

// Wrapper component for animated routes
const AnimatedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  React.useEffect(() => {
    addAppStyles();
  }, []);

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

// Centralized Auth Provider
const AuthContext = React.createContext<{ session: Session | null; loading: boolean }>({ session: null, loading: true });

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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

// Updated ProtectedRoute to use the AuthContext
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !session) {
      navigate('/auth', { replace: true });
    }
  }, [session, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return session ? <>{children}</> : null;
};

// New Navbar component
const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold cursor-pointer" onClick={() => navigate('/dashboard')}>
          MARGDARSHAK
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
          <Button variant="ghost" onClick={() => navigate('/courses')}>Courses</Button>
          <Button variant="ghost" onClick={() => navigate('/tasks')}>Tasks</Button>
          <Button variant="ghost" onClick={() => navigate('/settings')}>Settings</Button>
          <Button variant="destructive" onClick={handleLogout} className="ml-4">Logout</Button>
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
        <div className="md:hidden mt-4">
          <Button variant="ghost" className="block w-full text-left" onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}>Dashboard</Button>
          <Button variant="ghost" className="block w-full text-left" onClick={() => { navigate('/courses'); setIsMobileMenuOpen(false); }}>Courses</Button>
          <Button variant="ghost" className="block w-full text-left" onClick={() => { navigate('/tasks'); setIsMobileMenuOpen(false); }}>Tasks</Button>
          <Button variant="ghost" className="block w-full text-left" onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }}>Settings</Button>
          <Button variant="destructive" className="block w-full text-left mt-2" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>Logout</Button>
        </div>
      )}
    </nav>
  );
};

// New ProtectedLayout to wrap authenticated pages
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar /> {/* This provides navigation for authenticated users */}
      <main>{children}</main>
    </div>
  );
};

// Main app content with routes
const AppContent = () => {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  return (
    <>
      <AnimatedRoute>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <AdSenseScript /> {/* Load ads on public Landing Page */}
                <PageHelmet title={helmetData.landing.title} description={helmetData.landing.description} />
                <LandingPage />
              </>
            }
          />
          <Route
            path="/auth"
            element={
              <>
                {/* No AdSenseScript here - Login page must be ad-free */}
                <PageHelmet title={helmetData.auth.title} description={helmetData.auth.description} />
                <Index />
              </>
            }
          />
          
          {/* === PUBLIC TOOLS (Crucial for AdSense) === */}
          <Route
            path="/calculator"
            element={
              <>
                <AdSenseScript /> {/* Load ads on Calculator */}
                <PageHelmet title={helmetData.calculator.title} description={helmetData.calculator.description} />
                <Calculator /> 
              </>
            }
          />
          
          {/* === BLOG ROUTES (Crucial for AdSense "Content") === */}
          <Route 
            path="/blog/*" 
            element={
              <>
                  <AdSenseScript /> {/* Load ads on Blog */}
                  <PageHelmet title={helmetData.blog.title} description={helmetData.blog.description} />
                  <BlogPage />
              </>
            } 
          />

          {/* === PROTECTED ROUTES (No Ads here) === */}
          <Route path="/dashboard" element={<ProtectedRoute>
                <ProtectedLayout>
                  <PageHelmet title={helmetData.dashboard.title} description={helmetData.dashboard.description} />
                  <Dashboard onNavigate={handleNavigate} />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <PageHelmet title="Academic Progress | MARGDARSHAK" description="Track your academic progress." />
                  <ProgressTracker />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/grades"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <PageHelmet title="Grade Tracker | MARGDARSHAK" description="Track your grades." />
                  <Grades />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <PageHelmet title="Attendance | MARGDARSHAK" description="Track your attendance." />
                  <Attendance />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <PageHelmet title="Tasks | MARGDARSHAK" description="Manage your tasks." />
                  <Tasks />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <PageHelmet title="Notes | MARGDARSHAK" description="Manage your notes." />
                  <Notes />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/timer"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <PageHelmet title="Study Timer | MARGDARSHAK" description="Focus timer." />
                  <StudyTimer />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <PageHelmet title="Calendar | MARGDARSHAK" description="Academic calendar." />
                  <Calendar />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/timetable"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <PageHelmet title="Timetable | MARGDARSHAK" description="Class timetable." />
                  <Timetable />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <PageHelmet title="Courses | MARGDARSHAK" description="Manage courses." />
                  <CourseManagement />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/syllabus"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <PageHelmet title="Syllabus | MARGDARSHAK" description="View syllabus." />
                  <Syllabus />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <PageHelmet title="Resources | MARGDARSHAK" description="Educational resources." />
                  <Resources />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />

          {/* Legal Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route
            path="/terms"
            element={
              <>
                <PageHelmet title="Terms and Conditions | MARGDARSHAK" description="Terms and Conditions." />
                <TermsAndConditions />
              </>
            }
          />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />

          {/* Settings Route */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <PageHelmet title="Settings | MARGDARSHAK" description="Settings." />
                  <Settings />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Help & Support Route */}
          <Route
            path="/help"
            element={
              <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex items-center justify-center">
                <PageHelmet
                  title="Help & Support | MARGDARSHAK"
                  description="Get help and support."
                />
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md border border-white/10">
                  <h1 className="text-2xl font-bold text-white mb-4">💡 Help & Support</h1>
                  <p className="text-white/80 mb-6">Need assistance? Contact the MARGDARSHAK support team.</p>
                  <div className="space-y-4">
                    <a 
                      href="mailto:contact@margdarshak.com" 
                      className="block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all"
                    >
                      📧 Email Support
                    </a>
                    <button 
                      onClick={handleBackToDashboard}
                      className="block w-full bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={
            <>
              <PageHelmet title="404: Page Not Found | MARGDARSHAK" description="Page not found." />
              <NotFound />
            </>
          } />
        </Routes>
      </AnimatedRoute>
      
      {/* Cookie Consent Banner placed outside AnimatedRoute to prevent re-rendering on page changes */}
      <CookieConsent />
    </>
  );
};

// Main App component export
const App = () => {
  return (
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
};

export default App;
