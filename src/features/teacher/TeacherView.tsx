import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  HelpCircle,
  Lightbulb,
  FileText,
  CheckCircle,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { aiService } from '../../services/aiService';

export const TeacherView: React.FC = () => {
  const { t } = useLanguage();
  const [subject, setSubject] = useState('Physics');
  const [level, setLevel] = useState('High school');
  const [topic, setTopic] = useState('Newton’s Laws of Motion & Conservation of Momentum');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const subjects = [
    'Mathematics',
    'English',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Computer Science',
    'Philosophy',
    'Economics',
  ];

  const levels = ['Beginner', 'School', 'High school', 'University'];

  const handleAsk = async (mode: 'explain' | 'simpler' | 'example' | 'exercises' | 'quiz') => {
    if (!topic.trim() || loading) return;
    setLoading(true);

    try {
      const response = await aiService.askTeacher(subject, level, topic, mode);
      setExplanation(response);
    } catch (err: any) {
      setExplanation('Encountered an issue generating explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!explanation) return;
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header card */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t.teacher}
            </h1>
            <p className="text-xs text-neutral-500">
              Interactive pedagogy engine that fosters deep conceptual understanding through analogies, real-world models, and guided practice.
            </p>
          </div>
        </div>

        {/* Configuration Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800">
          {/* Subject selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {t.selectSubject}
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 outline-none focus:border-indigo-500 font-medium"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Education Level selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {t.selectLevel}
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 outline-none focus:border-indigo-500 font-medium"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl} Level
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Topic Input */}
        <div className="mt-4 space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Topic, Question or Concept to Master
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. How does photosynthesis produce glucose? or Explain Euler's Identity..."
              className="flex-1 text-xs px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleAsk('explain')}
              disabled={loading || !topic.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explain</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleAsk('simpler')}
          disabled={loading || !topic.trim()}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.explainSimpler}</span>
        </button>

        <button
          onClick={() => handleAsk('example')}
          disabled={loading || !topic.trim()}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
          <span>{t.giveExample}</span>
        </button>

        <button
          onClick={() => handleAsk('exercises')}
          disabled={loading || !topic.trim()}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-emerald-500" />
          <span>{t.generateExercises}</span>
        </button>

        <button
          onClick={() => handleAsk('quiz')}
          disabled={loading || !topic.trim()}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
        >
          <CheckCircle className="w-3.5 h-3.5 text-purple-500" />
          <span>{t.generateQuiz}</span>
        </button>
      </div>

      {/* Output card */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm min-h-[280px]">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Teacher Lesson & Guidance</span>
          </div>

          {explanation && (
            <button
              onClick={handleCopy}
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.copied : t.copy}</span>
            </button>
          )}
        </div>

        <div className="pt-4">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-neutral-400">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
              <div className="text-xs font-medium">Crafting intuitive pedagogical explanation...</div>
            </div>
          ) : explanation ? (
            <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-neutral-800 dark:text-neutral-200 font-sans space-y-3">
              {explanation}
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-400 space-y-2">
              <HelpCircle className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-xs">
                Select a subject, specify any topic above, and click <strong className="text-indigo-600 dark:text-indigo-400">Explain</strong> or <strong className="text-indigo-600 dark:text-indigo-400">Generate Quiz</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
