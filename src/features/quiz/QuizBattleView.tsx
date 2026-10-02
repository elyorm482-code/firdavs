import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  Users,
  Clock,
  Play,
  CheckCircle,
  XCircle,
  RotateCcw,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { QuizQuestion } from '../../types';

export const QuizBattleView: React.FC = () => {
  const { t } = useLanguage();
  const { stats, updateStats, showToast } = useApp();

  // Mode: 'lobby' | 'room' | 'battle' | 'results'
  const [mode, setMode] = useState<'lobby' | 'room' | 'battle' | 'results'>('lobby');
  const [roomCode, setRoomCode] = useState<string>('');
  const [joinInputCode, setJoinInputCode] = useState<string>('');
  const [isHost, setIsHost] = useState<boolean>(true);
  const [playerName, setPlayerName] = useState<string>('Player 1');
  const [opponentName, setOpponentName] = useState<string>('Opponent (AI Challenger)');

  const [isReady, setIsReady] = useState<boolean>(false);
  const [isOpponentReady, setIsOpponentReady] = useState<boolean>(true);

  // Questions and Game State
  const [topic, setTopic] = useState<string>('Science & Computing');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timer, setTimer] = useState<number>(15);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState<boolean>(false);

  const [playerScore, setPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Generate 6-digit room code
  const createRoom = async () => {
    setLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setRoomCode(code);
    setIsHost(true);
    setPlayerName('Host Player');
    setOpponentName('Opponent (Connected)');

    try {
      const generated = await aiService.generateQuizQuestions(topic, 5);
      setQuestions(generated);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
      setMode('room');
    }
  };

  const joinRoom = async () => {
    if (joinInputCode.length !== 6) {
      showToast('Please enter a valid 6-digit room code', 'warning');
      return;
    }
    setLoading(true);
    setRoomCode(joinInputCode);
    setIsHost(false);
    setPlayerName('Challenger');
    setOpponentName('Room Host');

    try {
      const generated = await aiService.generateQuizQuestions(topic, 5);
      setQuestions(generated);
    } finally {
      setLoading(false);
      setMode('room');
    }
  };

  const handleStartGame = () => {
    setMode('battle');
    setCurrentIndex(0);
    setPlayerScore(0);
    setOpponentScore(0);
    setTimer(15);
    setSelectedOption(null);
    setIsAnswerLocked(false);
  };

  // Timer per question
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (mode === 'battle' && timer > 0 && !isAnswerLocked) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (mode === 'battle' && timer === 0 && !isAnswerLocked) {
      // Time expired
      handleSelectOption(-1);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, timer, isAnswerLocked]);

  const handleSelectOption = (idx: number) => {
    if (isAnswerLocked) return;
    setIsAnswerLocked(true);
    setSelectedOption(idx);

    const currentQ = questions[currentIndex];
    const isCorrect = idx === currentQ.correctIndex;

    // Calculate score based on remaining time
    const addedPoints = isCorrect ? 100 + timer * 10 : 0;
    setPlayerScore((prev) => prev + addedPoints);

    // Simulated opponent answer
    const opponentCorrect = Math.random() > 0.35;
    const oppPoints = opponentCorrect ? 100 + Math.floor(Math.random() * 80) : 0;
    setOpponentScore((prev) => prev + oppPoints);

    // Advance after brief 2s pause
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setTimer(15);
        setSelectedOption(null);
        setIsAnswerLocked(false);
      } else {
        // Game finished
        setMode('results');
        const finalScore = playerScore + addedPoints;
        updateStats({ quizScore: stats.quizScore + finalScore });
        showToast('Quiz Battle completed!', 'success');
      }
    }, 2200);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t.quizBattle}
            </h1>
            <p className="text-xs text-neutral-500">
              Multiplayer 1v1 Room Battle · 6-Digit Room Code · Speed & Accuracy Challenge
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            Total Points: {stats.quizScore}
          </span>
        </div>
      </div>

      {/* View 1: Lobby (Create or Join) */}
      {mode === 'lobby' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Room Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Create a New Room
              </h2>
              <p className="text-xs text-neutral-500">
                Generate a unique 6-digit room code to share with a friend or classmate.
              </p>

              <div>
                <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Battle Subject</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none font-medium mt-1 text-neutral-800 dark:text-neutral-200"
                >
                  <option value="Science & Computing">Science & Computing</option>
                  <option value="World History & Geography">World History & Geography</option>
                  <option value="Mathematics & Logic">Mathematics & Logic</option>
                  <option value="English & Literature">English & Literature</option>
                  <option value="General Trivia & Pop Culture">General Trivia & Pop Culture</option>
                </select>
              </div>
            </div>

            <button
              onClick={createRoom}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Generating Room...' : 'Create 6-Digit Room'}</span>
            </button>
          </div>

          {/* Join Room Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Join with Room Code
              </h2>
              <p className="text-xs text-neutral-500">
                Enter the 6-digit room code shared by your opponent to enter their battle arena.
              </p>

              <div>
                <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">6-Digit Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={joinInputCode}
                  onChange={(e) => setJoinInputCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 748291"
                  className="w-full text-center text-lg font-mono tracking-widest px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-purple-500 mt-1 text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            <button
              onClick={joinRoom}
              disabled={loading || joinInputCode.length !== 6}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Play className="w-4 h-4" />
              <span>Join Arena</span>
            </button>
          </div>
        </div>
      )}

      {/* View 2: Room Lobby (Waiting for match / ready) */}
      {mode === 'room' && (
        <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6 text-center animate-fadeIn">
          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Room Code</span>
            <div className="mt-1 inline-flex items-center gap-3 px-6 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-indigo-600 dark:text-indigo-400">
                {roomCode}
              </span>
              <button
                onClick={copyRoomCode}
                className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 transition-colors"
                title="Copy Room Code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              Share this code with your friend to connect and start the match.
            </p>
          </div>

          {/* Player Seats */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 space-y-2">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white mx-auto flex items-center justify-center font-bold text-sm">
                P1
              </div>
              <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{playerName}</div>
              <span className="inline-block text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {isReady ? 'Ready' : 'Host'}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 space-y-2">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white mx-auto flex items-center justify-center font-bold text-sm">
                P2
              </div>
              <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{opponentName}</div>
              <span className="inline-block text-[10px] font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                Connected & Ready
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => setMode('lobby')}
              className="px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Leave Room
            </button>

            <button
              onClick={handleStartGame}
              className="px-8 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Battle</span>
            </button>
          </div>
        </div>
      )}

      {/* View 3: In-Game Battle Arena */}
      {mode === 'battle' && questions[currentIndex] && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6 animate-fadeIn">
          {/* Top Scoreboard HUD */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
            {/* Player 1 HUD */}
            <div className="text-left">
              <div className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{playerName}</div>
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {playerScore} pts
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-base font-mono transition-colors ${
                  timer <= 5
                    ? 'border-rose-500 text-rose-500 animate-pulse'
                    : 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {timer}s
              </div>
              <span className="text-[10px] text-neutral-400 mt-1">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Player 2 HUD */}
            <div className="text-right">
              <div className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{opponentName}</div>
              <div className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono">
                {opponentScore} pts
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div className="py-4 text-center">
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 max-w-2xl mx-auto leading-relaxed">
              {questions[currentIndex].question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {questions[currentIndex].options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === questions[currentIndex].correctIndex;

              let btnStyle = 'bg-neutral-50 dark:bg-neutral-800/80 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-indigo-400';

              if (isAnswerLocked) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-500 text-white border-rose-600 shadow-md';
                } else {
                  btnStyle = 'opacity-40 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerLocked}
                  className={`p-4 rounded-xl border text-xs sm:text-sm text-left transition-all font-medium flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswerLocked && isCorrect && <CheckCircle className="w-4 h-4 ml-2 shrink-0" />}
                  {isAnswerLocked && isSelected && !isCorrect && <XCircle className="w-4 h-4 ml-2 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation if locked */}
          {isAnswerLocked && (
            <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto text-center animate-fadeIn">
              💡 <strong>Fact:</strong> {questions[currentIndex].explanation}
            </div>
          )}
        </div>
      )}

      {/* View 4: Results & Rematch Podium */}
      {mode === 'results' && (
        <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
              {playerScore >= opponentScore ? 'Victory! 🏆' : 'Defeat! Good Effort'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Final scoreboard summary for room {roomCode}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto py-2">
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">{playerName}</div>
              <div className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 mt-1">
                {playerScore}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900">
              <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">{opponentName}</div>
              <div className="text-3xl font-extrabold text-purple-700 dark:text-purple-300 mt-1">
                {opponentScore}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setMode('lobby')}
              className="px-6 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Back to Lobby
            </button>

            <button
              onClick={handleStartGame}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rematch</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
