import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Instagram,
  Send,
  Youtube,
  Copy,
  Check,
  Download,
  Share2,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { aiService } from '../../services/aiService';

export const PosterGeneratorView: React.FC = () => {
  const { t } = useLanguage();
  const [title, setTitle] = useState('Global AI & Tech Innovators Summit 2026');
  const [event, setEvent] = useState('Conference & Hackathon');
  const [description, setDescription] = useState('Join 500+ top developers, founders, and researchers exploring next-gen artificial intelligence, open-source agents, and autonomous systems.');
  const [date, setDate] = useState('October 24, 2026');
  const [time, setTime] = useState('10:00 AM - 6:00 PM');
  const [location, setLocation] = useState('Silicon Valley Innovation Center / Hybrid Online');
  const [style, setStyle] = useState('Technology');

  const [posterData, setPosterData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const styles = ['Education', 'Business', 'Technology', 'Gaming', 'Sports', 'School', 'Minimal', 'Modern'];

  const handleGenerate = async () => {
    if (!title.trim() || loading) return;
    setLoading(true);

    try {
      const data = await aiService.generatePoster({
        title,
        event,
        description,
        date,
        time,
        location,
        style,
      });
      setPosterData(data);
    } catch {
      // Fallback
      setPosterData({
        headline: title,
        subheadline: description,
        bulletPoints: ['Expert Keynote Speakers', 'Hands-on Workshops', 'Global Networking'],
        callToAction: 'Register Today · Limited Seats Available',
        colorPalette: ['#1e1b4b', '#4338ca', '#06b6d4', '#f59e0b'],
        instagramPost: `🚀 ${title} is happening on ${date}! Reserve your spot now. #AI #Tech #Innovation #Summit`,
        instagramStory: `Slide 1: Big Announcement 🚀\nSlide 2: ${title}\nSlide 3: Link in Bio to Register`,
        telegramPost: `📢 **${title}**\n\n🗓 ${date} | ⏰ ${time}\n📍 ${location}\n\n${description}`,
        youtubeThumbnailConcept: `High contrast split background with bold text: "${title}" and speaker spotlight badge.`,
        designTips: ['Use strong visual hierarchy', 'Leave breathing room around the date & location'],
      });
    } finally {
      setLoading(false);
    }
  };

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t.poster}
            </h1>
            <p className="text-xs text-neutral-500">
              Generate complete marketing campaigns, visual poster designs, and social format packs (Instagram, Telegram, YouTube).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Event & Campaign Parameters
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Campaign / Event Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-purple-500 mt-1 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Event Type</label>
                <input
                  type="text"
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-purple-500 mt-1 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Design Aesthetic</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-purple-500 mt-1 text-neutral-900 dark:text-neutral-100 font-medium"
                >
                  {styles.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-purple-500 mt-1 text-neutral-900 dark:text-neutral-100 resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Date</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-purple-500 mt-1 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Time</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-purple-500 mt-1 text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-purple-500 mt-1 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !title.trim()}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Synthesizing Poster & Social Campaign...' : 'Generate Poster & Content'}</span>
            </button>
          </div>
        </div>

        {/* Right Output: Poster Visual & Multi-Platform Copy (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Visual Poster Preview Render */}
          <div className="rounded-2xl p-8 bg-gradient-to-br from-neutral-900 via-purple-950 to-neutral-950 text-white shadow-2xl relative overflow-hidden border border-neutral-800 flex flex-col justify-between min-h-[380px]">
            {/* Top Badge */}
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[11px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                {event || 'Featured Event'} · {style}
              </span>
              <span className="text-xs text-neutral-400 font-mono">2026 EDITION</span>
            </div>

            {/* Poster Main Content */}
            <div className="my-6 space-y-3 relative z-10">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                {posterData?.headline || title}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-lg leading-relaxed">
                {posterData?.subheadline || description}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2 pt-2">
                {(posterData?.bulletPoints || ['Hands-on Innovation', 'Global Network', 'Certification']).map((b: string, idx: number) => (
                  <span key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/10 text-white/90 backdrop-blur-md">
                    ✓ {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-300 relative z-10">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-purple-400" /> {date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-purple-400" /> {time}</span>
              </div>
              <span className="flex items-center gap-1.5 text-purple-300 font-medium"><MapPin className="w-3.5 h-3.5" /> {location}</span>
            </div>

            {/* Background art glow */}
            <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          </div>

          {/* Social Platforms Tabs (Instagram, Telegram, YouTube) */}
          {posterData && (
            <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Multi-Platform Distribution Packages
              </h3>

              <div className="space-y-3">
                {/* Instagram Post */}
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5" /> Instagram Post & Caption
                    </span>
                    <button
                      onClick={() => copyText('insta', posterData.instagramPost)}
                      className="text-neutral-500 hover:text-neutral-900 text-xs flex items-center gap-1"
                    >
                      {copiedKey === 'insta' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'insta' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                    {posterData.instagramPost}
                  </p>
                </div>

                {/* Telegram Post */}
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-500 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5" /> Telegram Broadcast Post
                    </span>
                    <button
                      onClick={() => copyText('tele', posterData.telegramPost)}
                      className="text-neutral-500 hover:text-neutral-900 text-xs flex items-center gap-1"
                    >
                      {copiedKey === 'tele' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'tele' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                    {posterData.telegramPost}
                  </p>
                </div>

                {/* YouTube Thumbnail */}
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-500 flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5" /> YouTube Thumbnail Concept & Visuals
                    </span>
                    <button
                      onClick={() => copyText('yt', posterData.youtubeThumbnailConcept)}
                      className="text-neutral-500 hover:text-neutral-900 text-xs flex items-center gap-1"
                    >
                      {copiedKey === 'yt' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'yt' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                    {posterData.youtubeThumbnailConcept}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
