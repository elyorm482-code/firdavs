export type ToolId =
  | 'dashboard'
  | 'assistant'
  | 'teacher'
  | 'typing'
  | 'book-assistant'
  | 'math'
  | 'english'
  | 'code'
  | 'poster'
  | 'homework'
  | 'quiz-battle'
  | 'password'
  | 'finance'
  | 'memory'
  | 'interview'
  | 'study-planner'
  | 'settings';

export type Language = 'en' | 'uz' | 'ru';
export type Theme = 'dark' | 'light';

export interface UserStats {
  studyHours: number;
  completedTasks: number;
  bestWpm: number;
  quizScore: number;
  mathSolved: number;
  streakDays: number;
  lastActiveDate: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface FinanceTransaction {
  id: string;
  type: 'income' | 'expense';
  category: 'Food' | 'Transport' | 'Education' | 'Shopping' | 'Entertainment' | 'Bills' | 'Other';
  amount: number;
  title: string;
  date: string;
}

export interface PasswordItem {
  id: string;
  title: string;
  username: string;
  passwordEncrypted: string;
  category: string;
  createdAt: string;
}

export interface StudyTask {
  id: string;
  title: string;
  day: string;
  durationMinutes: number;
  completed: boolean;
  subject: string;
}

export interface StudyPlan {
  id: string;
  goal: string;
  deadline: string;
  hoursPerDay: number;
  currentLevel: string;
  subjects: string[];
  tasks: StudyTask[];
  weeklyFocus: string[];
  monthlyMilestones: string[];
  createdAt: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizBattleRoom {
  code: string;
  hostName: string;
  guestName?: string;
  isHostReady: boolean;
  isGuestReady: boolean;
  status: 'waiting' | 'in-progress' | 'finished';
  currentQuestionIndex: number;
  hostScore: number;
  guestScore: number;
  questions: QuizQuestion[];
}

export interface TypingScoreRecord {
  id: string;
  wpm: number;
  accuracy: number;
  errors: number;
  mode: number;
  language: string;
  date: string;
}

export interface MemoryScores {
  numberBestLevel: number;
  wordBestScore: number;
  reactionBestMs: number;
  patternBestLevel: number;
}
