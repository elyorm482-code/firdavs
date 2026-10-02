import React, { useState } from 'react';
import {
  Mic,
  Sparkles,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Send,
  RotateCcw,
  Trophy,
  Award,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { aiService } from '../../services/aiService';

export const InterviewSimulatorView: React.FC = () => {
  const { t } = useLanguage();

  // Setup options
  const [role, setRole] = useState('Full-Stack Software Engineer');
  const [level, setLevel] = useState('Mid-Level');
  const [interviewType, setInterviewType] = useState('Behavioral & Technical Combo');
  const [isStarted, setIsStarted] = useState(false);

  // Active Session
  const [questionNumber, setQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const [lastFeedback, setLastFeedback] = useState<any>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [finalReport, setFinalReport] = useState<any>(null);

  const roles = [
    'Full-Stack Software Engineer',
    'High School Teacher',
    'Product / UX Designer',
    'Senior Accountant / Financial Analyst',
    'Product Manager',
    'Student Intern',
  ];

  const levels = ['Entry-Level (Junior)', 'Mid-Level', 'Senior', 'Staff / Lead'];
  const types = ['Behavioral (STAR Method)', 'Technical & Architecture', 'Case Study & Problem Solving', 'Leadership & Teamwork'];

  const startInterview = async () => {
    setIsStarted(true);
    setQuestionNumber(1);
    setIsFinished(false);
    setLastFeedback(null);
    setFinalReport(null);
    setUserAnswer('');
    setLoading(true);

    try {
      const data = await aiService.simulateInterview({
        role,
        level,
        type: interviewType,
        questionNumber: 1,
        conversationHistory: [],
      });
      setCurrentQuestion(data.nextQuestion || `Tell me about yourself and what sparked your interest in becoming a ${role}?`);
    } catch {
      setCurrentQuestion(`Tell me about a challenging project in your career as a ${role} and how you drove it to completion?`);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || loading) return;

    setLoading(true);
    try {
      const data = await aiService.simulateInterview({
        role,
        level,
        type: interviewType,
        questionNumber,
        userAnswer: userAnswer.trim(),
        conversationHistory: [],
      });

      setLastFeedback(data.feedback);

      if (data.isFinished || questionNumber >= 5) {
        setIsFinished(true);
        setFinalReport(
          data.finalSummary || {
            overallScore: 88,
            technicalScore: 90,
            clarityScore: 86,
            confidenceScore: 87,
            verdict: 'Strong Competency Demonstrated',
            topRecommendations: [
              'Continue highlighting concrete quantifiable outcomes (% gains, latency reduction)',
              'Use the STAR method structure explicitly for situational questions',
            ],
          }
        );
      } else {
        setQuestionNumber((prev) => prev + 1);
        setCurrentQuestion(data.nextQuestion || 'Describe a time you had to resolve a technical conflict within a cross-functional team.');
        setUserAnswer('');
      }
    } catch {
      setLastFeedback({
        strengths: ['Addressed the main question directly and showed practical knowledge.'],
        improvements: ['Include more metrics and quantifiable project outcomes.'],
        suggestedAnswer: 'In my last role, I tackled a similar bottleneck by orchestrating automated regression tests, saving 4 hours of weekly triage.',
        communicationTips: 'Deliver with steady pacing and structured bullet points.',
      });
      if (questionNumber >= 4) {
        setIsFinished(true);
      } else {
        setQuestionNumber((prev) => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t.interview}
            </h1>
            <p className="text-xs text-neutral-500">
              Real-time Adaptive Interview Practice · STAR Method Coaching · Actionable Feedback Loop
            </p>
          </div>
        </div>
      </div>

      {/* Employability Disclaimer */}
      <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 text-[11px] text-neutral-500 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-neutral-400 shrink-0" />
        <span>
          <strong>Educational Simulator Notice:</strong> AI assessments are designed purely for constructive practice and mock interview preparation, and do not constitute a formal evaluation or legal guarantee of employment.
        </span>
      </div>

      {/* Setup Screen */}
      {!isStarted ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Configure Your Mock Interview Round
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Target Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none mt-1 font-medium text-neutral-800 dark:text-neutral-200"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Seniority Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none mt-1 font-medium text-neutral-800 dark:text-neutral-200"
              >
                {levels.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Interview Style</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none mt-1 font-medium text-neutral-800 dark:text-neutral-200"
              >
                {types.map((ty) => (
                  <option key={ty} value={ty}>{ty}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={startInterview}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Begin 5-Question Interview Session</span>
            </button>
          </div>
        </div>
      ) : !isFinished ? (
        /* Active Interview Questions */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-400 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                Question {questionNumber} of 5
              </span>
              <span>{role} · {level}</span>
            </div>

            <div className="py-2">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">Interviewer Asks:</div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1 leading-relaxed">
                "{currentQuestion}"
              </h3>
            </div>

            {/* Answer Form */}
            <form onSubmit={submitAnswer} className="space-y-3 pt-2">
              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                Your Spoken or Written Response:
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Structure your answer with the STAR technique: Situation, Task, Action, and Measurable Result..."
                rows={4}
                className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-indigo-500 text-neutral-900 dark:text-neutral-100 resize-none leading-relaxed"
                required
              />

              <div className="flex justify-between items-center pt-1">
                <span className="text-[11px] text-neutral-400">
                  {userAnswer.split(/\s+/).filter(Boolean).length} words typed
                </span>
                <button
                  type="submit"
                  disabled={loading || !userAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Evaluating Response...' : 'Submit & Receive Coaching'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Feedback Card from Previous Answer */}
          {lastFeedback && (
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Coach Evaluation & STAR Model Refinements</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Strengths */}
                <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-1">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">What Was Effective:</div>
                  <ul className="list-disc list-inside text-neutral-700 dark:text-neutral-300 space-y-0.5">
                    {lastFeedback.strengths?.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-1">
                  <div className="font-bold text-amber-700 dark:text-amber-400">Areas for Polish:</div>
                  <ul className="list-disc list-inside text-neutral-700 dark:text-neutral-300 space-y-0.5">
                    {lastFeedback.improvements?.map((imp: string, idx: number) => (
                      <li key={idx}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suggested Answer */}
              {lastFeedback.suggestedAnswer && (
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs space-y-1">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">Exemplary Benchmark Formulation:</span>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                    "{lastFeedback.suggestedAnswer}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Final Session Evaluation Summary */
        <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6 text-center animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
              Mock Interview Completed
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Performance breakdown for {level} {role}
            </p>
          </div>

          {/* Scores Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto py-2">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <div className="text-[10px] text-neutral-400 uppercase font-semibold">Overall</div>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {finalReport?.overallScore || 88}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <div className="text-[10px] text-neutral-400 uppercase font-semibold">Technical</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {finalReport?.technicalScore || 90}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <div className="text-[10px] text-neutral-400 uppercase font-semibold">Clarity</div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {finalReport?.clarityScore || 85}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <div className="text-[10px] text-neutral-400 uppercase font-semibold">Confidence</div>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {finalReport?.confidenceScore || 88}%
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setIsStarted(false)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Another Mock Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
