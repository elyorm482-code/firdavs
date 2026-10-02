import React, { useState } from 'react';
import {
  Calculator,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  Copy,
  Check,
  RotateCw,
  Plus,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';

export const MathSolverView: React.FC = () => {
  const { t } = useLanguage();
  const { stats, updateStats, showToast } = useApp();
  const [problem, setProblem] = useState('2x^2 + 5x - 12 = 0');
  const [solution, setSolution] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const mathSymbols = ['x²', '√', 'π', '÷', '×', '∫', 'd/dx', 'sin', 'cos', 'tan', 'log', '∑', '∞', '^', '(', ')'];

  const quickSamples = [
    { label: 'Quadratic Equation', expr: '2x^2 + 5x - 12 = 0' },
    { label: 'Indefinite Integral', expr: '∫ (3x^2 + 4x - 5) dx' },
    { label: 'Trigonometric Limit', expr: 'lim (x->0) (sin(5x) / x)' },
    { label: 'Compound Interest', expr: 'Calculate A = P(1 + r/n)^(nt) for P=5000, r=7%, n=12, t=5 years' },
  ];

  const handleSolve = async (mode: 'solve' | 'simpler' | 'explain' | 'similar') => {
    if (!problem.trim() || loading) return;
    setLoading(true);

    try {
      const result = await aiService.solveMath(problem, mode);
      setSolution(result);

      if (mode === 'solve') {
        updateStats({ mathSolved: stats.mathSolved + 1 });
        showToast('Problem solved & logged to study stats!', 'success');
      }
    } catch {
      setSolution('Unable to compute mathematical solution. Please check your syntax.');
    } finally {
      setLoading(false);
    }
  };

  const insertSymbol = (sym: string) => {
    setProblem((prev) => prev + sym);
  };

  const handleCopy = () => {
    if (!solution) return;
    navigator.clipboard.writeText(solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Input & Keypad Card */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t.math}
            </h1>
            <p className="text-xs text-neutral-500">
              Algebra, Calculus, Geometry, Differential Equations, and Real-World Word Problems with step-by-step rigorous derivations.
            </p>
          </div>
        </div>

        {/* Math input textarea */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Enter Mathematical Equation or Word Problem
          </label>
          <div className="relative">
            <input
              type="text"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g. ∫ (x^3 - 2x) dx  or  solve 3x + 4y = 20 and x - 2y = 4"
              className="w-full text-sm sm:text-base font-mono px-4 py-3 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl outline-none focus:border-rose-500 text-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>

        {/* Math Symbols Toolbar */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[11px] text-neutral-400 self-center mr-1">Symbols:</span>
          {mathSymbols.map((sym) => (
            <button
              key={sym}
              onClick={() => insertSymbol(sym)}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              {sym}
            </button>
          ))}
        </div>

        {/* Quick Samples */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-[11px] text-neutral-400 font-medium">Quick Examples:</span>
          {quickSamples.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setProblem(sample.expr)}
              className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors border border-rose-200/50 dark:border-rose-900/50 font-medium"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={() => handleSolve('solve')}
          disabled={loading || !problem.trim()}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.solve}</span>
        </button>

        <button
          onClick={() => handleSolve('simpler')}
          disabled={loading || !problem.trim()}
          className="px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-rose-400 text-neutral-700 dark:text-neutral-300 font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.explainSimpler}</span>
        </button>

        <button
          onClick={() => handleSolve('explain')}
          disabled={loading || !problem.trim()}
          className="px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-rose-400 text-neutral-700 dark:text-neutral-300 font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
          <span>Core Intuition</span>
        </button>

        <button
          onClick={() => handleSolve('similar')}
          disabled={loading || !problem.trim()}
          className="px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-rose-400 text-neutral-700 dark:text-neutral-300 font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
        >
          <RotateCw className="w-3.5 h-3.5 text-purple-500" />
          <span>{t.generateSimilar}</span>
        </button>
      </div>

      {/* Solution Output Box */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm min-h-[300px]">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200">
            <CheckCircle className="w-4 h-4 text-rose-500" />
            <span>Mathematical Derivation & Proof</span>
          </div>

          {solution && (
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
            <div className="py-16 flex flex-col items-center justify-center space-y-3 text-neutral-400">
              <div className="w-8 h-8 rounded-full border-2 border-rose-600 border-t-transparent animate-spin" />
              <div className="text-xs font-medium">Solving algebraic derivation and calculating steps...</div>
            </div>
          ) : solution ? (
            <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-neutral-800 dark:text-neutral-200 font-sans space-y-3">
              {solution}
            </div>
          ) : (
            <div className="py-16 text-center text-neutral-400 space-y-2">
              <Calculator className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-xs">
                Enter an equation above and click <strong className="text-rose-600">Solve Step-by-Step</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
