import React, { useState } from 'react';
import {
  Languages,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Volume2,
  BookOpen,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  Award,
  Send,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { aiService } from '../../services/aiService';

export const EnglishTeacherView: React.FC = () => {
  const { t } = useLanguage();
  const [level, setLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('B2');
  const [activeTab, setActiveTab] = useState<'correction' | 'conversation' | 'vocab' | 'quiz'>('correction');

  // Sentence Correction State
  const [sentenceInput, setSentenceInput] = useState('I am looking forward to meet you yesterday but I cannot came.');
  const [correctionOutput, setCorrectionOutput] = useState<string | null>(null);
  const [correctionLoading, setCorrectionLoading] = useState(false);

  // Conversation Practice State
  const [convoHistory, setConvoHistory] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    {
      role: 'ai',
      text: "Hello! I am your AI English Speaking Partner. Let's practice talking about your weekend hobbies or your favorite travel memories. What did you do last weekend?",
    },
  ]);
  const [convoInput, setConvoInput] = useState('');
  const [convoLoading, setConvoLoading] = useState(false);

  // Daily Vocab state
  const dailyWords = [
    { word: 'Pragmatic', phonetics: '/præɡˈmæt.ɪk/', meaning: 'Dealing with things sensibly and realistically based on practical rather than theoretical considerations.', example: 'A pragmatic approach to problem-solving yields faster results.', level: 'C1' },
    { word: 'Resilient', phonetics: '/rɪˈzɪl.jənt/', meaning: 'Able to withstand or recover quickly from difficult conditions.', example: 'The local economy proved surprisingly resilient during the recession.', level: 'B2' },
    { word: 'Ubiquitous', phonetics: '/juːˈbɪk.wɪ.təs/', meaning: 'Present, appearing, or found everywhere.', example: 'Smartphones have become ubiquitous across all age groups.', level: 'C2' },
  ];

  const handleCorrectSentence = async () => {
    if (!sentenceInput.trim() || correctionLoading) return;
    setCorrectionLoading(true);

    try {
      const response = await aiService.checkEnglish(sentenceInput, level);
      setCorrectionOutput(response);
    } catch {
      setCorrectionOutput('Could not complete grammar check. Please try again.');
    } finally {
      setCorrectionLoading(false);
    }
  };

  const handleConvoSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convoInput.trim() || convoLoading) return;

    const userText = convoInput.trim();
    setConvoHistory((prev) => [...prev, { role: 'user', text: userText }]);
    setConvoInput('');
    setConvoLoading(true);

    try {
      const prompt = `You are a conversational native English teacher having a friendly, natural dialog with a student at level ${level}.
Keep answers conversational, encouraging, and ask an engaging follow-up question.
Student said: "${userText}"`;

      const response = await aiService.generate(prompt, {
        systemInstruction: `You are an encouraging native English speaker coaching an English student at CEFR ${level}. Keep replies engaging (2-3 sentences max) followed by a question.`,
      });

      setConvoHistory((prev) => [...prev, { role: 'ai', text: response }]);
    } catch {
      setConvoHistory((prev) => [
        ...prev,
        { role: 'ai', text: 'That sounds really interesting! Could you tell me more about that?' },
      ]);
    } finally {
      setConvoLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner & Level Selector */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t.english}
            </h1>
            <p className="text-xs text-neutral-500">
              CEFR Level Mastery (A1 to C2) · Sentence Correction · Conversational Speaking
            </p>
          </div>
        </div>

        {/* Level Badges */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800">
          {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                level === lvl
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'correction', label: 'Sentence Correction & Alternatives', icon: CheckCircle2 },
          { id: 'conversation', label: 'Speaking & Chat Practice', icon: MessageSquare },
          { id: 'vocab', label: 'Daily Vocabulary Builder', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-blue-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Sentence Correction */}
      {activeTab === 'correction' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Type or Paste Any English Sentence
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sentenceInput}
                onChange={(e) => setSentenceInput(e.target.value)}
                placeholder="e.g. He do not knows the answers..."
                className="flex-1 text-xs sm:text-sm px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl outline-none focus:border-blue-500 text-neutral-900 dark:text-neutral-100"
              />
              <button
                onClick={handleCorrectSentence}
                disabled={correctionLoading || !sentenceInput.trim()}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze</span>
              </button>
            </div>
          </div>

          {/* Correction Results Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm min-h-[220px]">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Linguistic Analysis & Natural Expressions</span>
              </div>
              {correctionOutput && (
                <button
                  onClick={() => speakText(sentenceInput)}
                  className="text-xs text-neutral-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>
              )}
            </div>

            <div className="pt-4">
              {correctionLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2 text-neutral-400">
                  <div className="w-7 h-7 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                  <span className="text-xs">Analyzing grammar, collocations, and natural idioms...</span>
                </div>
              ) : correctionOutput ? (
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-neutral-800 dark:text-neutral-200 space-y-3 font-sans">
                  {correctionOutput}
                </div>
              ) : (
                <div className="py-10 text-center text-neutral-400 text-xs">
                  Enter a sentence above and click <strong className="text-blue-600">Analyze</strong> to get full grammar breakdown and higher-tier CEFR alternatives.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Conversational Practice */}
      {activeTab === 'conversation' && (
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col h-[480px] overflow-hidden">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              Interactive Dialog Simulator (Target: {level})
            </span>
            <span className="text-[11px] text-neutral-400">Audio playback enabled</span>
          </div>

          {/* Conversation history */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {convoHistory.map((item, idx) => (
              <div
                key={idx}
                className={`flex gap-2 max-w-xl ${item.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-sm ${
                    item.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-none'
                  }`}
                >
                  <p>{item.text}</p>
                  {item.role === 'ai' && (
                    <button
                      onClick={() => speakText(item.text)}
                      className="mt-1 text-[10px] text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Hear Pronunciation</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {convoLoading && (
              <div className="text-xs text-neutral-400 italic">English Teacher is typing...</div>
            )}
          </div>

          {/* Chat Form */}
          <form
            onSubmit={handleConvoSend}
            className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex gap-2"
          >
            <input
              type="text"
              value={convoInput}
              onChange={(e) => setConvoInput(e.target.value)}
              placeholder="Reply in English..."
              className="flex-1 text-xs px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl outline-none focus:border-blue-500 text-neutral-900 dark:text-neutral-100"
            />
            <button
              type="submit"
              disabled={convoLoading || !convoInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Daily Vocabulary */}
      {activeTab === 'vocab' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyWords.map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                    {item.word}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-900">
                    {item.level}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  {item.phonetics}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed">
                  {item.meaning}
                </p>
                <div className="mt-2.5 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-[11px] text-neutral-500 italic">
                  "{item.example}"
                </div>
              </div>

              <button
                onClick={() => speakText(item.word)}
                className="w-full py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Listen Audio</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
