import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Hash,
  BookA,
  Timer,
  Grid,
  Trophy,
  RotateCcw,
  Play,
  CheckCircle,
  XCircle,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';

export const MemoryTrainerView: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useApp();
  const [activeGame, setActiveGame] = useState<'number' | 'reaction' | 'pattern' | 'word'>('number');

  // --- GAME 1: NUMBER MEMORY ---
  const [numLevel, setNumLevel] = useState<number>(1);
  const [currentNumber, setCurrentNumber] = useState<string>('');
  const [numInput, setNumInput] = useState<string>('');
  const [numState, setNumState] = useState<'idle' | 'showing' | 'input' | 'result'>('idle');
  const [numBestLevel, setNumBestLevel] = useState<number>(1);

  const startNumberGame = () => {
    const digitCount = numLevel + 2; // Level 1 = 3 digits
    let generated = '';
    for (let i = 0; i < digitCount; i++) {
      generated += Math.floor(i === 0 ? 1 + Math.random() * 9 : Math.random() * 10).toString();
    }
    setCurrentNumber(generated);
    setNumInput('');
    setNumState('showing');

    // Show duration scales with length
    setTimeout(() => {
      setNumState('input');
    }, 1500 + digitCount * 400);
  };

  const submitNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (numInput === currentNumber) {
      const nextLevel = numLevel + 1;
      setNumLevel(nextLevel);
      if (nextLevel > numBestLevel) {
        setNumBestLevel(nextLevel);
      }
      showToast(`Level ${numLevel} cleared! Next: ${nextLevel + 2} digits`, 'success');
      startNumberGame();
    } else {
      setNumState('result');
    }
  };

  // --- GAME 2: REACTION TEST ---
  const [reactionState, setReactionState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestReactionTime, setBestReactionTime] = useState<number | null>(null);
  const reactionTimerRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startReactionTest = () => {
    setReactionState('waiting');
    setReactionTime(null);

    const delay = 1500 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      setReactionState('ready');
      reactionTimerRef.current = Date.now();
    }, delay);
  };

  const handleReactionClick = () => {
    if (reactionState === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setReactionState('idle');
      showToast('Too early! Wait for the screen to turn green.', 'warning');
    } else if (reactionState === 'ready') {
      const elapsed = Date.now() - (reactionTimerRef.current || Date.now());
      setReactionTime(elapsed);
      setReactionState('result');
      if (!bestReactionTime || elapsed < bestReactionTime) {
        setBestReactionTime(elapsed);
        showToast(`🎉 New Fastest Reaction: ${elapsed}ms!`, 'success');
      }
    }
  };

  // --- GAME 3: PATTERN MEMORY ---
  const [patternLevel, setPatternLevel] = useState<number>(1);
  const [patternSequence, setPatternSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [patternState, setPatternState] = useState<'idle' | 'display' | 'player' | 'failed'>('idle');
  const [patternActiveTile, setPatternActiveTile] = useState<number | null>(null);
  const [patternBest, setPatternBest] = useState<number>(1);

  const startPatternGame = (lvl = 1) => {
    setPatternLevel(lvl);
    setUserSequence([]);
    const count = lvl + 2; // Level 1 = 3 tiles
    const seq: number[] = [];
    for (let i = 0; i < count; i++) {
      seq.push(Math.floor(Math.random() * 9)); // 3x3 grid (0 to 8)
    }
    setPatternSequence(seq);
    setPatternState('display');

    // Display sequence step by step
    seq.forEach((tileIndex, idx) => {
      setTimeout(() => {
        setPatternActiveTile(tileIndex);
        setTimeout(() => setPatternActiveTile(null), 450);
      }, (idx + 1) * 600);
    });

    setTimeout(() => {
      setPatternState('player');
    }, (count + 1) * 600);
  };

  const handleTileClick = (index: number) => {
    if (patternState !== 'player') return;

    const nextStep = userSequence.length;
    if (patternSequence[nextStep] === index) {
      const updated = [...userSequence, index];
      setUserSequence(updated);

      if (updated.length === patternSequence.length) {
        const nextLvl = patternLevel + 1;
        if (nextLvl > patternBest) setPatternBest(nextLvl);
        showToast(`Pattern memorized! Level ${nextLvl}`, 'success');
        setTimeout(() => startPatternGame(nextLvl), 800);
      }
    } else {
      setPatternState('failed');
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t.memory}
            </h1>
            <p className="text-xs text-neutral-500">
              Neuroplasticity & Working Memory Training Games · Number Memory · Reflexes · Spatial Patterns
            </p>
          </div>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'number', label: '1. Number Memory', icon: Hash },
          { id: 'reaction', label: '2. Reaction Reflex', icon: Zap },
          { id: 'pattern', label: '3. Pattern Memory', icon: Grid },
        ].map((g) => {
          const Icon = g.icon;
          return (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeGame === g.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-purple-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{g.label}</span>
            </button>
          );
        })}
      </div>

      {/* GAME 1: NUMBER MEMORY CONTAINER */}
      {activeGame === 'number' && (
        <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm text-center space-y-6">
          <div className="flex items-center justify-between text-xs text-neutral-400 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <span>Current Level: <strong className="text-purple-600">{numLevel}</strong></span>
            <span>Personal Best Level: <strong className="text-neutral-800 dark:text-neutral-200">{numBestLevel}</strong></span>
          </div>

          {numState === 'idle' && (
            <div className="space-y-4 py-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Hash className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Number Memory Challenge
              </h2>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Remember the sequence of numbers shown on the screen. The number of digits increases by 1 each level.
              </p>
              <button
                onClick={startNumberGame}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Start Level {numLevel}
              </button>
            </div>
          )}

          {numState === 'showing' && (
            <div className="py-12 space-y-4 animate-fadeIn">
              <div className="text-[11px] text-neutral-400 uppercase tracking-widest font-bold">Memorize this number:</div>
              <div className="text-4xl sm:text-6xl font-black font-mono tracking-widest text-purple-600 dark:text-purple-400">
                {currentNumber}
              </div>
              <div className="w-48 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-purple-600 animate-pulse w-full" />
              </div>
            </div>
          )}

          {numState === 'input' && (
            <form onSubmit={submitNumber} className="py-6 space-y-4 max-w-xs mx-auto animate-fadeIn">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                What was the number?
              </label>
              <input
                type="text"
                autoFocus
                value={numInput}
                onChange={(e) => setNumInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Type the number"
                className="w-full text-center text-2xl font-mono px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-purple-500 text-neutral-900 dark:text-neutral-100"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm"
              >
                Submit Answer
              </button>
            </form>
          )}

          {numState === 'result' && (
            <div className="py-6 space-y-4 animate-fadeIn">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Incorrect Number
              </h3>
              <div className="text-xs text-neutral-500 space-y-1">
                <div>Correct number: <strong className="font-mono text-emerald-600">{currentNumber}</strong></div>
                <div>Your answer: <span className="font-mono text-rose-500">{numInput || '(empty)'}</span></div>
              </div>
              <button
                onClick={() => {
                  setNumLevel(1);
                  setNumState('idle');
                }}
                className="px-6 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
              >
                Try Again from Level 1
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: REACTION TEST CONTAINER */}
      {activeGame === 'reaction' && (
        <div
          onClick={handleReactionClick}
          className={`p-12 sm:p-20 rounded-2xl border shadow-sm text-center select-none cursor-pointer transition-colors duration-200 min-h-[360px] flex flex-col items-center justify-center space-y-4 ${
            reactionState === 'waiting'
              ? 'bg-rose-600 border-rose-700 text-white'
              : reactionState === 'ready'
              ? 'bg-emerald-500 border-emerald-600 text-white'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100'
          }`}
        >
          {reactionState === 'idle' && (
            <>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <Zap className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold">Reaction Reflex Test</h2>
              <p className="text-xs text-neutral-500 max-w-sm">
                Click anywhere to start. Wait for the box to turn green, then click as fast as humanly possible!
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startReactionTest();
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md"
              >
                Start Test
              </button>
            </>
          )}

          {reactionState === 'waiting' && (
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black">Wait for green...</h2>
              <p className="text-xs opacity-80">Do not click yet!</p>
            </div>
          )}

          {reactionState === 'ready' && (
            <div className="space-y-2">
              <h2 className="text-4xl sm:text-5xl font-black">CLICK NOW!</h2>
              <p className="text-xs opacity-90">Click as fast as you can!</p>
            </div>
          )}

          {reactionState === 'result' && (
            <div className="space-y-4">
              <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {reactionTime} ms
              </div>
              <p className="text-xs text-neutral-500">
                Best Record: <strong>{bestReactionTime} ms</strong> · Rating:{' '}
                {reactionTime && reactionTime < 200 ? 'Pro Gamer Reflexes' : 'Normal Human Speed'}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startReactionTest();
                }}
                className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Test Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 3: PATTERN MEMORY CONTAINER */}
      {activeGame === 'pattern' && (
        <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm text-center space-y-6">
          <div className="flex items-center justify-between text-xs text-neutral-400 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <span>Pattern Level: <strong className="text-purple-600">{patternLevel}</strong></span>
            <span>Tiles to recall: <strong className="text-neutral-800 dark:text-neutral-200">{patternLevel + 2}</strong></span>
          </div>

          {/* 3x3 Grid */}
          <div className="grid grid-cols-3 gap-3 w-64 h-64 mx-auto py-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((tileIdx) => {
              const isActive = patternActiveTile === tileIdx;
              const isSelected = userSequence.includes(tileIdx);

              return (
                <button
                  key={tileIdx}
                  onClick={() => handleTileClick(tileIdx)}
                  disabled={patternState !== 'player'}
                  className={`rounded-2xl transition-all duration-150 ${
                    isActive
                      ? 'bg-purple-600 scale-95 shadow-lg shadow-purple-500/40 ring-4 ring-purple-300'
                      : isSelected
                      ? 'bg-purple-400 dark:bg-purple-700'
                      : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                />
              );
            })}
          </div>

          <div className="pt-2">
            {patternState === 'idle' && (
              <button
                onClick={() => startPatternGame(1)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-semibold"
              >
                Start Pattern Level 1
              </button>
            )}

            {patternState === 'display' && (
              <span className="text-xs text-neutral-400 animate-pulse font-medium">
                Watch the pattern carefully...
              </span>
            )}

            {patternState === 'player' && (
              <span className="text-xs text-purple-600 font-bold">
                Your turn! Tap the tiles in exact order ({userSequence.length}/{patternSequence.length})
              </span>
            )}

            {patternState === 'failed' && (
              <div className="space-y-2">
                <span className="text-xs text-rose-500 font-bold">Pattern broken!</span>
                <div>
                  <button
                    onClick={() => startPatternGame(1)}
                    className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
                  >
                    Restart from Level 1
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
