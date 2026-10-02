import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Sparkles,
  Printer,
  Copy,
  Check,
  GraduationCap,
  Eye,
  Key,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { aiService } from '../../services/aiService';

export const HomeworkGeneratorView: React.FC = () => {
  const { t } = useLanguage();
  const [subject, setSubject] = useState('Physics');
  const [grade, setGrade] = useState('11th Grade / High School');
  const [topic, setTopic] = useState('Thermodynamics, Entropy, and Heat Transfer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);

  const [activeVersion, setActiveVersion] = useState<'student' | 'teacher'>('student');
  const [studentVersion, setStudentVersion] = useState<string | null>(null);
  const [teacherKey, setTeacherKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);

    try {
      const data = await aiService.generateHomework({
        subject,
        grade,
        topic,
        difficulty,
        questionCount,
      });

      setStudentVersion(data.studentVersion);
      setTeacherKey(data.teacherKey);
    } catch {
      setStudentVersion('Error generating homework. Please try again.');
      setTeacherKey('Answer key generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = activeVersion === 'student' ? studentVersion : teacherKey;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Configuration Header Card */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t.homework}
            </h1>
            <p className="text-xs text-neutral-500">
              Generate curriculum-aligned homework assignments with dual Student Printable Version and Teacher Answer Key.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <div>
            <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none font-medium mt-1"
            >
              {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Literature', 'History', 'Computer Science'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Grade Level</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none font-medium mt-1"
            >
              {['Middle School (6-8)', 'High School (9-10)', '11th Grade / High School', 'College / Undergraduate'].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none font-medium mt-1"
            >
              {['Easy', 'Medium', 'Hard', 'Advanced / Olympiad'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Number of Questions</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full text-xs px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none font-medium mt-1"
            >
              {[3, 5, 8, 10, 15].map((c) => (
                <option key={c} value={c}>{c} Questions</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Specific Topic or Lesson Chapter</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Quadratic Formula & Discriminant Analysis..."
              className="flex-1 text-xs px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-indigo-500 text-neutral-900 dark:text-neutral-100"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? 'Synthesizing...' : 'Generate Homework'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Output Viewer Card */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm min-h-[350px]">
        {/* Toggle between Student Version & Teacher Key */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800">
            <button
              onClick={() => setActiveVersion('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeVersion === 'student'
                  ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Student Printable Version</span>
            </button>

            <button
              onClick={() => setActiveVersion('teacher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeVersion === 'teacher'
                  ? 'bg-white dark:bg-neutral-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Teacher Answer Key & Rubrics</span>
            </button>
          </div>

          {(studentVersion || teacherKey) && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Display */}
        <div className="pt-4">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3 text-neutral-400">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
              <span className="text-xs">Generating balanced questions and answer key solutions...</span>
            </div>
          ) : (activeVersion === 'student' ? studentVersion : teacherKey) ? (
            <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans text-neutral-800 dark:text-neutral-200 space-y-3">
              {activeVersion === 'student' ? studentVersion : teacherKey}
            </div>
          ) : (
            <div className="py-16 text-center text-neutral-400 space-y-2">
              <FileSpreadsheet className="w-8 h-8 mx-auto stroke-1 text-indigo-500" />
              <p className="text-xs">
                Configure grade and topic, then click <strong className="text-indigo-600">Generate Homework</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
