import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  dashboard: string;
  assistant: string;
  teacher: string;
  typing: string;
  bookAssistant: string;
  math: string;
  english: string;
  code: string;
  poster: string;
  homework: string;
  quizBattle: string;
  password: string;
  finance: string;
  memory: string;
  interview: string;
  studyPlanner: string;
  settings: string;
  searchTools: string;
  welcomeBack: string;
  todayStats: string;
  studyHours: string;
  completedTasks: string;
  bestWpm: string;
  quizScore: string;
  mathSolved: string;
  recentTools: string;
  quickActions: string;
  financeSummary: string;
  totalIncome: string;
  totalExpense: string;
  balance: string;
  tasksToday: string;
  solveMath: string;
  startTyping: string;
  askAi: string;
  newChat: string;
  copy: string;
  copied: string;
  regenerate: string;
  clearChat: string;
  typeMessage: string;
  send: string;
  loading: string;
  selectSubject: string;
  selectLevel: string;
  explainSimpler: string;
  giveExample: string;
  generateExercises: string;
  generateQuiz: string;
  solve: string;
  stepByStep: string;
  finalAnswer: string;
  generateSimilar: string;
  typingMode: string;
  wpm: string;
  accuracy: string;
  timeRemaining: string;
  retry: string;
  save: string;
  delete: string;
  edit: string;
  cancel: string;
  language: string;
  theme: string;
  lightMode: string;
  darkMode: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'AI Super App',
    tagline: 'Learn. Create. Code. Practice. Improve.',
    dashboard: 'Dashboard',
    assistant: 'AI Assistant',
    teacher: 'AI Teacher',
    typing: 'Typing Master',
    bookAssistant: 'Book Assistant',
    math: 'Math Solver',
    english: 'English Teacher',
    code: 'Code Helper',
    poster: 'Poster Generator',
    homework: 'Homework Generator',
    quizBattle: 'Quiz Battle',
    password: 'Password Tools',
    finance: 'Finance',
    memory: 'Memory Trainer',
    interview: 'Interview Simulator',
    studyPlanner: 'Study Planner',
    settings: 'Settings',
    searchTools: 'Search 15 tools or press ⌘K...',
    welcomeBack: 'Welcome to your AI Super App',
    todayStats: 'Overview & Statistics',
    studyHours: 'Study Hours',
    completedTasks: 'Completed Tasks',
    bestWpm: 'Best Typing WPM',
    quizScore: 'Quiz Score',
    mathSolved: 'Math Solved',
    recentTools: 'Recently Used Tools',
    quickActions: 'Quick Launch',
    financeSummary: 'Financial Snapshot',
    totalIncome: 'Total Income',
    totalExpense: 'Total Expenses',
    balance: 'Net Balance',
    tasksToday: "Today's Study Checklist",
    solveMath: 'Solve Equation',
    startTyping: 'Typing Speed Test',
    askAi: 'Ask Super AI',
    newChat: 'New Conversation',
    copy: 'Copy',
    copied: 'Copied!',
    regenerate: 'Regenerate',
    clearChat: 'Clear History',
    typeMessage: 'Ask anything, explore ideas, generate code or plans...',
    send: 'Send',
    loading: 'Thinking...',
    selectSubject: 'Select Subject',
    selectLevel: 'Select Education Level',
    explainSimpler: 'Explain Simpler',
    giveExample: 'Give Another Example',
    generateExercises: 'Generate Practice Exercises',
    generateQuiz: 'Generate Quiz',
    solve: 'Solve Step-by-Step',
    stepByStep: 'Detailed Steps',
    finalAnswer: 'Final Result',
    generateSimilar: 'Generate Similar Problem',
    typingMode: 'Duration Mode',
    wpm: 'WPM',
    accuracy: 'Accuracy',
    timeRemaining: 'Seconds Left',
    retry: 'Restart Test',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    cancel: 'Cancel',
    language: 'Interface Language',
    theme: 'Display Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
  },
  uz: {
    appName: 'AI Super App',
    tagline: "O'rganing. Yarating. Kod yozing. Mashq qiling. Rivojlaning.",
    dashboard: 'Bosh sahifa',
    assistant: 'AI Yordamchi',
    teacher: 'AI O‘qituvchi',
    typing: 'Tez Yozish (Typing)',
    bookAssistant: 'Kitob/PDF Yordamchi',
    math: 'Aqlli Matematik',
    english: 'Ingliz Tili Ustozi',
    code: 'Dasturlash Yordamchisi',
    poster: 'Poster Generator',
    homework: 'Vazifa Generator',
    quizBattle: 'Viktorina Jang (Quiz)',
    password: 'Parol Asboblari',
    finance: 'Shaxsiy Moliya',
    memory: 'Xotira Mashqlari',
    interview: 'Intervyu Simulyatori',
    studyPlanner: 'O‘qish Rejalashtiruvchi',
    settings: 'Sozlamalar',
    searchTools: '15 ta vositalardan qidirish...',
    welcomeBack: 'AI Super App ilovasiga xush kelibsiz',
    todayStats: 'Statistika va Ko‘rsatkichlar',
    studyHours: 'O‘qish Vaqti',
    completedTasks: 'Bajarilgan Vazifalar',
    bestWpm: 'Eng Yuqori WPM',
    quizScore: 'Viktorina Balli',
    mathSolved: 'Yechilgan Masalalar',
    recentTools: 'Yaqinda Ishlatilganlar',
    quickActions: 'Tezkor Amallar',
    financeSummary: 'Moliyaviy Holat',
    totalIncome: 'Jami Daromad',
    totalExpense: 'Jami Xarajat',
    balance: 'Qoldiq Balans',
    tasksToday: 'Bugungi Rejalar',
    solveMath: 'Masala Yechish',
    startTyping: 'Tezlik Sinovi',
    askAi: 'Savol Berish',
    newChat: 'Yangi Suhbat',
    copy: 'Nusxalash',
    copied: 'Nusxalandi!',
    regenerate: 'Qayta Yaratish',
    clearChat: 'Tozalash',
    typeMessage: 'Istalgan savol bering, dasturlash yoki matematika...',
    send: 'Yuborish',
    loading: 'O‘ylanmoqda...',
    selectSubject: 'Fanni Tanlang',
    selectLevel: 'Darajani Tanlang',
    explainSimpler: 'Oddiyroq Tushuntir',
    giveExample: 'Boshqa Misol Keltir',
    generateExercises: 'Mashqlar Yaratish',
    generateQuiz: 'Test Yaratish',
    solve: 'Qadamma-Qadam Yechish',
    stepByStep: 'Batafsil Bosqichlar',
    finalAnswer: 'Yakuniy Javob',
    generateSimilar: 'Shunga O‘xshash Masala',
    typingMode: 'Vaqt Rejimi',
    wpm: 'WPM (so‘z/daq)',
    accuracy: 'Aniqlik',
    timeRemaining: 'Qolgan Vaqt',
    retry: 'Qaytadan Boshlash',
    save: 'Saqlash',
    delete: 'O‘chirish',
    edit: 'Tahrirlash',
    cancel: 'Bekor Qilish',
    language: 'Ilova Tili',
    theme: 'Mavzu (Tema)',
    lightMode: 'Yorug‘ Rejim',
    darkMode: 'Qorong‘i Rejim',
  },
  ru: {
    appName: 'AI Super App',
    tagline: 'Учитесь. Создавайте. Кодите. Практикуйтесь. Развивайтесь.',
    dashboard: 'Панель управления',
    assistant: 'AI Ассистент',
    teacher: 'AI Учитель',
    typing: 'Клавиатурный тренажер',
    bookAssistant: 'Книжный/PDF Ассистент',
    math: 'Математический решатель',
    english: 'Учитель английского',
    code: 'Помощник по коду',
    poster: 'Генератор постеров',
    homework: 'Генератор домашних заданий',
    quizBattle: 'Квиз-битва',
    password: 'Менеджер паролей',
    finance: 'Личные финансы',
    memory: 'Тренировка памяти',
    interview: 'Симулятор собеседований',
    studyPlanner: 'Планировщик обучения',
    settings: 'Настройки',
    searchTools: 'Поиск по 15 инструментам...',
    welcomeBack: 'Добро пожаловать в AI Super App',
    todayStats: 'Статистика и обзор',
    studyHours: 'Часы учебы',
    completedTasks: 'Выполненные задачи',
    bestWpm: 'Рекорд WPM',
    quizScore: 'Очки викторины',
    mathSolved: 'Решено задач',
    recentTools: 'Недавние инструменты',
    quickActions: 'Быстрый запуск',
    financeSummary: 'Финансовый обзор',
    totalIncome: 'Доходы',
    totalExpense: 'Расходы',
    balance: 'Баланс',
    tasksToday: 'Задачи на сегодня',
    solveMath: 'Решить задачу',
    startTyping: 'Тест скорости',
    askAi: 'Спросить AI',
    newChat: 'Новый чат',
    copy: 'Копировать',
    copied: 'Скопировано!',
    regenerate: 'Перегенерировать',
    clearChat: 'Очистить историю',
    typeMessage: 'Задайте вопрос, опишите задачу, запросите код...',
    send: 'Отправить',
    loading: 'Думает...',
    selectSubject: 'Выберите предмет',
    selectLevel: 'Уровень сложности',
    explainSimpler: 'Объяснить проще',
    giveExample: 'Другой пример',
    generateExercises: 'Создать упражнения',
    generateQuiz: 'Создать тест',
    solve: 'Решить пошагово',
    stepByStep: 'Подробное решение',
    finalAnswer: 'Итоговый ответ',
    generateSimilar: 'Похожая задача',
    typingMode: 'Длительность теста',
    wpm: 'WPM (слов/мин)',
    accuracy: 'Точность',
    timeRemaining: 'Осталось секунд',
    retry: 'Повторить тест',
    save: 'Сохранить',
    delete: 'Удалить',
    edit: 'Изменить',
    cancel: 'Отмена',
    language: 'Язык приложения',
    theme: 'Тема оформления',
    lightMode: 'Светлая тема',
    darkMode: 'Темная тема',
  },
};
