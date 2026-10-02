import React, { createContext, useContext, useState, useEffect } from 'react';
import { ToolId, UserStats, StudyTask } from '../types';

interface AppContextType {
  activeTool: ToolId;
  setActiveTool: (tool: ToolId) => void;
  stats: UserStats;
  updateStats: (updater: Partial<UserStats>) => void;
  recentTools: ToolId[];
  addRecentTool: (tool: ToolId) => void;
  todayTasks: StudyTask[];
  toggleTodayTask: (taskId: string) => void;
  addTodayTask: (title: string, subject: string, durationMinutes: number) => void;
  deleteTodayTask: (taskId: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  toast: { message: string; type: 'success' | 'info' | 'warning'; id: number } | null;
  clearAllData: () => void;
  exportAllData: () => string;
  importAllData: (jsonData: string) => boolean;
}

const defaultStats: UserStats = {
  studyHours: 14.5,
  completedTasks: 18,
  bestWpm: 78,
  quizScore: 1250,
  mathSolved: 32,
  streakDays: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

const defaultTasks: StudyTask[] = [
  { id: '1', title: 'Complete AI English Teacher B2 Practice', day: 'Today', durationMinutes: 25, completed: true, subject: 'English' },
  { id: '2', title: 'Solve 5 Calculus & Algebra problems', day: 'Today', durationMinutes: 30, completed: false, subject: 'Mathematics' },
  { id: '3', title: 'Speed typing practice (target: 80+ WPM)', day: 'Today', durationMinutes: 15, completed: false, subject: 'Typing' },
  { id: '4', title: 'Review System Design notes in Book Assistant', day: 'Today', durationMinutes: 20, completed: false, subject: 'Computer Science' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTool, setActiveToolState] = useState<ToolId>(() => {
    const hash = window.location.hash.replace('#', '') as ToolId;
    return hash || 'dashboard';
  });

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('ai_super_app_stats');
      return saved ? JSON.parse(saved) : defaultStats;
    } catch {
      return defaultStats;
    }
  });

  const [recentTools, setRecentTools] = useState<ToolId[]>(() => {
    try {
      const saved = localStorage.getItem('ai_super_app_recent');
      return saved ? JSON.parse(saved) : ['assistant', 'typing', 'math', 'teacher'];
    } catch {
      return ['assistant', 'typing', 'math', 'teacher'];
    }
  });

  const [todayTasks, setTodayTasks] = useState<StudyTask[]>(() => {
    try {
      const saved = localStorage.getItem('ai_super_app_today_tasks');
      return saved ? JSON.parse(saved) : defaultTasks;
    } catch {
      return defaultTasks;
    }
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning'; id: number } | null>(null);

  useEffect(() => {
    localStorage.setItem('ai_super_app_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('ai_super_app_recent', JSON.stringify(recentTools));
  }, [recentTools]);

  useEffect(() => {
    localStorage.setItem('ai_super_app_today_tasks', JSON.stringify(todayTasks));
  }, [todayTasks]);

  const setActiveTool = (tool: ToolId) => {
    setActiveToolState(tool);
    window.location.hash = tool;
    addRecentTool(tool);
  };

  const addRecentTool = (tool: ToolId) => {
    if (tool === 'dashboard' || tool === 'settings') return;
    setRecentTools((prev) => {
      const filtered = prev.filter((t) => t !== tool);
      return [tool, ...filtered].slice(0, 6);
    });
  };

  const updateStats = (updater: Partial<UserStats>) => {
    setStats((prev) => ({ ...prev, ...updater }));
  };

  const toggleTodayTask = (taskId: string) => {
    setTodayTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newStatus = !task.completed;
          if (newStatus) {
            updateStats({ completedTasks: stats.completedTasks + 1 });
            showToast('Task completed! Keep the momentum going.', 'success');
          }
          return { ...task, completed: newStatus };
        }
        return task;
      })
    );
  };

  const addTodayTask = (title: string, subject: string, durationMinutes: number) => {
    const newTask: StudyTask = {
      id: Date.now().toString(),
      title,
      subject,
      durationMinutes,
      completed: false,
      day: 'Today',
    };
    setTodayTasks((prev) => [newTask, ...prev]);
    showToast('New study task added!', 'info');
  };

  const deleteTodayTask = (taskId: string) => {
    setTodayTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const clearAllData = () => {
    localStorage.clear();
    setStats(defaultStats);
    setRecentTools(['assistant', 'typing', 'math', 'teacher']);
    setTodayTasks(defaultTasks);
    showToast('All data has been reset to defaults.', 'warning');
  };

  const exportAllData = () => {
    const data = {
      stats,
      recentTools,
      todayTasks,
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importAllData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.stats) setStats(parsed.stats);
      if (parsed.todayTasks) setTodayTasks(parsed.todayTasks);
      showToast('Data imported successfully!', 'success');
      return true;
    } catch {
      showToast('Failed to import data: Invalid JSON format.', 'warning');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTool,
        setActiveTool,
        stats,
        updateStats,
        recentTools,
        addRecentTool,
        todayTasks,
        toggleTodayTask,
        addTodayTask,
        deleteTodayTask,
        showToast,
        toast,
        clearAllData,
        exportAllData,
        importAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
