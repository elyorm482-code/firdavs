import React, { useState } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Flame,
  Globe,
  Bell,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Language, ToolId } from '../../types';
import { SIDEBAR_ITEMS } from './Sidebar';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { activeTool, setActiveTool, stats, toast } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const currentItem = SIDEBAR_ITEMS.find((item) => item.id === activeTool);
  const currentTitle = currentItem ? (t[currentItem.labelKey] as string) : t.dashboard;

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  ];

  return (
    <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 custom-backdrop flex items-center justify-between px-4 sm:px-6 z-10 shrink-0 sticky top-0">
      {/* Left: Mobile trigger & Current Section Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
            {currentTitle}
          </h1>
          <span className="hidden sm:inline-block text-neutral-300 dark:text-neutral-700">·</span>
          <span className="hidden sm:inline-block text-xs text-neutral-500 dark:text-neutral-400">
            {t.tagline}
          </span>
        </div>
      </div>

      {/* Right: Quick actions, streak, language, theme */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak counter */}
        <div className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-full border border-amber-200 dark:border-amber-900/50">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{stats.streakDays}d streak</span>
        </div>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase text-[11px] font-bold">{language}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg py-1 z-50 text-xs">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                    language === l.code
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
        </button>

        {/* Quick Assistant shortcut */}
        <button
          onClick={() => setActiveTool('assistant')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.askAi}</span>
        </button>
      </div>

      {/* Floating Global Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300 max-w-sm flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xl text-xs font-medium border border-neutral-700 dark:border-neutral-200">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />}
          {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 dark:text-amber-600 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 dark:text-blue-600 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}
    </header>
  );
};
