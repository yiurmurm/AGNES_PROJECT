import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Sparkles, 
  AlertTriangle, 
  BookOpen, 
  CheckCircle, 
  Activity, 
  Filter, 
  Clock, 
  Heart,
  Droplets,
  HelpCircle
} from 'lucide-react';
import { SkinCondition, UserProfile } from '../types';
import { CONDITIONS } from '../data';
import Ladybug from './Ladybug';

interface ClinicalDiagnosticsProps {
  userProfile?: UserProfile;
  onNavigateHome: () => void;
}

interface Article {
  source: { id: string; name: string };
  author?: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

// Subcomponent: SkinNewsFeed with live fetch from /api/get-skin-news
// and tiny Old-Age Home Donation Box with sweet images
function SkinNewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for the compassionate Tiny Donation Box
  const [donationAmount, setDonationAmount] = useState<number>(20);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donatedSuccessfully, setDonatedSuccessfully] = useState(false);
  const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const response = await fetch('/api/get-skin-news');
        if (!response.ok) {
          throw new Error('News server returned non-ok status');
        }
        const data = await response.json();
        if (data && data.articles) {
          setArticles(data.articles);
        } else {
          throw new Error('News query format not recognized');
        }
      } catch (err: any) {
        console.error('loadSkinNews error:', err);
        setError('Failed to load live breakthroughs. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDonation(true);
    setTimeout(() => {
      setIsSubmittingDonation(false);
      setDonatedSuccessfully(true);
    }, 1500);
  };

  const activeAmount = customAmount ? parseFloat(customAmount) || 0 : donationAmount;

  return (
    <div className="space-y-10">
      {/* Live news breakthrough cards container */}
      <div>
        <div className="flex items-center gap-3.5 mb-6">
          <span className="material-symbols-outlined text-[#D18A6A] animate-pulse">local_fire_department</span>
          <h2 className="text-xl font-serif font-semibold text-[#1C1C1C]">Skincare Breakthrough Feed</h2>
          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200/50 px-2.5 py-1 rounded-full uppercase tracking-wider font-extrabold ml-auto">
            ● Live Updates
          </span>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="skin-news-feed">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-[#1C1C1C]/10 animate-pulse space-y-4">
                <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                <div className="h-6 bg-gray-200 rounded w-4/5" />
                <div className="h-16 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-rose-50/70 border border-rose-200/60 p-8 rounded-3xl text-center max-w-lg mx-auto" id="skin-news-feed">
            <span className="material-symbols-outlined text-rose-500 text-3xl mb-2">signal_cellular_nodata</span>
            <p className="text-xs text-rose-900 font-mono font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="skin-news-feed">
            {articles.map((article, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                className="news-card bg-white p-6 border border-[#1C1C1C]/10 hover:border-[#2D423F]/30 hover:shadow-md rounded-3xl flex flex-col justify-between transition-all group"
              >
                <div className="space-y-3.5">
                  <div className="news-meta flex items-center justify-between text-[10px] font-mono text-[#1C1C1C]/60 border-b border-[#1C1C1C]/5 pb-2.5">
                    <span className="source font-extrabold uppercase bg-[#8B9474]/10 text-[#8B9474] px-2 py-0.5 rounded">
                      {article.source.name}
                    </span>
                    <span className="date font-semibold">
                      {new Date(article.publishedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-semibold leading-snug group-hover:text-[#2D423F] duration-150">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {article.title}
                    </a>
                  </h3>
                  <p className="text-xs text-[#1C1C1C]/70 leading-relaxed font-sans font-normal">
                    {article.description || 'Click to read full breakthrough details.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1C1C1C]/5 flex justify-between items-center text-[10px] font-mono text-[#2D423F] font-bold">
                  <span>Author: {article.author || 'Clinical Desk'}</span>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                  >
                    Read Journal <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Tiny Old-Age Home Donation Box with Images */}
      <div className="bg-[#FAF7F2] border border-[#D18A6A]/35 rounded-3xl p-6 relative overflow-hidden max-w-xl mx-auto shadow-sm">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#D18A6A]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          {/* Images of our sweet elders */}
          <div className="flex -space-x-3.5 flex-shrink-0">
            <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=150&h=150&q=80"
                alt="Elderly grandmother smiling"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-sm hover:scale-105 duration-200">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&h=150&q=80"
                alt="Elderly grandfather smiling"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="inline-flex items-center gap-1 bg-[#D18A6A]/10 text-[#D18A6A] px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase mb-1">
              <Heart size={8} className="fill-[#D18A6A]" /> Compassion Sanctuary
            </div>
            <h4 className="font-serif text-sm font-semibold text-[#1C1C1C]">Golden Years Elder Care</h4>
            <p className="text-[11px] text-[#1C1C1C]/70 leading-relaxed font-sans max-w-sm">
              Supporting skin health, nourishing hydration balm supplies, and warm physical care for grandparents in local silver age sanctuaries.
            </p>
          </div>
        </div>

        <div className="border-t border-[#D18A6A]/15 mt-5 pt-4">
          {donatedSuccessfully ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-200 text-center p-4 rounded-2xl space-y-1.5"
            >
              <div className="flex justify-center text-emerald-600">
                <span className="material-symbols-outlined text-2xl">thumb_up_alt</span>
              </div>
              <p className="text-xs font-mono font-bold text-emerald-950 uppercase tracking-wider">
                Beautiful Contribution!
              </p>
              <p className="text-[11px] text-emerald-900 leading-normal max-w-sm mx-auto">
                Thank you so much {donorName || "kind soul"}! Your contribution of <strong className="font-extrabold">₹{activeAmount}</strong> has been lovingly recorded to secure fresh medicinal moisturizing creams for the seniors.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDonatedSuccessfully(false);
                  setCustomAmount('');
                  setDonorName('');
                }}
                className="text-[9px] font-mono uppercase tracking-wider text-[#2D423F] underline font-bold mt-2 hover:opacity-80 block mx-auto cursor-pointer"
              >
                Donate Again
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleDonateSubmit} className="space-y-4">
              <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                {[5, 10, 20, 50].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setDonationAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`px-3 py-1.5 text-[10px] font-mono rounded-xl border transition-all cursor-pointer ${
                      donationAmount === amt && !customAmount
                        ? 'bg-[#D18A6A] text-white border-[#D18A6A] font-extrabold'
                        : 'bg-white text-[#1C1C1C]/80 border-[#1C1C1C]/10 hover:border-[#D18A6A]/30'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
                
                {/* Custom input */}
                <input
                  type="number"
                  placeholder="Custom ₹"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-24 bg-white border border-[#1C1C1C]/10 px-2.5 py-1.5 text-[10px] font-mono rounded-xl text-center outline-none focus:border-[#D18A6A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="bg-white border border-[#1C1C1C]/10 px-3 py-2 text-[10px] uppercase font-mono rounded-xl outline-none focus:border-[#D18A6A]"
                />
                
                <button
                  type="submit"
                  disabled={isSubmittingDonation || (customAmount !== '' && parseFloat(customAmount) <= 0)}
                  className="w-full bg-[#1C1C1C] text-[#FAF7F2] hover:bg-[#D18A6A] text-[9px] font-mono font-bold uppercase tracking-widest py-2.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmittingDonation ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <Heart size={10} className="fill-[#FAF7F2] animate-bounce" />
                      <span>Donate ₹{activeAmount} with love</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ClinicalDiagnostics({ userProfile, onNavigateHome }: ClinicalDiagnosticsProps) {
  const [activeTab, setActiveTab] = useState<'news' | 'atlas'>('news');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedConditionId, setExpandedConditionId] = useState<string | null>(null);

  // Extract unique categories from the conditions list to form interactive filter pills
  const categories = Array.from(new Set(CONDITIONS.map((c) => c.category))).filter(Boolean);

  // Filter conditions based on search and category selections
  const filteredConditions = CONDITIONS.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clinicalOverview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.compatibleIngredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.forbiddenIngredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory || c.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F9F6F2] relative overflow-hidden text-[#1C1C1C]">
      {/* Decorative nature illustration stickers for authentic apothecary feel */}
      <div className="absolute top-10 left-10 bg-white border-[3px] border-white rounded-2xl p-2 shadow-[0_5px_12px_rgba(28,28,28,0.08)] pointer-events-none select-none z-10 flex items-center justify-center transform rotate-12">
        <span className="material-symbols-outlined text-2xl text-[#8B9474]">biotech</span>
      </div>
      <div className="absolute top-36 right-10 bg-white border-[3px] border-white rounded-2xl p-2 shadow-[0_5px_12px_rgba(28,28,28,0.08)] pointer-events-none select-none z-10 flex items-center justify-center transform -rotate-12">
        <span className="material-symbols-outlined text-3xl text-[#D18A6A]">science</span>
      </div>
      <div className="absolute bottom-20 left-6 bg-white border-[3px] border-white rounded-2xl p-2 shadow-[0_5px_12px_rgba(28,28,28,0.08)] pointer-events-none select-none z-10 flex items-center justify-center transform rotate-6">
        <span className="material-symbols-outlined text-2xl text-[#8B9474]">menu_book</span>
      </div>

      {/* Cute ladybugs scattered on the background */}
      <Ladybug className="top-24 left-1/4 scale-100" initialRotation={35} />
      <Ladybug className="bottom-20 right-1/4 scale-110" initialRotation={210} />
      <Ladybug className="top-1/2 right-12 scale-90" initialRotation={145} />

      {/* Top Banner Navigation bar */}
      <header className="sticky top-0 z-30 bg-[#F9F6F2]/85 backdrop-blur-md border-b border-[#1C1C1C]/10 px-8 py-5 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          id="back-home-btn"
          className="group flex items-center gap-2 px-4 py-2 border border-[#1C1C1C]/15 bg-white text-[#1C1C1C] text-xs font-mono tracking-widest uppercase rounded-full hover:border-[#2D423F]/40 hover:bg-[#F9F6F2] transition-all duration-300"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Sanctuary</span>
        </button>

        <div className="flex items-center gap-2">
          <Activity size={18} className="text-[#8B9474]" />
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-75 font-semibold">
            Laboratory Diagnostics Workspace
          </span>
        </div>
      </header>

      {/* Full Width Hero Introductory Header Banner */}
      <section className="bg-white border-b border-[#1C1C1C]/10 py-12 px-8 shadow-sm">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D18A6A]/10 text-[#D18A6A] rounded-full border border-[#D18A6A]/15">
            <Sparkles size={12} />
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase">Dermatological Atlas</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-light text-[#1C1C1C] leading-tight">
            Clinical Insights & Diagnostics
          </h1>
          <p className="text-sm sm:text-base text-[#1C1C1C]/70 font-serif italic max-w-2xl leading-relaxed">
            Examine recent breakthroughs in dermatological studies, and reference structural skin disorders or apothecary profiles compiled by Agnes.
          </p>

          {userProfile && (
            <p className="text-[10px] text-[#8B9474] font-mono uppercase tracking-wider font-bold">
              • Customized analysis set active for patient profile <span className="underline">{userProfile.name}</span>
            </p>
          )}

          {/* Elegant tab triggers to toggle between Breakthrough news feed and Conditions Database */}
          <div className="flex gap-4 border-t border-[#1C1C1C]/10 pt-6 mt-4">
            <button
              onClick={() => setActiveTab('news')}
              className={`px-5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl border transition-all duration-300 cursor-pointer ${
                activeTab === 'news'
                  ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] font-extrabold shadow-sm'
                  : 'bg-white text-[#1C1C1C]/60 border-[#1C1C1C]/10 hover:border-[#1C1C1C]/30'
              }`}
            >
              📰 Skin breakthroughs News
            </button>
            <button
              onClick={() => setActiveTab('atlas')}
              className={`px-5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl border transition-all duration-300 cursor-pointer ${
                activeTab === 'atlas'
                  ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] font-extrabold shadow-sm'
                  : 'bg-white text-[#1C1C1C]/60 border-[#1C1C1C]/10 hover:border-[#1C1C1C]/30'
              }`}
            >
              🧬 Pathology conditions Atlas
            </button>
          </div>
        </div>
      </section>

      {/* Main diagnostics panel content */}
      <main className="max-w-7xl mx-auto px-8 py-10 space-y-8">
        
        {activeTab === 'news' ? (
          <SkinNewsFeed />
        ) : (
          <>
            {/* Dynamic Filters and Search controls */}
            <section className="bg-white p-6 border border-[#1C1C1C]/10 rounded-3xl shadow-sm space-y-6">
              <div className="flex flex-col lg:flex-row gap-5 items-stretch lg:items-center justify-between">
                
                {/* Search Input Box */}
                <div className="relative group flex-grow max-w-xl">
                  <input
                    type="text"
                    id="clinical-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F9F6F2] border border-[#1C1C1C]/15 py-3.5 pl-11 pr-12 outline-none text-xs text-[#1C1C1C] rounded-2xl focus:border-[#2D423F] font-sans"
                    placeholder="🔍 Search symptoms, ingredients, categories, or disorders..."
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono uppercase tracking-widest text-[#1C1C1C]/40 hover:text-[#1C1C1C]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Total count badge */}
                <div className="flex items-center gap-2 bg-[#F9F6F2] border border-[#1C1C1C]/5 py-2.5 px-4 rounded-xl text-xs font-mono">
                  <span className="font-bold text-[#2D423F]">{filteredConditions.length}</span>
                  <span className="opacity-50 uppercase tracking-wider text-[10px]">Conditions cataloged</span>
                </div>
              </div>

              {/* Interactive filter pills based on clinical categories */}
              <div className="space-y-2 border-t border-[#1C1C1C]/5 pt-4">
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase opacity-45 flex items-center gap-1">
                  <Filter size={10} />
                  Filter by Biological Classification Category
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 text-[9px] font-mono tracking-wider rounded-xl border transition-all duration-300 cursor-pointer ${
                      selectedCategory === null
                        ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] font-extrabold'
                        : 'bg-[#F9F6F2] text-[#1C1C1C]/60 border-[#1C1C1C]/10 hover:border-[#1C1C1C]/30'
                    }`}
                  >
                    All Classifications
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`px-3 py-1.5 text-[9px] font-mono tracking-wider rounded-xl border transition-all duration-300 cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#2D423F] text-white border-[#2D423F] font-extrabold'
                          : 'bg-[#F9F6F2] text-[#1C1C1C]/60 border-[#1C1C1C]/10 hover:border-[#1C1C1C]/30'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Dynamic Interactive Cards Grid containing conditions */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredConditions.map((c) => {
                  const isExpanded = expandedConditionId === c.id;

                  return (
                    <motion.div
                      layout
                      key={c.id}
                      id={`condition-card-${c.id}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`group bg-white border transition-all duration-300 rounded-3xl flex flex-col justify-between overflow-hidden relative ${
                        isExpanded 
                          ? 'border-[#2D423F] ring-2 ring-[#2D423F]/10 shadow-lg p-8' 
                          : 'border-[#1C1C1C]/10 hover:shadow-md hover:border-[#1C1C1C]/25 p-7'
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Header: Class Badge and Icon */}
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[9px] uppercase font-mono tracking-widest text-[#D18A6A] font-extrabold bg-[#D18A6A]/10 px-2.5 py-1 rounded-md mb-2">
                            {c.category}
                          </span>
                          <button
                            onClick={() => setExpandedConditionId(isExpanded ? null : c.id)}
                            className="text-[#8B9474] flex items-center justify-center bg-[#8B9474]/5 hover:bg-[#8B9474]/15 duration-200 h-8 w-8 rounded-full cursor-pointer"
                            title={isExpanded ? "Collapse notes" : "Expand clinical details"}
                          >
                            <span className="material-symbols-outlined text-base">
                              {isExpanded ? 'expand_less' : 'expand_more'}
                            </span>
                          </button>
                        </div>

                        {/* Condition Title & Symptoms */}
                        <div>
                          <h3 className="font-serif text-xl text-[#1C1C1C] font-semibold leading-snug group-hover:text-[#2D423F] duration-200">
                            {c.name}
                          </h3>
                          <p className="text-xs text-[#1C1C1C]/75 italic mt-1.5 font-serif border-l-2 border-[#D18A6A]/20 pl-2.5">
                            <strong className="text-[9px] font-mono uppercase tracking-wider block opacity-50 not-italic">Manifestations & Signs</strong>
                            {c.symptoms}
                          </p>
                        </div>

                        {/* Expanded Clinical Sections */}
                        <div className="space-y-4 pt-2">
                          <div>
                            <span className="text-[9px] font-mono font-bold tracking-widest uppercase opacity-45 block mb-1">Clinical Overview</span>
                            <p className="text-xs text-[#1C1C1C]/80 leading-relaxed font-sans">{c.clinicalOverview}</p>
                          </div>

                          {/* Display compatible vs forbidden active ingredients */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1.5 matches-analysis">
                            <div>
                              <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-emerald-700 block mb-1.5 flex items-center gap-1">
                                <CheckCircle size={10} className="text-emerald-600" />
                                Compatible
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {c.compatibleIngredients.map((ing) => (
                                  <span key={ing} className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 text-[8.5px] font-mono rounded font-medium shadow-[0_1px_2px_rgba(16,185,129,0.04)]">
                                    {ing}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-rose-700 block mb-1.5 flex items-center gap-1">
                                <AlertTriangle size={10} className="text-rose-600 animate-pulse" />
                                Forbidden
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {c.forbiddenIngredients.map((ing) => (
                                  <span key={ing} className="bg-rose-50 text-rose-800 border border-rose-100 px-2 py-0.5 text-[8.5px] font-mono rounded font-semibold shadow-[0_1px_2px_rgba(244,63,94,0.04)]">
                                    {ing}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Apothecary ritual note section */}
                      <div className="mt-6 pt-4 border-t border-[#1C1C1C]/5 text-xs">
                        <div className="bg-[#FAF3EA] border-l-4 border-[#D18A6A] p-4 rounded-r-2xl text-[11px] font-serif italic text-[#5F4B32] leading-relaxed relative">
                          <span className="absolute top-2 right-3 text-[#D18A6A]/20">
                            <BookOpen size={16} />
                          </span>
                          <span className="font-mono font-bold text-[9px] tracking-widest uppercase text-[#D18A6A] not-italic block mb-1 font-extrabold flex items-center gap-1">
                            <Clock size={10} />
                            Apothecary Scholar Ritual Note
                          </span>
                          {c.apothecaryRitualNote}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Empty search results state */}
              {filteredConditions.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white p-8 border border-[#1C1C1C]/10 rounded-3xl max-w-lg mx-auto shadow-sm">
                  <HelpCircle className="mx-auto text-4xl text-[#1C1C1C]/30 mb-3" size={40} />
                  <p className="font-serif text-lg text-[#1C1C1C] font-semibold">No Skincare Diagnostics Match</p>
                  <p className="text-xs text-[#1C1C1C]/60 mt-1 lines-relaxed">
                    Could not find matching categories, compatible ingredients, or diagnostic clinical symptoms for "{searchQuery}". Try searching simple terms like "Melasma", "PIH", "zinc" or "oatmeal".
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                    }}
                    className="mt-5 px-6 py-2.5 bg-[#1C1C1C] text-white text-[10px] font-mono tracking-widest uppercase hover:bg-[#2D423F] duration-300 rounded-xl cursor-pointer"
                  >
                    Reset Search Filters
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {/* Supportive Information Segment on how to read labels */}
        <section className="bg-[#2D423F] text-[#F9F6F2] p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="text-[9px] uppercase tracking-[0.3em] font-mono opacity-60">clinical laboratory protocol</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-white leading-tight">Patient Safety & Apothecary Sourcing Guidance</h2>
            <p className="text-xs sm:text-sm font-serif italic text-[#F9F6F2]/80 leading-relaxed">
              If an active condition is highly reactive (such as Contact Dermatitis, Perioral Dermatitis, or Melanoma concerns), strip cosmetic formulas immediately. Consult a certified medical dermatologist before self-treating with heavy acids. These apothecary profiles are compiled solely for ingredient mapping and safe education.
            </p>
          </div>
          <div className="flex-shrink-0 relative z-10 w-full md:w-auto">
            <button
              onClick={onNavigateHome}
              className="w-full md:w-auto px-6 py-3 bg-white text-[#1C1C1C] text-[10px] font-mono tracking-widest uppercase hover:bg-[#E5DACE] transition-all rounded-full font-bold cursor-pointer"
            >
              Back to Sanctuary
            </button>
          </div>
          {/* Subtle geometric circle decoration to align with standard project style */}
          <div className="absolute right-[-40px] bottom-[-40px] w-48 h-48 rounded-full bg-white/[0.04] pointer-events-none" />
        </section>

      </main>
    </div>
  );
}
