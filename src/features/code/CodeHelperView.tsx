import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  Bug,
  Wrench,
  Zap,
  FileCode,
  ArrowRightLeft,
  Copy,
  Check,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { aiService } from '../../services/aiService';

const LANGUAGES = [
  'TypeScript',
  'JavaScript',
  'Python',
  'HTML',
  'CSS',
  'Java',
  'C++',
  'C#',
  'PHP',
  'SQL',
];

const SAMPLE_CODE = `function findDuplicates<T>(arr: T[]): T[] {
  const seen = new Set<T>();
  const duplicates = new Set<T>();
  
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  
  return Array.from(duplicates);
}`;

export const CodeHelperView: React.FC = () => {
  const { t } = useLanguage();
  const [language, setLanguage] = useState('TypeScript');
  const [targetLang, setTargetLang] = useState('Python');
  const [code, setCode] = useState(SAMPLE_CODE);
  const [customPrompt, setCustomPrompt] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAction = async (action: 'explain' | 'find-bugs' | 'fix' | 'optimize' | 'comments' | 'convert') => {
    if (!code.trim() || loading) return;
    setLoading(true);

    try {
      const result = await aiService.assistCode(
        code,
        language,
        action,
        action === 'convert' ? targetLang : undefined,
        customPrompt || undefined
      );
      setOutput(result);
    } catch {
      setOutput('Failed to process code analysis. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Top Header Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t.code}
            </h1>
            <p className="text-xs text-neutral-500">
              Multi-Language Compiler Assistant · Debugger · Architecture & Algorithm Optimizer
            </p>
          </div>
        </div>

        {/* Language Selectors */}
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 outline-none font-medium"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                Source: {l}
              </option>
            ))}
          </select>

          <span className="text-xs text-neutral-400">→</span>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 outline-none font-medium"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                Convert to: {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleAction('explain')}
          disabled={loading || !code.trim()}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Explain Code</span>
        </button>

        <button
          onClick={() => handleAction('find-bugs')}
          disabled={loading || !code.trim()}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
        >
          <Bug className="w-3.5 h-3.5 text-rose-500" />
          <span>Find Bugs</span>
        </button>

        <button
          onClick={() => handleAction('fix')}
          disabled={loading || !code.trim()}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
        >
          <Wrench className="w-3.5 h-3.5 text-amber-500" />
          <span>Fix Code</span>
        </button>

        <button
          onClick={() => handleAction('optimize')}
          disabled={loading || !code.trim()}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
        >
          <Zap className="w-3.5 h-3.5 text-yellow-500" />
          <span>Optimize (Big-O)</span>
        </button>

        <button
          onClick={() => handleAction('comments')}
          disabled={loading || !code.trim()}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
        >
          <FileCode className="w-3.5 h-3.5 text-purple-500" />
          <span>Add Documentation</span>
        </button>

        <button
          onClick={() => handleAction('convert')}
          disabled={loading || !code.trim()}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Convert to {targetLang}</span>
        </button>
      </div>

      {/* Editor & Output Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Code Input Editor */}
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-xs font-bold font-mono text-neutral-700 dark:text-neutral-300">
              input.{language.toLowerCase()}
            </span>
            <button
              onClick={() => setCode(SAMPLE_CODE)}
              className="text-[11px] text-emerald-600 hover:underline"
            >
              Reset Sample
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full mt-3 p-3 bg-neutral-950 text-emerald-400 font-mono text-xs rounded-xl outline-none resize-none leading-relaxed border border-neutral-800"
            placeholder="Paste your source code here..."
          />

          <div className="pt-3">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Optional: custom instructions (e.g. use recursion, add unit test)..."
              className="w-full text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl outline-none focus:border-emerald-500 text-neutral-800 dark:text-neutral-200"
            />
          </div>
        </div>

        {/* Right: AI Output Display */}
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>AI Analysis & Generated Output</span>
            </span>

            {output && (
              <button
                onClick={handleCopy}
                className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 transition-colors font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto mt-3 p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700/60">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-3 text-neutral-400">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
                <span className="text-xs font-medium">Running static analysis and code intelligence...</span>
              </div>
            ) : output ? (
              <div className="text-xs leading-relaxed whitespace-pre-wrap text-neutral-800 dark:text-neutral-200 font-mono">
                {output}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-2 text-center p-4">
                <Code2 className="w-8 h-8 mx-auto text-emerald-500" />
                <p className="text-xs">
                  Choose any action above (e.g. <strong className="text-emerald-600">Explain Code</strong>, <strong className="text-emerald-600">Find Bugs</strong>, or <strong className="text-emerald-600">Convert to Python</strong>).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
