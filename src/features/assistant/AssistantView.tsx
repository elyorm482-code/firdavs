import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCw,
  Sparkles,
  Bot,
  User,
  Code,
  BookOpen,
  Terminal,
  Languages,
  PenTool,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { aiService } from '../../services/aiService';
import { ChatMessage } from '../../types';

export const AssistantView: React.FC = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('ai_super_app_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: `👋 Hello! I am your **AI Super Assistant**.
How can I assist you today?
- **Programming & Debugging:** TypeScript, Python, React, SQL, etc.
- **STEM & Mathematics:** Calculus, physics, probability, proofs.
- **Writing & Translation:** Essays, emails, translations in EN, UZ, RU.
- **Study & Learning:** Step-by-step guides, summaries, exam preparation.

Feel free to ask any question or try one of the prompt starters below!`,
        timestamp: Date.now(),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('ai_super_app_chat_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: promptText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await aiService.chat(
        history,
        'You are an exceptional AI Super Assistant. Provide thorough, beautifully formatted Markdown responses with clear headings, bullet points, and code blocks where helpful.'
      );

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an issue processing your request. Please try again.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = async () => {
    if (messages.length < 2 || loading) return;
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.role === 'user');
    if (lastUserIndex === -1) return;

    const actualIndex = messages.length - 1 - lastUserIndex;
    const lastUserText = messages[actualIndex].content;
    const newHistory = messages.slice(0, actualIndex + 1);

    setMessages(newHistory);
    setLoading(true);

    try {
      const reply = await aiService.chat(
        newHistory.map((m) => ({ role: m.role, content: m.content })),
        'You are an exceptional AI Super Assistant. Provide thorough, beautifully formatted Markdown responses.'
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: reply,
          timestamp: Date.now(),
        },
      ]);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Conversation cleared. What would you like to work on now?',
        timestamp: Date.now(),
      },
    ]);
  };

  const promptStarters = [
    { label: 'Explain React 19 Server Actions', icon: Code, text: 'Explain how React Server Actions work with concrete code examples.' },
    { label: 'Teach me Quantum Computing Basics', icon: BookOpen, text: 'Explain the core principles of quantum computing in simple terms with analogies.' },
    { label: 'Solve Differential Equation', icon: Terminal, text: 'Solve dy/dx + 2y = 4x step-by-step and show the general solution.' },
    { label: 'Professional English Email', icon: PenTool, text: 'Write a professional email requesting project deadline extension gracefully.' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
      {/* Chat Top Bar */}
      <div className="h-14 px-4 sm:px-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <span>{t.assistant}</span>
              <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Gemini 3.8 Ready
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleSend('Start fresh topic')}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs flex items-center gap-1 transition-colors"
            title={t.newChat}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t.newChat}</span>
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs flex items-center gap-1 transition-colors"
            title={t.clearChat}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                  isUser
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-indigo-600 text-white shadow-sm'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1.5 max-w-[85%] sm:max-w-2xl">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 rounded-tl-none border border-neutral-200/60 dark:border-neutral-700/40'
                  }`}
                >
                  {renderFormattedContent(msg.content)}
                </div>

                {/* Message Action bar */}
                {!isUser && (
                  <div className="flex items-center gap-3 px-1 text-[11px] text-neutral-400">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center gap-1 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">{t.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{t.copy}</span>
                        </>
                      )}
                    </button>
                    <span>·</span>
                    <button
                      onClick={handleRegenerate}
                      disabled={loading}
                      className="hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>{t.regenerate}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center gap-2 text-xs text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              <span>{t.loading}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Starters (shown when short conversation) */}
      {messages.length <= 2 && (
        <div className="px-4 sm:px-6 py-2 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40">
          <div className="text-[11px] text-neutral-400 mb-1.5 font-medium">Quick Starters:</div>
          <div className="flex flex-wrap gap-2">
            {promptStarters.map((starter, i) => {
              const Icon = starter.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSend(starter.text)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all text-left"
                >
                  <Icon className="w-3 h-3 text-indigo-500" />
                  <span>{starter.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="p-3 sm:p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.typeMessage}
            disabled={loading}
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-indigo-500 rounded-xl outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t.send}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

function renderFormattedContent(text: string) {
  // Simple clean markdown parser for code blocks and bold highlights
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const firstLineEnd = part.indexOf('\n');
      const lang = part.slice(3, firstLineEnd).trim() || 'code';
      const code = part.slice(firstLineEnd + 1, -3);

      return (
        <div key={index} className="my-2 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 text-neutral-100 font-mono text-xs">
          <div className="px-3 py-1.5 bg-neutral-900 border-b border-neutral-800 text-[10px] text-neutral-400 flex items-center justify-between uppercase">
            <span>{lang}</span>
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Copy
            </button>
          </div>
          <pre className="p-3 overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      );
    }

    return <span key={index}>{part}</span>;
  });
}
