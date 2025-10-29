import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, Shield, ArrowUp, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardData } from '@/hooks/useDashboardData';
import { handleBulkActions, handleExportSelected } from '@/lib/dashboardUtils';
import { taskService } from '@/components/tasks/taskService';
import type { DashboardProps, RealTask } from '@/types/dashboard';
import InteractiveBackground from '@/lib/InteractiveBackground';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import CommandPalette from '@/components/ui/CommandPalette';
import DashboardSkeleton from './DashboardSkeleton';
import DashboardHeader from './DashboardHeader';
import WelcomeHeader from './WelcomeHeader';
import StatsGrid from './StatsGrid'; // This component might need updates if it's not dynamic
import TasksPanel from './TasksPanel';
import AnalyticsPanel from './AnalyticsPanel';
import QuickActions from './QuickActions';
import SecurityPanel from './SecurityPanel';
import type { RealTask } from '@/types/dashboard';
import FeatureSpotlightModal from '@/components/ui/FeatureSpotlightModal';

// Social Icons
const GitHubLogo = () => (
  <svg viewBox="0 0 16 16" className="w-5 h-5 fill-current">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

const TwitterLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.323-1.325z"/>
  </svg>
);

/**
 * The main dashboard component, serving as the central hub for the user's academic and personal data.
 * It integrates various panels for tasks, analytics, and quick actions, providing a comprehensive overview.
 * Features include real-time data sync, a command palette, and a highly secure, user-isolated environment.
 */
