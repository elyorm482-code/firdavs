import React, { useState } from 'react';
import {
  LayoutDashboard,
  Bot,
  GraduationCap,
  Keyboard,
  BookOpen,
  Calculator,
  Languages,
  Code2,
  Palette,
  FileSpreadsheet,
  Gamepad2,
  Lock,
  Wallet,
  Brain,
  Mic,
  CalendarDays,
  Settings,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ToolId } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';

interface SidebarItem {
  id: ToolId;
  labelKey: keyof typeof import('../../i18n/translations').translations['en'];
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { id: 'assistant', labelKey: 'assistant', icon: Bot },
  { id: 'teacher', labelKey: 'teacher', icon: GraduationCap },
  { id: 'typing', labelKey: 'typing', icon: Keyboard },
  { id: 'book-assistant', labelKey: 'bookAssistant', icon: BookOpen },
  { id: 'math', labelKey: 'math', icon: Calculator },
  { id: 'english', labelKey: 'english', icon: Languages },
  { id: 'code', labelKey: 'code', icon: Code2 },
  { id: 'poster', labelKey: 'poster', icon: Palette },
  { id: 'homework', labelKey: 'homework', icon: FileSpreadsheet },
  { id: 'quiz-battle', labelKey: 'quizBattle', icon: Gamepad2 },
  { id: 'password', labelKey: 'password', icon: Lock },
  { id: 'finance', labelKey: 'finance', icon: Wallet },
  { id: 'memory', labelKey: 'memory', icon: Brain },
  { id: 'interview', labelKey: 'interview', icon: Mic },
  { id: 'study-planner', labelKey: 'studyPlanner', icon: CalendarDays },
  { id: 'settings', labelKey: 'settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { activeTool, setActiveTool } = useApp();
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const filteredItems = SIDEBAR_ITEMS.filter((item) => {
    const label = t[item.labelKey] as string;
    return label.toLowerCase().includes(filterQuery.toLowerCase());
  });

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 custom-backdrop transition-all duration-300 z-20 shrink-0 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800">
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col truncate">
              <span className="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
                AI Super App
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                Learn · Create · Practice
              </span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="w-8 h-8 mx-auto rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Filter / Quick Search Input */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder={t.searchTools}
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-neutral-100 dark:bg-neutral-800/80 border border-transparent focus:border-indigo-500 rounded-md outline-none text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 transition-all"
            />
          </div>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTool === item.id;
          const label = t[item.labelKey] as string;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTool(item.id)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors group relative ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-400 dark:text-neutral-500'
                }`}
              />

              {!collapsed && (
                <span className="truncate text-left flex-1">{label}</span>
              )}

              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 ml-auto" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>v2.5 · 15 Tools</span>
          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            AI Ready
          </span>
        </div>
      )}
    </aside>
  );
};
