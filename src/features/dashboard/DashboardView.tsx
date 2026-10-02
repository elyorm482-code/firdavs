import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Trophy,
  Zap,
  Calculator,
  ArrowRight,
  Flame,
  Plus,
  Play,
  TrendingUp,
  Wallet,
  Sparkles,
  BookOpen,
  Keyboard,
  Brain,
  Code2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { ToolId } from '../../types';
import { SIDEBAR_ITEMS } from '../../components/layout/Sidebar';

export const DashboardView: React.FC = () => {
  const { stats, setActiveTool, recentTools, todayTasks, toggleTodayTask, addTodayTask } = useApp();
  const { t } = useLanguage();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('General');

  const completedCount = todayTasks.filter((t) => t.completed).length;
  const progressPercent = todayTasks.length > 0 ? Math.round((completedCount / todayTasks.length) * 100) : 0;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTodayTask(newTaskTitle.trim(), newTaskSubject, 25);
    setNewTaskTitle('');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-neutral-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Super App · Multi-Tool Intelligence</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.welcomeBack}
          </h1>

          <p className="text-sm text-neutral-300 leading-relaxed">
            {t.tagline} Practice typing, solve advanced mathematics, master English, prepare for job interviews, manage personal finances, and train memory — all in one unified workspace.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTool('typing')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 font-semibold text-xs transition-all shadow-md active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t.startTyping}</span>
            </button>

            <button
              onClick={() => setActiveTool('assistant')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-sm transition-all"
            >
              <span>{t.askAi}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Decorative backdrop glow */}
        <div className="absolute -right-12 -top-12 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Stat 1: Study Hours */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-medium">{t.studyHours}</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {stats.studyHours}h
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+2.4h this week</span>
            </div>
          </div>
        </div>

        {/* Stat 2: Tasks Done */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-medium">{t.completedTasks}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {stats.completedTasks}
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              {progressPercent}% target today
            </div>
          </div>
        </div>

        {/* Stat 3: Best WPM */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-medium">{t.bestWpm}</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {stats.bestWpm} <span className="text-xs font-normal text-neutral-400">WPM</span>
            </div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
              Top 12% global tier
            </div>
          </div>
        </div>

        {/* Stat 4: Quiz Score */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-medium">{t.quizScore}</span>
            <Trophy className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {stats.quizScore} <span className="text-xs font-normal text-neutral-400">pts</span>
            </div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">
              Rank: Master Scholar
            </div>
          </div>
        </div>

        {/* Stat 5: Math Solved */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-medium">{t.mathSolved}</span>
            <Calculator className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {stats.mathSolved}
            </div>
            <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-0.5">
              Calculus & Equations
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Tasks for Today & Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Today Checklist */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <span>{t.tasksToday}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  {completedCount}/{todayTasks.length}
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Track your active tasks and build daily streaks.
              </p>
            </div>

            <div className="w-24 bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Task Input Form */}
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              placeholder="Add a new study or practice task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl outline-none focus:border-indigo-500 text-neutral-800 dark:text-neutral-200 placeholder-neutral-400"
            />
            <select
              value={newTaskSubject}
              onChange={(e) => setNewTaskSubject(e.target.value)}
              className="text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl outline-none text-neutral-700 dark:text-neutral-300"
            >
              <option value="General">General</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Coding">Coding</option>
              <option value="Typing">Typing</option>
            </select>
            <button
              type="submit"
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          {/* Task List */}
          <div className="space-y-2 pt-1">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTodayTask(task.id)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  task.completed
                    ? 'bg-neutral-50 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800/60 opacity-60'
                    : 'bg-white dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-emerald-500 text-white'
                        : 'border border-neutral-300 dark:border-neutral-600'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div
                      className={`text-xs font-medium text-neutral-800 dark:text-neutral-200 ${
                        task.completed ? 'line-through text-neutral-400 dark:text-neutral-500' : ''
                      }`}
                    >
                      {task.title}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      {task.subject} · {task.durationMinutes} min target
                    </div>
                  </div>
                </div>

                <span className="text-[11px] text-neutral-400 font-mono">
                  {task.durationMinutes}m
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Financial Snapshot */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {t.quickActions}
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTool('typing')}
                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-neutral-200 dark:border-neutral-700 text-left transition-colors group"
              >
                <Keyboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Speed Typing
                </div>
                <div className="text-[10px] text-neutral-400">60s Monkeytype</div>
              </button>

              <button
                onClick={() => setActiveTool('math')}
                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-neutral-200 dark:border-neutral-700 text-left transition-colors group"
              >
                <Calculator className="w-4 h-4 text-rose-600 dark:text-rose-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Math Solver
                </div>
                <div className="text-[10px] text-neutral-400">Step-by-step</div>
              </button>

              <button
                onClick={() => setActiveTool('code')}
                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-neutral-200 dark:border-neutral-700 text-left transition-colors group"
              >
                <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Code Helper
                </div>
                <div className="text-[10px] text-neutral-400">Debug & Convert</div>
              </button>

              <button
                onClick={() => setActiveTool('memory')}
                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-neutral-200 dark:border-neutral-700 text-left transition-colors group"
              >
                <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Memory Trainer
                </div>
                <div className="text-[10px] text-neutral-400">Brain Games</div>
              </button>
            </div>
          </div>

          {/* Finance Mini Widget */}
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {t.financeSummary}
                </h3>
              </div>
              <button
                onClick={() => setActiveTool('finance')}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Open →
              </button>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                {t.balance}
              </div>
              <div className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-0.5">
                $3,450.00
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <span className="text-emerald-600 dark:text-emerald-400">+$4,800 In</span>
                <span className="text-rose-600 dark:text-rose-400">-$1,350 Out</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Used Tools Row */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          {t.recentTools}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {recentTools.map((toolId) => {
            const item = SIDEBAR_ITEMS.find((s) => s.id === toolId);
            if (!item) return null;
            const Icon = item.icon;
            const label = t[item.labelKey] as string;

            return (
              <button
                key={toolId}
                onClick={() => setActiveTool(toolId)}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left group"
              >
                <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
