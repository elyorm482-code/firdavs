import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Keyboard,
  RotateCcw,
  Zap,
  Award,
  Globe,
  Clock,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';

const WORD_BANKS: Record<string, string[]> = {
  en: [
    'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'I', 'with', 'as',
    'not', 'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'his', 'from', 'they', 'say', 'her',
    'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out',
    'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just',
    'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use',
    'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
    'give', 'day', 'most', 'us', 'system', 'program', 'build', 'create', 'learn', 'speed', 'code', 'typing',
  ],
  uz: [
    'va', 'bu', 'bir', 'bilan', 'uchun', 'ham', 'u', 'o‘sha', 'deb', 'kerak', 'lekin', 'ammo', 'shunday',
    'qilish', 'bo‘lish', 'ish', 'inson', 'hayot', 'vaqt', 'kun', 'yaxshi', 'yangi', 'katta', 'kichik',
    'dastur', 'bilim', 'kitob', 'o‘qish', 'yozish', 'dunyo', 'davlat', 'shahar', 'xalq', 'til', 'fikr',
    'barcha', 'har', 'hamma', 'faqat', 'yana', 'keyin', 'oldin', 'hozir', 'biz', 'siz', 'ular', 'men',
    'sen', 'orqali', 'to‘g‘ri', 'natija', 'rivojlanish', 'tezlik', 'mashq', 'maqsad', 'imkoniyat', 'loyiha',
  ],
  ru: [
    'и', 'в', 'не', 'на', 'я', 'быть', 'он', 'с', 'что', 'а', 'по', 'это', 'она', 'этот', 'к', 'но',
    'они', 'мы', 'как', 'из', 'у', 'который', 'то', 'за', 'свой', 'что', 'еще', 'для', 'же', 'только',
    'себя', 'один', 'год', 'так', 'от', 'время', 'когда', 'до', 'все', 'можно', 'уже', 'делать', 'жизнь',
    'хорошо', 'знать', 'новый', 'день', 'работа', 'люди', 'рука', 'человек', 'слово', 'код', 'программа',
    'система', 'скорость', 'учиться', 'создавать', 'цель', 'быстро', 'текст', 'память', 'успех', 'развитие',
  ],
};

