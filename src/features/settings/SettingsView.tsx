import React, { useState } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Globe,
  Bell,
  User,
  Database,
  Trash2,
  Download,
  Upload,
  Shield,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';

export const SettingsView: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { clearAllData, exportAllData, importAllData, showToast } = useApp();

  const [userName, setUserName] = useState('Alexander V.');
  const [userEmail, setUserEmail] = useState('student@aisuperapp.io');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [importJson, setImportJson] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = () => {
    const dataStr = exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-super-app-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('Data exported successfully!', 'success');
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    const success = importAllData(importJson);
    if (success) setImportJson('');
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English (US)', flag: '🇬🇧' },
    { code: 'uz', label: "O'zbekcha (Lotin)", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский (RU)', flag: '🇷🇺' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t.settings}
            </h1>
            <p className="text-xs text-neutral-500">
              Personalization · Global Language Configuration · Storage & Security Management
            </p>
          </div>
        </div>
      </div>

      {/* Theme & Display Mode */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>{t.theme}</span>
        </h2>

        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <div className="text-left">
              <div className="text-xs">{t.lightMode}</div>
              <div className="text-[10px] text-neutral-400">Crisp daytime contrast</div>
            </div>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <div className="text-left">
              <div className="text-xs">{t.darkMode}</div>
              <div className="text-[10px] text-neutral-400">Low-glare night aesthetic</div>
            </div>
          </button>
        </div>
      </div>

      {/* Language Selection */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-600" />
          <span>{t.language}</span>
        </h2>
        <p className="text-xs text-neutral-500">
          Changes the language across the entire application interface, tools, and prompts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLanguage(l.code);
                showToast(`Language switched to ${l.label}`, 'info');
              }}
              className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                language === l.code
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              <span className="text-xl">{l.flag}</span>
              <div>
                <div className="text-xs">{l.label}</div>
                <div className="text-[10px] text-neutral-400 uppercase">{l.code}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          <span>User Profile Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Display Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 mt-1"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Email Address</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 mt-1"
            />
          </div>
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600" />
          <span>Local Storage & Backup Management</span>
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Application State (.json)</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 text-xs font-semibold text-rose-600 flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Local Data</span>
          </button>
        </div>

        {/* Clear Confirmation Prompt */}
        {showClearConfirm && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 space-y-3">
            <p className="text-xs text-rose-800 dark:text-rose-300">
              Are you sure? This will reset all your typing scores, financial transactions, study tasks, and chat history to factory defaults.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  clearAllData();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
