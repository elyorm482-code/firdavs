import React, { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  PieChart,
  Calendar,
  Filter,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { FinanceTransaction } from '../../types';

const INITIAL_TRANSACTIONS: FinanceTransaction[] = [
  { id: '1', type: 'income', category: 'Education', amount: 3200, title: 'Freelance Software Project', date: '2026-03-28' },
  { id: '2', type: 'income', category: 'Other', amount: 1600, title: 'Tutoring Stipend', date: '2026-03-25' },
  { id: '3', type: 'expense', category: 'Food', amount: 340, title: 'Groceries & Meal Prep', date: '2026-03-27' },
  { id: '4', type: 'expense', category: 'Transport', amount: 120, title: 'Metro & Train Pass', date: '2026-03-24' },
  { id: '5', type: 'expense', category: 'Bills', amount: 280, title: 'Cloud Server & Internet', date: '2026-03-22' },
  { id: '6', type: 'expense', category: 'Education', amount: 190, title: 'AI Research Books & Subscriptions', date: '2026-03-20' },
  { id: '7', type: 'expense', category: 'Entertainment', amount: 150, title: 'Concert & Cinema', date: '2026-03-18' },
];

export const FinanceTrackerView: React.FC = () => {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('ai_super_app_finance');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<FinanceTransaction['category']>('Food');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('ai_super_app_finance', JSON.stringify(transactions));
  }, [transactions]);

  const categories: FinanceTransaction['category'][] = [
    'Food',
    'Transport',
    'Education',
    'Shopping',
    'Entertainment',
    'Bills',
    'Other',
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newTx: FinanceTransaction = {
      id: Date.now().toString(),
      type,
      category,
      amount: parsedAmount,
      title: title.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions((prev) => [newTx, ...prev]);
    setTitle('');
    setAmount('');
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Category Breakdown for expenses
  const categoryTotals = categories.map((cat) => {
    const total = transactions
      .filter((t) => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    return { category: cat, total };
  }).filter((c) => c.total > 0);

  const filteredTransactions = transactions.filter((t) =>
    filterCategory === 'All' ? true : t.category === filterCategory
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t.finance}
            </h1>
            <p className="text-xs text-neutral-500">
              Real-time Ledger · Cashflow Analytics · Expense Category Breakdown
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Net Balance */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {t.balance}
          </span>
          <div className="my-2">
            <div className={`text-2xl sm:text-3xl font-black ${balance >= 0 ? 'text-neutral-900 dark:text-neutral-100' : 'text-rose-600'}`}>
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Healthy Savings Rate: {totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        {/* Total Income */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {t.totalIncome}
          </span>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              +${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              From {transactions.filter((t) => t.type === 'income').length} sources
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {t.totalExpense}
          </span>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
              -${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Across {categoryTotals.length} active categories
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Category Breakdown Visual Bar Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-emerald-600" />
          <span>Expense Distribution by Category</span>
        </h2>

        {/* Stacked Visual Bar */}
        <div className="h-4 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex">
          {categoryTotals.map((cat, i) => {
            const width = totalExpense > 0 ? (cat.total / totalExpense) * 100 : 0;
            const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500'];
            return (
              <div
                key={cat.category}
                style={{ width: `${width}%` }}
                className={`${colors[i % colors.length]} h-full transition-all`}
                title={`${cat.category}: $${cat.total}`}
              />
            );
          })}
        </div>

        {/* Categories Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {categoryTotals.map((cat, i) => {
            const pct = totalExpense > 0 ? Math.round((cat.total / totalExpense) * 100) : 0;
            return (
              <div key={cat.category} className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60">
                <div className="text-[11px] text-neutral-500 font-medium">{cat.category}</div>
                <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  ${cat.total} <span className="text-[10px] text-neutral-400 font-normal">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Transaction History ({filteredTransactions.length})
          </h2>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none font-medium"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-2">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex items-center justify-between gap-3 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                    tx.type === 'income'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-rose-500/10 text-rose-600'
                  }`}
                >
                  {tx.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>

                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {tx.title}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {tx.category} · {tx.date}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-bold font-mono ${
                    tx.type === 'income'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                </span>

                <button
                  onClick={() => handleDelete(tx.id)}
                  className="p-1 rounded text-neutral-400 hover:text-rose-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Record New Transaction
            </h3>

            <form onSubmit={handleAdd} className="space-y-3">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-1.5 rounded-lg text-xs font-semibold ${
                    type === 'expense' ? 'bg-white dark:bg-neutral-900 text-rose-600 shadow-sm' : 'text-neutral-500'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-1.5 rounded-lg text-xs font-semibold ${
                    type === 'income' ? 'bg-white dark:bg-neutral-900 text-emerald-600 shadow-sm' : 'text-neutral-500'
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Textbook, Groceries, Tutoring"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 mt-1 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 mt-1 outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 mt-1 outline-none font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
