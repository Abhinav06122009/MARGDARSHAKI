import React from 'react';
import { motion } from 'framer-motion';
import InteractiveCard from '@/components/ui/InteractiveCard';
import { CheckSquare, Flame, Clock, TrendingUp, GraduationCap, Trophy } from 'lucide-react';
import type { RealDashboardStats } from '@/types/dashboard';

interface StatsGridProps {
  stats: RealDashboardStats;
}

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const statItems = [
    { 
      label: 'Total Tasks', 
      value: stats.totalTasks.toString(), 
      icon: CheckSquare, 
      color: 'from-blue-500 to-cyan-600',
      subtitle: `${stats.completedTasks} completed`
    },
    { 
      label: 'Study Streak', 
      value: `${stats.studyStreak} days`, 
      icon: Flame, 
      color: 'from-orange-500 to-red-600',
      subtitle: 'consecutive days'
    },
    { 
      label: 'Today\'s Study', 
      value: formatTime(stats.todayStudyTime),
      icon: Clock, 
      color: 'from-green-500 to-emerald-600',
      subtitle: 'minutes today'
    },
    { 
      label: 'Productivity', 
      value: `${stats.productivityScore.toFixed(0)}%`, 
      icon: TrendingUp, 
      color: 'from-purple-500 to-pink-600',
      subtitle: 'completion rate'
    },
    { 
      label: 'Active Courses', 
      value: stats.activeCourses.toString(), 
      icon: GraduationCap, 
      color: 'from-indigo-500 to-purple-600',
      subtitle: `of ${stats.totalCourses} total`
    },
    { 
      label: 'Average Grade', 
      value: stats.totalGrades > 0 ? `${stats.averageGrade.toFixed(1)}%` : 'N/A', 
      icon: Trophy, 
      color: 'from-yellow-500 to-orange-600',
      subtitle: `from ${stats.totalGrades} grades`
    }
  ];

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.07 }
        }
      }}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12"
    >
      {statItems.map((stat, index) => (
        <InteractiveCard
          key={stat.label}
          className="w-full h-full group"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } }}
            className="p-4 h-full flex flex-col justify-between"
          >
            <div>
              <motion.div 
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg mb-4 inline-block group-hover:scale-110 transition-transform duration-300`}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </motion.div>
              
              <motion.div 
                className="text-3xl font-bold text-white mb-1 tracking-tight"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05, type: "spring" }}
              >
                {stat.value}
              </motion.div>
              
              <div className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">{stat.label}</div>
              {stat.subtitle && (
                <div className="text-white/50 text-xs mt-1">{stat.subtitle}</div>
              )}
            </div>
          </motion.div>
        </InteractiveCard>
      ))}
    </motion.div>
  );
};

export default StatsGrid;