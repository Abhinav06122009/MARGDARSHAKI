import React from 'react';
import { motion } from 'framer-motion';
import InteractiveCard from '@/components/ui/InteractiveCard';
import { Calendar as CalendarIcon, BookOpen, GraduationCap, CalculatorIcon, Settings } from 'lucide-react';
import type { RealDashboardStats } from '@/types/dashboard';

interface QuickActionsProps {
  stats: RealDashboardStats;
  onNavigate: (page: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ stats, onNavigate }) => {
  const actionItems = [
    { 
      page: 'timetable', 
      icon: CalendarIcon, 
      title: 'Schedule', 
      desc: `${stats.upcomingClasses} upcoming classes`, 
      count: stats.totalClassesCount
    },
    { 
      page: 'notes', 
      icon: BookOpen, 
      title: 'Notes', 
      desc: `${stats.totalNotes} notes`, 
      count: stats.totalNotes
    },
    { 
      page: 'courses', 
      icon: GraduationCap, 
      title: 'Courses', 
      desc: `${stats.activeCourses} active courses`, 
      count: stats.activeCourses
    },
    { 
      page: 'calculator',
      icon: CalculatorIcon,
      title: 'Calculator',
      desc: 'Scientific & more',
      count: null
    },
    {
      page: 'settings',
      icon: Settings,
      title: 'Settings',
      desc: 'Account & Preferences',
      count: null
    }
  ];

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12"
    >
      {actionItems.map((item, index) => (
        <InteractiveCard
          key={item.page}
          className="w-full h-full cursor-pointer group"
          onClick={() => onNavigate(item.page)}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } }}
            className="w-full h-full text-left flex flex-col p-4"
          >
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-6">
                <motion.div 
                  className="inline-flex p-5 rounded-2xl bg-emerald-500/10 shadow-xl group-hover:bg-emerald-500/20 transition-colors"
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  <item.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                {item.count !== null && (
                  <motion.div
                    className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white font-bold border border-white/20 group-hover:bg-white/20 group-hover:border-white/30 transition-all"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.count}
                  </motion.div>
                )}
              </div>
              
              <h3 className="font-bold text-white mb-3 text-2xl group-hover:text-emerald-300 transition-colors flex-grow tracking-tight">
                {item.title}
              </h3>
              <p className="text-white/70 group-hover:text-white/90 transition-colors">
                {item.desc}
              </p>
            </div>
          </motion.div>
        </InteractiveCard>
      ))}
    </motion.div>
  );
};

export default QuickActions;