export const TypingMasterView: React.FC = () => {
  const { t } = useLanguage();
  const { stats, updateStats, showToast } = useApp();

  const [timeMode, setTimeMode] = useState<number>(30); // 15, 30, 60, 120
  const [lang, setLang] = useState<'en' | 'uz' | 'ru'>('en');
  const [timeLeft, setTimeLeft] = useState<number>(timeMode);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [typedChars, setTypedChars] = useState<{ char: string; state: 'correct' | 'wrong' | 'current' }[][]>([]);
  const [correctCharsCount, setCorrectCharsCount] = useState<number>(0);
  const [incorrectCharsCount, setIncorrectCharsCount] = useState<number>(0);
  const [errorsCount, setErrorsCount] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);

  // Load words
  const generateWords = () => {
    const bank = WORD_BANKS[lang] || WORD_BANKS.en;
    const shuffled = [...bank].sort(() => 0.5 - Math.random());
    const selected = [];
    while (selected.length < 80) {
      selected.push(...shuffled);
    }
    const finalWords = selected.slice(0, 80);
    setWords(finalWords);

    // Initialize character states
    const initialTyped = finalWords.map((word) =>
      word.split('').map((char) => ({ char, state: 'current' as const }))
    );
    setTypedChars(initialTyped);
  };

  const restartTest = () => {
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(timeMode);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setCorrectCharsCount(0);
    setIncorrectCharsCount(0);
    setErrorsCount(0);
    generateWords();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  useEffect(() => {
    restartTest();
  }, [timeMode, lang]);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setIsFinished(true);
      // Save stats
      const finalWpm = calculateWpm();
      if (finalWpm > stats.bestWpm) {
        updateStats({ bestWpm: finalWpm });
        showToast(`🎉 New Personal Best: ${finalWpm} WPM!`, 'success');
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft]);

  const calculateWpm = () => {
    const elapsedSeconds = timeMode - timeLeft || 1;
    const minutes = elapsedSeconds / 60;
    const wordsTyped = correctCharsCount / 5;
    return Math.round(wordsTyped / minutes) || 0;
  };

  const calculateAccuracy = () => {
    const total = correctCharsCount + incorrectCharsCount;
    if (total === 0) return 100;
    return Math.round((correctCharsCount / total) * 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;

    if (!isActive && e.key.length === 1) {
      setIsActive(true);
    }

    const currentWord = words[currentWordIndex] || '';

    // Handle Space to advance word
    if (e.key === ' ') {
      e.preventDefault();
      if (currentCharIndex > 0) {
        setCurrentWordIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }
      return;
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (currentCharIndex > 0) {
        setCurrentCharIndex((prev) => prev - 1);
      }
      return;
    }

    // Handle normal character
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const expectedChar = currentWord[currentCharIndex];
      const typed = e.key;

      if (typed === expectedChar) {
        setCorrectCharsCount((prev) => prev + 1);
      } else {
        setIncorrectCharsCount((prev) => prev + 1);
        setErrorsCount((prev) => prev + 1);
      }

      // advance character
      if (currentCharIndex + 1 < currentWord.length) {
        setCurrentCharIndex((prev) => prev + 1);
      } else {
        // reached end of word
        setCurrentWordIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }
    }
  };

  const wpm = calculateWpm();
  const accuracy = calculateAccuracy();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Top Configuration Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        {/* Time mode selection */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800">
          <Clock className="w-3.5 h-3.5 ml-2 text-neutral-400" />
          {[15, 30, 60, 120].map((seconds) => (
            <button
              key={seconds}
              onClick={() => setTimeMode(seconds)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                timeMode === seconds
                  ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {seconds}s
            </button>
          ))}
        </div>

        {/* Language selection */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800">
          <Globe className="w-3.5 h-3.5 ml-2 text-neutral-400" />
          {[
            { id: 'en', label: 'English' },
            { id: 'uz', label: "O'zbek" },
            { id: 'ru', label: 'Русский' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                lang === l.id
                  ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Personal Best Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-xs font-bold">
          <Award className="w-4 h-4" />
          <span>PB: {stats.bestWpm} WPM</span>
        </div>
      </div>

      {/* Main Typing Container */}
      {!isFinished ? (
        <div
          onClick={() => inputRef.current?.focus()}
          className="relative min-h-[300px] p-6 sm:p-10 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm cursor-text flex flex-col justify-between"
        >
          {/* Live stats HUD */}
          <div className="flex items-center justify-between text-xs font-mono pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
            <div className="flex items-center gap-6">
              <span className="text-indigo-600 dark:text-indigo-400 text-base font-bold">
                {timeLeft}s
              </span>
              <span className="text-neutral-400">
                WPM: <strong className="text-neutral-800 dark:text-neutral-200">{wpm}</strong>
              </span>
              <span className="text-neutral-400">
                ACC: <strong className="text-neutral-800 dark:text-neutral-200">{accuracy}%</strong>
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                restartTest();
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Restart Test"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Words Container */}
          <div
            ref={wordsContainerRef}
            className="flex flex-wrap gap-x-2.5 gap-y-3 font-mono text-lg sm:text-2xl leading-relaxed py-6 select-none max-h-48 overflow-hidden"
          >
            {words.map((word, wIdx) => {
              const isCurrentWord = wIdx === currentWordIndex;
              const isPastWord = wIdx < currentWordIndex;

              return (
                <span
                  key={wIdx}
                  className={`relative px-1 rounded transition-colors ${
                    isCurrentWord
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 font-semibold'
                      : isPastWord
                      ? 'opacity-40'
                      : 'text-neutral-400 dark:text-neutral-600'
                  }`}
                >
                  {word.split('').map((char, cIdx) => {
                    const isCurrentChar = isCurrentWord && cIdx === currentCharIndex;
                    let charColor = 'text-neutral-400 dark:text-neutral-600';

                    if (isCurrentWord) {
                      if (cIdx < currentCharIndex) {
                        charColor = 'text-emerald-600 dark:text-emerald-400';
                      } else if (cIdx === currentCharIndex) {
                        charColor = 'text-indigo-600 dark:text-indigo-300 underline';
                      }
                    } else if (isPastWord) {
                      charColor = 'text-neutral-700 dark:text-neutral-300';
                    }

                    return (
                      <span key={cIdx} className={`${charColor} relative`}>
                        {char}
                        {isCurrentChar && (
                          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                        )}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </div>

          {/* Hidden input to capture keystrokes */}
          <input
            ref={inputRef}
            type="text"
            className="opacity-0 absolute inset-0 pointer-events-none"
            onKeyDown={handleKeyDown}
            autoFocus
          />

          <div className="pt-4 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
            <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[10px]">
              Type any letter to begin
            </span>
            <span>·</span>
            <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[10px]">
              SPACE for next word
            </span>
          </div>
        </div>
      ) : (
        /* Results Screen */
        <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
              Test Completed!
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Mode: {timeMode}s · Language: {lang.toUpperCase()}
            </p>
          </div>

          {/* Results grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto py-4">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
              <div className="text-[11px] text-neutral-400 uppercase font-semibold">WPM</div>
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                {wpm}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
              <div className="text-[11px] text-neutral-400 uppercase font-semibold">Accuracy</div>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {accuracy}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
              <div className="text-[11px] text-neutral-400 uppercase font-semibold">Characters</div>
              <div className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mt-1">
                {correctCharsCount} <span className="text-xs text-neutral-400">/ {errorsCount} err</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
              <div className="text-[11px] text-neutral-400 uppercase font-semibold">Personal Best</div>
              <div className="text-2xl font-bold text-amber-500 mt-1">
                {Math.max(stats.bestWpm, wpm)}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={restartTest}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.retry}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
