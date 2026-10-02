import React, { useState } from 'react';
import {
  BookOpen,
  Upload,
  FileText,
  Sparkles,
  HelpCircle,
  FileCheck,
  List,
  Layers,
  Edit3,
  Copy,
  Check,
  FileCode,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { aiService } from '../../services/aiService';

const SAMPLE_DOCUMENT = `Title: Foundations of Modern Artificial Intelligence & Neural Networks
Author: Dr. Elena Rostova
Date: March 2026

1. Introduction
Artificial Intelligence has undergone exponential evolution, shifting from rule-based expert systems to large-scale generative foundation models. At the heart of this revolution is the Transformer architecture, introduced by Vaswani et al. in 2017. Transformers leverage multi-head self-attention mechanisms to process sequential information in parallel, overcoming the sequential latency bottlenecks of Recurrent Neural Networks (RNNs) and Long Short-Term Memory (LSTM) networks.

2. Core Mechanism of Self-Attention
Self-attention maps a query and a set of key-value pairs to an output. The mathematical representation is formulated as:
Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V
Here, Q represents queries, K represents keys, and V represents values, with d_k signifying the dimension of the keys. Scaling by the square root of d_k prevents the dot products from growing excessively large in high-dimensional spaces, which would otherwise push the softmax function into regions with vanishing gradients.

3. Pre-training and Post-training Alignment
Modern Large Language Models undergo two principal phases:
A) Self-Supervised Pre-training: Models ingest trillions of tokens from web, code, and books to learn next-token probability distributions.
B) Post-Training Alignment: Includes Reinforcement Learning from Human Feedback (RLHF), Direct Preference Optimization (DPO), and Supervised Fine-Tuning (SFT) to instill safety, helpfulness, and factual consistency.

4. Challenges & Future Horizons
Despite extraordinary zero-shot and few-shot capabilities, key hurdles remain:
- Hallucinations: Generating plausible yet factually incorrect assertions.
- Context Window Scalability: Managing quadratic computational complexity O(N^2) across 1M+ token context lengths.
- Energy and Compute Demands: Carbon footprint and GPU cluster costs.
Future research converges on Test-Time Compute scaling, sparse mixture-of-experts (MoE), and neuromorphic hardware architectures.`;

export const BookAssistantView: React.FC = () => {
  const { t } = useLanguage();
  const [docName, setDocName] = useState<string>('Foundations_of_Modern_AI.txt');
  const [docText, setDocText] = useState<string>(SAMPLE_DOCUMENT);
  const [status, setStatus] = useState<'ready' | 'processing'>('ready');
  const [activeTab, setActiveTab] = useState<'summarize' | 'questions' | 'quiz' | 'flashcards' | 'keypoints' | 'notes'>('summarize');
  const [query, setQuery] = useState<string>('How does self-attention work and why is scaling applied?');
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('processing');
    setDocName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setDocText(content || 'No text extracted.');
      setStatus('ready');
      setOutput(null);
    };
    reader.readAsText(file);
  };

  const handleAction = async (action: 'summarize' | 'questions' | 'quiz' | 'flashcards' | 'keypoints' | 'notes') => {
    setActiveTab(action);
    if (!docText.trim() || loading) return;

    setLoading(true);
    try {
      const result = await aiService.analyzeDocument(docText, action, query);
      setOutput(result);
    } catch {
      setOutput('Failed to analyze document. Please check connection and try again.');
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
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Document Status & Upload Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {docName}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                {status === 'ready' ? 'Indexed & Ready' : 'Processing...'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {docText.length} characters · ~{Math.round(docText.split(/\s+/).length)} words
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-semibold transition-colors">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload PDF / TXT</span>
          <input
            type="file"
            accept=".txt,.pdf,.md,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Main Grid: Document Preview & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Document Raw Preview */}
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200">
              <FileText className="w-4 h-4 text-neutral-400" />
              <span>Document Text Inspector</span>
            </div>
            <button
              onClick={() => {
                setDocName('Foundations_of_Modern_AI.txt');
                setDocText(SAMPLE_DOCUMENT);
                setOutput(null);
              }}
              className="text-[11px] text-indigo-600 hover:underline"
            >
              Reset to Sample
            </button>
          </div>

          <textarea
            value={docText}
            onChange={(e) => setDocText(e.target.value)}
            className="flex-1 w-full mt-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-mono leading-relaxed text-neutral-800 dark:text-neutral-200 outline-none resize-none focus:border-indigo-500"
            placeholder="Paste or upload text from your book, research paper or lecture notes..."
          />
        </div>

        {/* Right: AI Intelligence Panel */}
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm flex flex-col h-[520px]">
          {/* Action Tabs */}
          <div className="flex flex-wrap gap-1.5 pb-3 border-b border-neutral-200 dark:border-neutral-800">
            {[
              { id: 'summarize', label: 'Summarize', icon: FileCheck },
              { id: 'questions', label: 'Q&A', icon: HelpCircle },
              { id: 'quiz', label: 'Quiz', icon: Sparkles },
              { id: 'flashcards', label: 'Flashcards', icon: Layers },
              { id: 'keypoints', label: 'Key Points', icon: List },
              { id: 'notes', label: 'Study Notes', icon: Edit3 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleAction(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Q&A specific search bar */}
          {activeTab === 'questions' && (
            <div className="pt-3 flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask specific question based on this text..."
                className="flex-1 text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl outline-none focus:border-indigo-500 text-neutral-900 dark:text-neutral-100"
              />
              <button
                onClick={() => handleAction('questions')}
                disabled={loading}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
              >
                Ask
              </button>
            </div>
          )}

          {/* Output Content Scrollable */}
          <div className="flex-1 overflow-y-auto mt-3 p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700/60 relative">
            {output && (
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 text-xs flex items-center gap-1 shadow-sm"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}

            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-3 text-neutral-400">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                <div className="text-xs font-medium">Extracting document intelligence...</div>
              </div>
            ) : output ? (
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-neutral-800 dark:text-neutral-200 font-sans">
                {output}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-2 text-center p-4">
                <Sparkles className="w-8 h-8 mx-auto text-indigo-500" />
                <p className="text-xs">
                  Click any action above (<strong className="text-neutral-700 dark:text-neutral-300">Summarize</strong>, <strong className="text-neutral-700 dark:text-neutral-300">Flashcards</strong>, or <strong className="text-neutral-700 dark:text-neutral-300">Q&A</strong>) to extract insights from this document.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
