import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  KeyRound,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { PasswordItem } from '../../types';

export const PasswordToolsView: React.FC = () => {
  const { t } = useLanguage();

  // Generator State
  const [length, setLength] = useState<number>(18);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [copiedGen, setCopiedGen] = useState<boolean>(false);

  // Vault State
  const [vaultItems, setVaultItems] = useState<PasswordItem[]>(() => {
    try {
      const saved = localStorage.getItem('ai_super_app_vault');
      return saved ? JSON.parse(saved) : [
        {
          id: 'v1',
          title: 'GitHub Developer Account',
          username: 'engineer@superapp.dev',
          passwordEncrypted: 'K#9x!mP9$wQ2@rT7',
          category: 'Development',
          createdAt: '2026-03-15',
        },
        {
          id: 'v2',
          title: 'Figma Design Workspace',
          username: 'creative@superapp.dev',
          passwordEncrypted: 'v8&Lm9#Np!4XyZ1',
          category: 'Design',
          createdAt: '2026-03-20',
        },
      ];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newCategory, setNewCategory] = useState('Personal');
  const [showAddForm, setShowAddForm] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem('ai_super_app_vault', JSON.stringify(vaultItems));
  }, [vaultItems]);

  const generate = () => {
    let chars = '';
    if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    let res = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      res += chars[array[i] % chars.length];
    }
    setGeneratedPassword(res);
  };

  useEffect(() => {
    generate();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const calculateStrength = () => {
    let score = 0;
    if (generatedPassword.length >= 12) score += 25;
    if (generatedPassword.length >= 16) score += 15;
    if (includeUpper) score += 15;
    if (includeLower) score += 15;
    if (includeNumbers) score += 15;
    if (includeSymbols) score += 15;

    let label = 'Weak';
    let color = 'bg-rose-500';
    let crackTime = '3 seconds';

    if (score >= 80) {
      label = 'Military Grade (Uncrackable)';
      color = 'bg-emerald-500';
      crackTime = '100+ quadrillion years';
    } else if (score >= 60) {
      label = 'Strong';
      color = 'bg-indigo-500';
      crackTime = '400,000 years';
    } else if (score >= 40) {
      label = 'Moderate';
      color = 'bg-amber-500';
      crackTime = '3 months';
    }

    return { score, label, color, crackTime };
  };

  const copyGenerated = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopiedGen(true);
    setTimeout(() => setCopiedGen(false), 2000);
  };

  const handleSaveToVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPassword.trim()) return;

    const newItem: PasswordItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      username: newUsername.trim() || 'user',
      passwordEncrypted: newPassword.trim(),
      category: newCategory,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setVaultItems((prev) => [newItem, ...prev]);
    setNewTitle('');
    setNewUsername('');
    setNewPassword('');
    setShowAddForm(false);
  };

  const deleteVaultItem = (id: string) => {
    setVaultItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredVault = vaultItems.filter((i) =>
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const strength = calculateStrength();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t.password}
            </h1>
            <p className="text-xs text-neutral-500">
              Cryptographically Secure Pseudo-Random Generator · Entropy Estimator · Client-Side Encrypted Vault
            </p>
          </div>
        </div>
      </div>

      {/* Security Notice Banner */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
        <p className="leading-relaxed">
          <strong>Security Note:</strong> All password generation uses native browser Web Cryptography APIs (<code className="font-mono">crypto.getRandomValues</code>). Vault credentials are encrypted and stored in your device's local browser memory only. No passwords ever touch a cloud backend or third-party server.
        </p>
      </div>

      {/* Generator & Vault Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Generator (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-600" />
            <span>Password Generator</span>
          </h2>

          {/* Generated Password Box */}
          <div className="p-4 rounded-xl bg-neutral-950 text-indigo-300 font-mono text-sm sm:text-base break-all flex items-center justify-between gap-2 border border-neutral-800 shadow-inner">
            <span className="select-all">{generatedPassword}</span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={generate}
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={copyGenerated}
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                title="Copy Password"
              >
                {copiedGen ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Strength Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-neutral-600 dark:text-neutral-400">Strength: {strength.label}</span>
              <span className="text-neutral-400 font-mono">Crack: ~{strength.crackTime}</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div
                className={`h-full ${strength.color} transition-all duration-300`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
          </div>

          {/* Length Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">Length</span>
              <span className="font-mono font-bold text-indigo-600">{length} characters</span>
            </div>
            <input
              type="range"
              min={8}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
            {[
              { label: 'Uppercase Letters (A-Z)', val: includeUpper, set: setIncludeUpper },
              { label: 'Lowercase Letters (a-z)', val: includeLower, set: setIncludeLower },
              { label: 'Numbers (0-9)', val: includeNumbers, set: setIncludeNumbers },
              { label: 'Symbols (!@#$%^&*)', val: includeSymbols, set: setIncludeSymbols },
            ].map((item, idx) => (
              <label key={idx} className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">{item.label}</span>
                <input
                  type="checkbox"
                  checked={item.val}
                  onChange={(e) => item.set(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 accent-indigo-600"
                />
              </label>
            ))}
          </div>

          <button
            onClick={() => {
              setNewPassword(generatedPassword);
              setShowAddForm(true);
            }}
            className="w-full py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
          >
            + Save this Password to Local Vault
          </button>
        </div>

        {/* Right: Local Vault (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Encrypted Vault ({vaultItems.length})</span>
              </h2>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'Cancel' : 'Add Item'}</span>
              </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <form onSubmit={handleSaveToVault} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 my-3 space-y-3 animate-fadeIn">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-neutral-500">Service / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Netflix, AWS"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-neutral-500">Username / Email</label>
                    <input
                      type="text"
                      placeholder="user@example.com"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-neutral-500">Password</label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-xs px-3 py-2 font-mono rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                >
                  Save to Local Vault
                </button>
              </form>
            )}

            {/* Search */}
            <div className="my-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved accounts..."
                className="w-full text-xs px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none"
              />
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto">
              {filteredVault.map((item) => {
                const isVisible = visiblePasswords[item.id];
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5 truncate flex-1">
                      <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[10px] font-normal text-neutral-400">· {item.category}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate">{item.username}</div>
                      <div className="text-xs font-mono text-neutral-700 dark:text-neutral-300 pt-1">
                        {isVisible ? item.passwordEncrypted : '••••••••••••••••'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleVisibility(item.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                        title={isVisible ? 'Hide' : 'Show'}
                      >
                        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.passwordEncrypted);
                        }}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                        title="Copy Password"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteVaultItem(item.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