const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const {
    currentUser,
    stats,
    recentTasks,
    analytics,
    loading,
    securityDashboardData,
    activeThreats,
    securityVerified,
    isOnline,
    refreshing,
    handleRefresh,
    handleCreateQuickTask,
    setRecentTasks, // Added to allow manual state updates
    handleTaskStatusUpdate,
    handleExportData,
    ultimateSecurityData, // Added from your request
  } = useDashboardData();
  
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isFeatureSpotlightOpen, setIsFeatureSpotlightOpen] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'name'>('date');
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Command Palette listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Feature spotlight listener
  useEffect(() => {
    const hasSeenSpotlight = localStorage.getItem('margdarshak_dashboard_spotlight_v1');
    if (!hasSeenSpotlight) {
      setIsFeatureSpotlightOpen(true);
    }
  }, []);

  // Back to top button listener
  useEffect(() => {
    const checkScrollTop = () => {
      if (window.pageYOffset > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  const activeTasks = useMemo(() => {
    if (!recentTasks) return [];
    return recentTasks.filter(task => !task.is_deleted);
  }, [recentTasks]);

  // Create a new stats object that is always in sync with the client-side task list.
  const dashboardStats = useMemo(() => {
    if (!stats) return null;

    const completedTasks = activeTasks.filter(t => t.status === 'completed').length;
    const totalTasks = activeTasks.length;
    const productivityScore = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      ...stats,
      totalTasks: totalTasks,
      completedTasks: completedTasks,
      productivityScore: productivityScore,
    };
  }, [stats, activeTasks]);

  // Task filtering and sorting logic
  const filteredTasks = useMemo(() => {
    if (!activeTasks) {
      return [];
    }

    let filtered = [...activeTasks];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower)) ||
        (task.courses?.name && task.courses.name.toLowerCase().includes(searchLower))
      );
    }

    switch (taskFilter) {
      case 'pending':
        filtered = filtered.filter(task => task.status === 'pending');
        break;
      case 'completed':
        filtered = filtered.filter(task => task.status === 'completed');
        break;
      case 'overdue':
        filtered = filtered.filter(task => 
          task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
        );
        break;
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        case 'name':
          return a.title.localeCompare(b.title);
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [activeTasks, searchTerm, taskFilter, sortBy]);

  const taskPriorityAnalytics = useMemo(() => {
    if (!activeTasks) return { high: 0, medium: 0, low: 0, other: 0 };
    return activeTasks.reduce((acc, task) => {
        if (task.status === 'completed') {
            const priority = task.priority || 'other';
            if (acc[priority as keyof typeof acc] !== undefined) {
              acc[priority as keyof typeof acc]++;
            } else {
              acc.other++;
            }
        }
        return acc;
    }, { high: 0, medium: 0, low: 0, other: 0 });
  }, [activeTasks]);

  const taskCompletionTrend = useMemo(() => {
    if (!activeTasks) return [];
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const completionsByDay: Record<string, number> = last7Days.reduce((acc, date) => {
        acc[date] = 0;
        return acc;
    }, {});

    activeTasks.forEach(task => {
        if (task.status === 'completed' && task.updated_at) {
            const completionDate = new Date(task.updated_at).toISOString().split('T')[0];
            if (completionsByDay[completionDate] !== undefined) {
                completionsByDay[completionDate]++;
            }
        }
    });

    return last7Days.map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
        completed: completionsByDay[date]
    }));
  }, [activeTasks]);

  const categoryAnalytics = useMemo(() => {
    if (!activeTasks) return [];
    const categories = taskService.getTaskCategories();
    const categoryMap = categories.reduce((acc, cat) => {
        acc[cat.id] = { name: cat.name, color: cat.color, total: 0, completed: 0, timeSpent: 0 };
        return acc;
    }, {} as Record<string, { name: string; color: string; total: number; completed: number; timeSpent: number; }>);

    activeTasks.forEach(task => {
        const cat = categoryMap[task.category] || categoryMap['general'];
        if (cat) {
            cat.total++;
            if (task.status === 'completed') cat.completed++;
            cat.timeSpent += task.time_spent || 0;
        }
    });

    return Object.values(categoryMap).filter(cat => cat.total > 0).map(cat => ({ ...cat, completionRate: cat.total > 0 ? (cat.completed / cat.total) * 100 : 0, timeSpent: Math.round(cat.timeSpent / 60) }));
  }, [activeTasks]);

  const confirmDeleteTask = useCallback((taskId: string) => {
    setModalState({
      isOpen: true,
      title: 'Delete Task',
      message: 'Are you sure you want to permanently delete this task? This action cannot be undone.',
      onConfirm: async () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
        const { error } = await handleBulkActions('delete', [taskId]);
        if (!error) {
          // Optimistically update the UI by marking the task as deleted locally
          setRecentTasks(prev => 
            prev?.map(t => t.id === taskId ? { ...t, is_deleted: true } : t) || null
          );
          await handleRefresh(); // Sync with server state
        }
      },
    });
  }, [handleRefresh]);

  const confirmBulkDelete = useCallback(() => {
    if (selectedTasks.length === 0) return;
    setModalState({
      isOpen: true,
      title: `Delete ${selectedTasks.length} Tasks`,
      message: `Are you sure you want to permanently delete these ${selectedTasks.length} tasks? This action cannot be undone.`,
      onConfirm: async () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
        const tasksToDelete = new Set(selectedTasks);
        const { error } = await handleBulkActions('delete', selectedTasks);
        setSelectedTasks([]);
        if (!error) {
          // Optimistically update the UI by marking tasks as deleted locally
          setRecentTasks(prev => 
            prev?.map(t => tasksToDelete.has(t.id) ? { ...t, is_deleted: true } : t) || null
          );
          await handleRefresh(); // Sync with server state
        }
      },
    });
  }, [selectedTasks, handleRefresh]);

  const handleSelectAllTasks = () => {
    if (selectedTasks.length === filteredTasks.length) {
      // If all are selected, deselect all
      setSelectedTasks([]);
    } else {
      // Otherwise, select all filtered tasks
      setSelectedTasks(filteredTasks.map(task => task.id));
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCloseSpotlight = () => {
    localStorage.setItem('margdarshak_dashboard_spotlight_v1', 'true');
    setIsFeatureSpotlightOpen(false);
  };

  // Loading state
  if (loading || !securityVerified || !dashboardStats) {
    return (
      // Wrap skeleton in a div with the base background color to prevent flashes of other content during loading.
      <div className="min-h-screen bg-[#0A0A0A] w-full">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
        <motion.div
          className="bg-white/5 backdrop-blur-md rounded-3xl p-12 border border-red-400/20 text-center relative z-10 max-w-md mx-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-white/70 mb-8">Please log in to access your secure dashboard.</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-white/60">
            <Shield className="w-4 h-4" />
            <span>All data is securely encrypted and user-isolated</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-300 relative overflow-x-hidden transition-colors duration-300 [transform-style:preserve-3d] animate-gradient">
      {/* Ultimate Background Effects */}
      <InteractiveBackground />

      {/* Feature Spotlight Modal */}
      <FeatureSpotlightModal isOpen={isFeatureSpotlightOpen} onClose={handleCloseSpotlight} />

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 p-4 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full text-emerald-400 shadow-lg hover:bg-emerald-500/30 hover:scale-110 transition-all duration-300"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            whileHover={{ scale: 1.1, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            title="Back to Top"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onAction={async (action) => {
          if (action.startsWith('navigate:')) {
            onNavigate(action.replace('navigate:', ''));
            return;
          }

          if (action === 'logout') {
            supabase.auth.signOut();
          } else if (action === 'createTask') {
            await handleCreateQuickTask();
          }
        }}
      />
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
      />
      <div className="relative z-10 p-6" style={{ transform: 'perspective(2000px)' }}>
        <div className="max-w-7xl mx-auto">
          <DashboardHeader
            currentUser={currentUser}
            isOnline={isOnline}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onExport={handleExportData}
            onOpenFeatureSpotlight={() => setIsFeatureSpotlightOpen(true)}
            extraActions={
              <motion.button
                onClick={() => onNavigate('upgrade')}
                className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 px-5 py-2 font-bold text-white shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:shadow-yellow-500/50 active:scale-95"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Star className="w-4 h-4 transition-transform duration-300 group-hover:scale-125 mr-2 z-10" />
                <span className="relative z-10">Upgrade</span>
              </motion.button>
            }
          />
          <WelcomeHeader
            fullName={currentUser.profile?.full_name}
            totalTasks={dashboardStats.totalTasks}
            totalCourses={dashboardStats.totalCourses}
            totalStudySessions={dashboardStats.totalStudySessions}
          />
          <StatsGrid stats={dashboardStats} />

          {/* Security Panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <SecurityPanel 
              dashboardData={ultimateSecurityData} // Use the new ultimate security data
              threats={activeThreats} 
            />
          </motion.div>

          {/* Main Content Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-12 gap-8 mb-12"
          >
            <TasksPanel
              className="lg:col-span-2 xl:col-span-8"
              tasks={activeTasks}
              filteredTasks={filteredTasks}
              selectedTasks={selectedTasks}
              taskFilter={taskFilter}
              searchTerm={searchTerm}
              sortBy={sortBy}
              onTaskFilterChange={setTaskFilter}
              onSearchTermChange={setSearchTerm}
              onSortByChange={setSortBy}
              onSelectTask={(id) => setSelectedTasks(prev => (prev.includes(id) ? prev.filter(taskId => taskId !== id) : [...prev, id]))}
              onStatusUpdate={handleTaskStatusUpdate}
              onDelete={confirmDeleteTask}
              onCreateQuickTask={handleCreateQuickTask}
              onSelectAllTasks={handleSelectAllTasks}
              onClearSelection={() => setSelectedTasks([])}
              onBulkAction={async (action) => {
                if (action === 'delete') {
                  confirmBulkDelete();
                } else if (action === 'export') {
                  handleExportSelected(selectedTasks, activeTasks || []);
                  setSelectedTasks([]);
                } else {
                  const { error } = await handleBulkActions(action, selectedTasks);
                  setSelectedTasks([]);
                  if (!error) {
                    await handleRefresh();
                  }
                }
              }}
              onNavigateToTasks={() => onNavigate('tasks')}
            />
            <AnalyticsPanel 
              className="lg:col-span-1 xl:col-span-4"
              analytics={analytics} 
              tasks={activeTasks} 
              taskPriorityAnalytics={taskPriorityAnalytics}
              taskCompletionTrend={taskCompletionTrend}
              categoryAnalytics={categoryAnalytics} />
          </motion.div>

          <QuickActions stats={dashboardStats} onNavigate={onNavigate} />

          {/* Data Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/20 backdrop-blur-xl p-8 rounded-3xl border border-emerald-400/20 bg-gradient-to-r from-emerald-900/10 to-blue-900/10 mb-12 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="w-8 h-8 text-emerald-400" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-emerald-300">Real-time Dashboard</h3>
                <p className="text-emerald-400/80">All data is authenticated, encrypted, and isolated to your user account</p>
              </div>
              <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-400/30">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 font-bold text-sm">LIVE DATABASE</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-emerald-200/90">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-300">{dashboardStats.totalTasks}</div>
                <div className="text-sm">Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-300">{dashboardStats.totalStudySessions}</div>
                <div className="text-sm">Study Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-300">{dashboardStats.totalGrades}</div>
                <div className="text-sm">Grades Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-300">{dashboardStats.totalNotes}</div>
                <div className="text-sm">Notes</div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-white/20 text-white/70 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left">
              {/* Column 1: Branding */}
              <div className="col-span-2 sm:col-span-1">
                <h3 className="font-bold text-base text-white mb-2">MARGDARSHAK</h3>
                <p className="text-white/50">by VSAV GYANTAPA</p>
              </div>
              {/* Column 2: Legal */}
              <div>
                <h3 className="font-bold text-base text-white mb-2">Legal</h3>
                <ul className="space-y-2">
                  <li><Link to="/terms" className="hover:text-white hover:underline">Terms of Service</Link></li>
                  <li><Link to="/privacy" className="hover:text-white hover:underline">Privacy Policy</Link></li>
                </ul>
              </div>
              {/* Column 3: Support */}
              <div>
                <h3 className="font-bold text-base text-white mb-2">Support</h3>
                <ul className="space-y-2">
                  <li><Link to="/help" className="hover:text-white hover:underline">Help Center</Link></li>
                  <li><a href="mailto:abhinavjha393@gmail.com" className="hover:text-white hover:underline">Contact Us</a></li>
                </ul>
              </div>
              {/* Column 4: Social */}
              <div>
                <h3 className="font-bold text-base text-white mb-2">Follow Us</h3>
                <div className="flex justify-center sm:justify-start space-x-4">
                  <a href="https://x.com/gyantappas" aria-label="Twitter" className="hover:text-white transition-colors"><TwitterLogo /></a>
                  <a href="https://www.facebook.com/profile.php?id=61579774640959" aria-label="Facebook" className="hover:text-white transition-colors"><FacebookLogo /></a>
                  <a href="https://github.com/vsavgyantappas" aria-label="GitHub" className="hover:text-white transition-colors"><GitHubLogo /></a>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p>Developed & Maintained by <span className="font-semibold text-emerald-400">VSAV GYANTAPA</span> | © {new Date().getFullYear()} VSAV GYANTAPA</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;