import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Sparkles,
  CheckCircle2,
  Clock,
  Target,
  ListTodo,
  TrendingUp,
  RotateCw,
  Plus,
  Play,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { StudyPlan } from '../../types';

export const StudyPlannerView: React.FC = () => {
  const { t } = useLanguage();
  const { showToast, stats, updateStats } = useApp();

  const [goal, setGoal] = useState('Learn Full-Stack Web Development & System Design');
  const [deadline, setDeadline] = useState('3 Months');
  const [hoursPerDay, setHoursPerDay] = useState(2.5);
  const [subjects, setSubjects] = useState('React, TypeScript, Node.js, PostgreSQL');
  const [currentLevel, setCurrentLevel] = useState('Intermediate Beginner');

  const [plan, setPlan] = useState<StudyPlan | null>(() => {
    try {
      const saved = localStorage.getItem('ai_super_app_study_plan');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plan) {
      localStorage.setItem('ai_super_app_study_plan', JSON.stringify(plan));
    }
  }, [plan]);

  const handleGeneratePlan = async () => {
    if (!goal.trim() || loading) return;
    setLoading(true);

    try {
      const data = await aiService.generateStudyPlan({
        goal,
        deadline,
        hoursPerDay,
        subjects: subjects.split(',').map((s) => s.trim()),
        currentLevel,
      });

      const newPlan: StudyPlan = {
        id: Date.now().toString(),
        goal,
        deadline,
        hoursPerDay,
        subjects: subjects.split(',').map((s) => s.trim()),
        currentLevel,
        weeklyFocus: data.weeklyFocus || ['Week 1: Fundamentals', 'Week 2: Advanced Patterns'],
        monthlyMilestones: data.monthlyMilestones || ['Month 1: 50% Mastery', 'Month 2: Capstone Project'],
        tasks: data.tasks || [],
        createdAt: new Date().toISOString().split('T')[0],
      };

      setPlan(newPlan);
      showToast('Intelligent Study Plan successfully generated!', 'success');
    } catch {
      showToast('Encountered an issue generating plan. Please try again.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (taskId: string) => {
    if (!plan) return;
    setPlan({
      ...plan,
      tasks: plan.tasks.map((t) => {
        if (t.id === taskId) {
          const next = !t.completed;
          if (next) {
            updateStats({ completedTasks: stats.completedTasks + 1 });
          }
          return { ...t, completed: next };
        }
        return t;
      }),
    });
  };

  const completedCount = plan ? plan.tasks.filter((t) => t.completed).length : 0;
  const totalCount = plan ? plan.tasks.length : 0;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t.studyPlanner}
            </h1>
            <p className="text-xs text-neutral-500">
              Goal-Driven Curricula Engine · Spaced Repetition Milestones · Daily Active Recall Checklists
            </p>
          </div>
        </div>
      </div>

      {/* Plan Configuration Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          Target Objective & Availability
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Target Goal</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Master Calculus from scratch"
              className="w-full text-xs px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none mt-1 text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Target Deadline</label>
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="e.g. 6 Weeks, 3 Months"
              className="w-full text-xs px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none mt-1 text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Hours per Day</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="12"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full text-xs px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none mt-1 font-mono text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Current Level</label>
            <input
              type="text"
              value={currentLevel}
              onChange={(e) => setCurrentLevel(e.target.value)}
              placeholder="e.g. Absolute Beginner, B1"
              className="w-full text-xs px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none mt-1 text-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <input
            type="text"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            placeholder="Subjects or key competencies (separated by commas)..."
            className="flex-1 text-xs px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-neutral-100"
          />
          <button
            onClick={handleGeneratePlan}
            disabled={loading || !goal.trim()}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Synthesizing Roadmap...' : 'Generate Roadmap'}</span>
          </button>
        </div>
      </div>

      {/* Roadmap & Milestones Display */}
      {plan ? (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Active Plan Progress</div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {plan.goal}
              </h3>
              <p className="text-xs text-neutral-500">
                Deadline: {plan.deadline} · {plan.hoursPerDay} hrs/day commitment
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  {progressPct}%
                </div>
                <div className="text-[10px] text-neutral-400">
                  {completedCount} of {totalCount} tasks completed
                </div>
              </div>

              <div className="w-20 bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Grid: Milestones & Weekly Focus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weekly Focus */}
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Weekly Cadence Focus</span>
              </h4>
              <div className="space-y-2">
                {plan.weeklyFocus.map((w, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 text-xs text-neutral-800 dark:text-neutral-200">
                    {w}
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Milestones */}
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                <span>Major Monthly Milestones</span>
              </h4>
              <div className="space-y-2">
                {plan.monthlyMilestones.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 text-xs text-purple-800 dark:text-purple-300 font-medium">
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Actionable Tasks */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-indigo-600" />
              <span>Actionable Study Task Checklist</span>
            </h4>

            <div className="space-y-2">
              {plan.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    task.completed
                      ? 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700 opacity-60'
                      : 'bg-white dark:bg-neutral-800/80 border-neutral-200 dark:border-neutral-700 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        task.completed ? 'bg-indigo-600 text-white' : 'border border-neutral-300 dark:border-neutral-600'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>

                    <div>
                      <div className={`text-xs font-semibold ${task.completed ? 'line-through text-neutral-400' : 'text-neutral-800 dark:text-neutral-200'}`}>
                        {task.title}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {task.day} · {task.subject}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-neutral-400">
                    {task.durationMinutes} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-neutral-400 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
          <CalendarDays className="w-8 h-8 mx-auto text-indigo-500 stroke-1" />
          <p className="text-xs">
            Set your target goal, desired timeline, and daily hours above to generate your customized AI study roadmap.
          </p>
        </div>
      )}
    </div>
  );
};
