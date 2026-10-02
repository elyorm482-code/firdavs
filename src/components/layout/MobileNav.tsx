import React from 'react';
import {
  LayoutDashboard,
  Bot,
  GraduationCap,
  Keyboard,
  MoreHorizontal,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { SIDEBAR_ITEMS } from './Sidebar';
import { ToolId } from '../../types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { activeTool, setActiveTool } = useApp();
  const { t } = useLanguage();

  const handleSelect = (id: ToolId) => {
    setActiveTool(id);
    onClose();
  };

  const primaryItems: { id: ToolId; labelKey: keyof typeof import('../../i18n/translations').translations['en']; icon: any }[] = [
    { id: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
    { id: 'assistant', labelKey: 'assistant', icon: Bot },
    { id: 'teacher', labelKey: 'teacher', icon: GraduationCap },
    { id: 'typing', labelKey: 'typing', icon: Keyboard },
  ];

  return (
    <>
      {/* Mobile Drawer (When Opened) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          <div className="relative w-4/5 max-w-xs h-full bg-white dark:bg-neutral-900 shadow-2xl flex flex-col z-10">
            {/* Drawer Header */}
            <div className="h-16 px-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    AI Super App
                  </div>
                  <div className="text-[10px] text-neutral-500">15 Tools in One</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tool list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTool === item.id;
                const label = t[item.labelKey] as string;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-colors text-left ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate flex-1">{label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 custom-backdrop flex items-center justify-around px-2 z-30">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTool === item.id;
          const label = t[item.labelKey] as string;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTool(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="truncate max-w-[60px]">{label}</span>
            </button>
          );
        })}

        <button
          onClick={onClose}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span>All 15</span>
        </button>
      </nav>
    </>
  );
};
