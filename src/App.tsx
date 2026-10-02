/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

// Feature Views
import { DashboardView } from './features/dashboard/DashboardView';
import { AssistantView } from './features/assistant/AssistantView';
import { TeacherView } from './features/teacher/TeacherView';
import { TypingMasterView } from './features/typing/TypingMasterView';
import { BookAssistantView } from './features/book/BookAssistantView';
import { MathSolverView } from './features/math/MathSolverView';
import { EnglishTeacherView } from './features/english/EnglishTeacherView';
import { CodeHelperView } from './features/code/CodeHelperView';
import { PosterGeneratorView } from './features/poster/PosterGeneratorView';
import { HomeworkGeneratorView } from './features/homework/HomeworkGeneratorView';
import { QuizBattleView } from './features/quiz/QuizBattleView';
import { PasswordToolsView } from './features/password/PasswordToolsView';
import { FinanceTrackerView } from './features/finance/FinanceTrackerView';
import { MemoryTrainerView } from './features/memory/MemoryTrainerView';
import { InterviewSimulatorView } from './features/interview/InterviewSimulatorView';
import { StudyPlannerView } from './features/planner/StudyPlannerView';
import { SettingsView } from './features/settings/SettingsView';

const MainContent: React.FC = () => {
  const { activeTool } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'dashboard':
        return <DashboardView />;
      case 'assistant':
        return <AssistantView />;
      case 'teacher':
        return <TeacherView />;
      case 'typing':
        return <TypingMasterView />;
      case 'book-assistant':
        return <BookAssistantView />;
      case 'math':
        return <MathSolverView />;
      case 'english':
        return <EnglishTeacherView />;
      case 'code':
        return <CodeHelperView />;
      case 'poster':
        return <PosterGeneratorView />;
      case 'homework':
        return <HomeworkGeneratorView />;
      case 'quiz-battle':
        return <QuizBattleView />;
      case 'password':
        return <PasswordToolsView />;
      case 'finance':
        return <FinanceTrackerView />;
      case 'memory':
        return <MemoryTrainerView />;
      case 'interview':
        return <InterviewSimulatorView />;
      case 'study-planner':
        return <StudyPlannerView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Mobile Drawer & Bottom Navigation */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Sticky Header */}
        <Header onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Dynamic View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          {renderActiveTool()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppProvider>
          <MainContent />
        </AppProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
