import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, UserProfile } from '../types';
import { PRODUCTS } from '../data';
import Ladybug from './Ladybug';

// Definition of an adjustable skincare step scheduled across the week
interface WeeklyStep {
  id: string;
  title: string;
  amPm: 'AM' | 'PM';
  days: string[]; // e.g. ['Monday', 'Wednesday', 'Friday']
  productId: string; // ID of product from PRODUCTS or 'custom'
  customProductName?: string; // If 'custom' is selected
  completedDays: Record<string, boolean>; // e.g. { 'Monday': true, 'Wednesday': false }
}

interface DailyRitualAlignmentProps {
  userProfile: UserProfile;
  onNavigateHome: () => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DEFAULT_WEEKLY_STEPS: WeeklyStep[] = [
  {
    id: 'step-1',
    title: 'Marine Hydro Awakening Dawn',
    amPm: 'AM',
    days: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
    productId: 'prod_minimalist_b5',
    completedDays: { 'Monday': true },
  },
  {
    id: 'step-2',
    title: 'Saffron Golden Radiance Polish',
    amPm: 'AM',
    days: ['Tuesday', 'Thursday', 'Saturday'],
    productId: 'prod_dermaco_aqua',
    completedDays: {},
  },
  {
    id: 'step-3',
    title: 'Botanical Neem Purifying Clay',
    amPm: 'PM',
    days: ['Wednesday', 'Saturday'],
    productId: 'prod_sebamed_clear',
    completedDays: {},
  }
];

export default function DailyRitualAlignment({ userProfile, onNavigateHome }: DailyRitualAlignmentProps) {
  const [weeklySteps, setWeeklySteps] = useState<WeeklyStep[]>(DEFAULT_WEEKLY_STEPS);
  
  // Custom Step Editor form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  
  // Form fields
  const [stepTitle, setStepTitle] = useState('');
  const [stepAmPm, setStepAmPm] = useState<'AM' | 'PM'>('AM');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Wednesday', 'Friday']);
  const [stepProductId, setStepProductId] = useState<string>('prod_minimalist_b5');
  const [stepCustomName, setStepCustomName] = useState('');

  // Weekly Focus Filters - all or a specific day
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('All Days');
  
  // Toast notifications for tactile skincare confirmation
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States to gather full user data and diagnostic ingredient scans for downloadable PDF summary
  const [scannedHistory, setScannedHistory] = useState<any[]>([]);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Sync / refresh history whenever modal opened
  const refreshHistoryAndQuiz = () => {
    try {
      const historyJson = localStorage.getItem('project_agnes_scanned_history');
      if (historyJson) {
        setScannedHistory(JSON.parse(historyJson));
      } else {
        setScannedHistory([]);
      }
      const quizJson = localStorage.getItem('project_agnes_quiz');
      if (quizJson) {
        setQuizResult(JSON.parse(quizJson));
      } else {
        setQuizResult(null);
      }
    } catch (e) {
      console.error('Failed to parse cached scanned ingredients or quiz state', e);
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('project_agnes_weekly_ritual');
    if (saved) {
      try {
        setWeeklySteps(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cached weekly rituals', e);
      }
    }

    // Run direct initial load
    refreshHistoryAndQuiz();
  }, []);

  // Save to localStorage whenever list changes
  const saveSteps = (newSteps: WeeklyStep[]) => {
    setWeeklySteps(newSteps);
    localStorage.setItem('project_agnes_weekly_ritual', JSON.stringify(newSteps));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Helper to open form to add fresh step
  const openAddStep = () => {
    setEditingStepId(null);
    setStepTitle('');
    setStepAmPm('AM');
    setSelectedDays(['Monday', 'Wednesday', 'Friday']);
    setStepProductId('prod_minimalist_b5');
    setStepCustomName('');
    setShowAddModal(true);
  };

  // Helper to open form to edit existing step
  const openEditStep = (step: WeeklyStep) => {
    setEditingStepId(step.id);
    setStepTitle(step.title);
    setStepAmPm(step.amPm);
    setSelectedDays(step.days);
    setStepProductId(step.productId);
    setStepCustomName(step.customProductName || '');
    setShowAddModal(true);
  };

  // Handle saving step (either create new or edit existing)
  const handleSaveStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepTitle.trim()) {
      alert('Please enter a name for this ritual step.');
      return;
    }

    if (selectedDays.length === 0) {
      alert('Please select at least one day of the week for this ritual.');
      return;
    }

    if (editingStepId) {
      // Edit mode
      const updated = weeklySteps.map(step => {
        if (step.id === editingStepId) {
          // Preserve completion for days that are still selected, reset/discard for unselected days
          const nextCompleted: Record<string, boolean> = {};
          selectedDays.forEach(day => {
            if (step.completedDays[day]) {
              nextCompleted[day] = true;
            }
          });

          return {
            ...step,
            title: stepTitle,
            amPm: stepAmPm,
            days: selectedDays,
            productId: stepProductId,
            customProductName: stepProductId === 'custom' ? stepCustomName : '',
            completedDays: nextCompleted
          };
        }
        return step;
      });
      saveSteps(updated);
      showToast('Step updated elegantly');
    } else {
      // Create mode
      const newStep: WeeklyStep = {
        id: `step-${Date.now()}`,
        title: stepTitle,
        amPm: stepAmPm,
        days: selectedDays,
        productId: stepProductId,
        customProductName: stepProductId === 'custom' ? stepCustomName : '',
        completedDays: {}
      };
      saveSteps([...weeklySteps, newStep]);
      showToast('New weekly ritual step aligned');
    }

    setShowAddModal(false);
  };

  // Delete a step completely
  const handleDeleteStep = (id: string) => {
    if (confirm('Cleanse this step from your weekly alignment menu permanently?')) {
      const remaining = weeklySteps.filter(s => s.id !== id);
      saveSteps(remaining);
      showToast('Step cleansed from alignment');
    }
  };

  // Toggle checkout checkbox for a step on a specific day of the week
  const handleToggleDayCompletion = (stepId: string, day: string) => {
    const updated = weeklySteps.map(step => {
      if (step.id === stepId) {
        const nextCompleted = { ...step.completedDays };
        const currentlyChecked = !!nextCompleted[day];
        if (currentlyChecked) {
          delete nextCompleted[day];
          showToast(`Unchecked ${step.title} for ${day}`);
        } else {
          nextCompleted[day] = true;
          showToast(`Checked out ${step.title} for ${day}! ✨`);
        }

        return {
          ...step,
          completedDays: nextCompleted
        };
      }
      return step;
    });
    saveSteps(updated);
  };

  // Calculate complete metrics to gauge user's weekly alignment
  const calculateMetrics = () => {
    let totalOccurrences = 0;
    let completedOccurrences = 0;

    weeklySteps.forEach(step => {
      step.days.forEach(day => {
        totalOccurrences++;
        if (step.completedDays[day]) {
          completedOccurrences++;
        }
      });
    });

    const percent = totalOccurrences > 0 ? Math.round((completedOccurrences / totalOccurrences) * 100) : 0;
    return { totalOccurrences, completedOccurrences, percent };
  };

  const metrics = calculateMetrics();

  // Trigger quick load of classic Ayurvedic holistic presets
  const handleLoadTemplate = (type: 'traditional' | 'brightening' | 'minimalist') => {
    let steps: WeeklyStep[] = [];
    if (type === 'traditional') {
      steps = [
        {
          id: 'trad-1',
          title: 'Copper Water Splash & Oil Pulling',
          amPm: 'AM',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          productId: 'custom',
          customProductName: 'Lukewarm Pure Copper Bowl Infusion',
          completedDays: { 'Monday': true, 'Tuesday': true }
        },
        {
          id: 'trad-2',
          title: 'Saffron & Sweet Almond Cold-pressed Sandalwood Mask',
          amPm: 'AM',
          days: ['Tuesday', 'Thursday', 'Saturday'],
          productId: 'saffron-sunshine',
          completedDays: {}
        },
        {
          id: 'trad-3',
          title: 'Nightly Herb Apothecary Grinding Compress',
          amPm: 'PM',
          days: ['Wednesday', 'Sunday'],
          productId: 'neem-clarifying',
          completedDays: {}
        }
      ];
    } else if (type === 'brightening') {
      steps = [
        {
          id: 'bright-1',
          title: 'Vitamin C Citrus Awakening Hydration',
          amPm: 'AM',
          days: ['Monday', 'Wednesday', 'Friday'],
          productId: 'prod_minimalist_b5',
          completedDays: {}
        },
        {
          id: 'bright-2',
          title: 'Saffron Polish Sunshine',
          amPm: 'AM',
          days: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
          productId: 'prod_dermaco_aqua',
          completedDays: {}
        }
      ];
    } else {
      steps = [
        {
          id: 'min-1',
          title: 'Sandalwood Purifying Cool Splash',
          amPm: 'AM',
          days: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
          productId: 'prod_sebamed_clear',
          completedDays: {}
        },
        {
          id: 'min-2',
          title: 'Marine Dew Deep Moisture Cover',
          amPm: 'PM',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          productId: 'prod_minimalist_b5',
          completedDays: {}
        }
      ];
    }

    if (confirm('Load this template? This will replace your current weekly items.')) {
      saveSteps(steps);
      showToast('Apothecary template loaded');
    }
  };

  // Helper to find a product image or default
  const getProductImage = (productId: string) => {
    const prod = PRODUCTS.find(p => p.id === productId);
    if (prod) return prod.imgUrl;
    return 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=80&q=80';
  };

  const getProductName = (step: WeeklyStep) => {
    if (step.productId === 'custom') {
      return step.customProductName || 'Custom Elixir';
    }
    const p = PRODUCTS.find(prod => prod.id === step.productId);
    return p ? p.name : 'Unknown Product';
  };

  return (
    <div className="relative min-h-screen bg-[#F9F6F2] font-sans pb-32 overflow-x-hidden text-[#1C1C1C] print:bg-white print:text-black print:pb-0">
      {/* Ladybugs explicitly behind via natural low z-indices */}
      <Ladybug className="top-1/4 left-10 scale-90 opacity-80 print:hidden" initialRotation={30} />
      <Ladybug className="bottom-1/3 right-16 scale-100 opacity-90 print:hidden" initialRotation={150} />
      <Ladybug className="top-2/3 left-1/3 scale-75 opacity-70 print:hidden" initialRotation={280} />

      {/* Floating Botanical stickers behind page content cards */}
      <div className="absolute top-[180px] left-[5%] text-[#8B9474]/15 pointer-events-none select-none z-0 transform -rotate-12 print:hidden">
        <span className="material-symbols-outlined text-[120px]">spa</span>
      </div>
      <div className="absolute bottom-[20%] right-[4%] text-[#D18A6A]/10 pointer-events-none select-none z-0 transform rotate-45 print:hidden">
        <span className="material-symbols-outlined text-[160px]">eco</span>
      </div>

      {/* Header Bar */}
      <header className="flex items-center justify-between px-8 md:px-12 pt-8 pb-6 w-full fixed top-0 z-40 bg-[#F9F6F2]/90 backdrop-blur-md border-b border-[#1C1C1C]/10 print:hidden">
        <div className="flex items-center gap-6">
          <button
            onClick={onNavigateHome}
            className="p-2 hover:bg-[#1C1C1C]/5 transition-colors rounded-full flex items-center justify-center text-[#1C1C1C]"
            title="Back to Sanctuary"
            id="back-home-btn"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif italic font-light text-[#1C1C1C]">Agnes.</h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#8B9474] font-bold">Ritual Alignment</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => {
              refreshHistoryAndQuiz();
              setShowPrintModal(true);
            }}
            className="px-4 py-2.5 bg-white hover:bg-[#8B9474]/10 text-[#1C1C1C] text-[10px] uppercase tracking-[0.2em] font-semibold transition-all border border-[#1C1C1C]/10 rounded-xl flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm leading-none">download</span>
            <span>Report PDF</span>
          </button>

          <button
            onClick={openAddStep}
            className="px-5 py-2.5 bg-[#1C1C1C] hover:bg-[#8B9474] text-white text-[10px] uppercase tracking-[0.2em] font-semibold transition-all shadow-sm rounded-xl flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm leading-none">add</span>
            <span>Add Step</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto pt-32 px-6 md:px-12 relative z-10 space-y-12 print:hidden">
        
        {/* Intro Banner */}
        <section className="bg-white/80 border border-[#1C1C1C]/10 rounded-3xl p-8 md:p-10 shadow-[0_12px_40px_rgba(28,28,28,0.03)] grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#8B9474]">Traditional slow-form beauty cycles</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1C1C1C] leading-tight">
              Customize Your <span className="italic">Weekly Skincare Alignment</span>
            </h2>
            <p className="text-sm text-[#1C1C1C]/75 max-w-xl leading-relaxed font-serif italic">
              Unlike static daily routines, true ancient skin health fluctuates across the Lunar and weekly seasons. Schedule organic compress balms and dew serums to specific weekdays, and check out tasks to see your soul progression.
            </p>

            {/* Quick Templates picker for user ease */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] font-mono opacity-60">Holistic Presets:</span>
              <button
                onClick={() => handleLoadTemplate('traditional')}
                className="px-3 py-1.5 rounded-lg border border-[#1C1C1C]/15 text-[10px] uppercase tracking-wider font-semibold hover:bg-[#8B9474]/10 transition-colors"
              >
                🌾 Classic Ancient Ayurvedic
              </button>
              <button
                onClick={() => handleLoadTemplate('brightening')}
                className="px-3 py-1.5 rounded-lg border border-[#1C1C1C]/15 text-[10px] uppercase tracking-wider font-semibold hover:bg-[#8B9474]/10 transition-colors"
              >
                ☀️ Saffron Glow Power
              </button>
              <button
                onClick={() => handleLoadTemplate('minimalist')}
                className="px-3 py-1.5 rounded-lg border border-[#1C1C1C]/15 text-[10px] uppercase tracking-wider font-semibold hover:bg-[#8B9474]/10 transition-colors"
              >
                🍃 Simple Sandalwood
              </button>
            </div>
          </div>

          {/* Progress Circular Widget (Visual Checkout) */}
          <div className="bg-[#FAF8F5] border border-[#1C1C1C]/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#1C1C1C]/60">Weekly Soul Alignment</h3>
            
            {/* Real SVG Alignment gauge */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#E8E2D7"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#8B9474"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  animate={{ strokeDashoffset: 251.2 - (251.2 * metrics.percent) / 100 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-serif font-black">{metrics.percent}%</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B9474]">Aligned</span>
              </div>
            </div>

            <p className="text-[11px] font-mono text-[#1C1C1C]/70">
              {metrics.completedOccurrences} of {metrics.totalOccurrences} active checkouts
            </p>
          </div>
        </section>

        {/* Dynamic Filters Bar */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#1C1C1C]/10 pb-4">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setSelectedDayFilter('All Days')}
              className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                selectedDayFilter === 'All Days'
                  ? 'bg-[#1C1C1C] text-white shadow-md'
                  : 'bg-white/60 text-[#1C1C1C]/60 border border-[#1C1C1C]/10 hover:bg-white'
              }`}
            >
              All Week
            </button>
            {DAYS_OF_WEEK.map(day => {
              // Count scheduled occurrences on this day
              const count = weeklySteps.filter(s => s.days.includes(day)).length;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDayFilter(day)}
                  className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-1.5 ${
                    selectedDayFilter === day
                      ? 'bg-[#8B9474] text-white shadow-sm'
                      : 'bg-white/60 text-[#1C1C1C]/60 border border-[#1C1C1C]/10 hover:bg-white'
                  }`}
                >
                  <span>{day.substring(0, 3)}</span>
                  {count > 0 && (
                    <span className="w-4 h-4 rounded-full bg-white/20 text-[9px] flex items-center justify-center font-bold">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-[#1C1C1C]/60 italic font-mono flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm leading-none">info</span>
            <span>Tap tick circles below to checkout steps!</span>
          </div>
        </section>

        {/* Weekly Matrix Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Major Scheduled Steps with customizable controls */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif italic text-[#1C1C1C] flex items-center gap-2">
                <span>Your Configured Ritual Core Steps</span>
                <span className="text-xs px-2.5 py-0.5 font-mono not-italic font-bold tracking-wider bg-[#8B9474]/15 text-[#8B9474] rounded-full">
                  {weeklySteps.length} Steps
                </span>
              </h3>
            </div>

            {weeklySteps.length === 0 ? (
              <div className="bg-white border border-dashed border-[#1C1C1C]/25 rounded-3xl p-16 text-center space-y-4">
                <span className="material-symbols-outlined text-4xl text-[#8B9474]/40">spa</span>
                <p className="text-base font-serif italic text-[#1C1C1C]/70">No ritual scheduled yet.</p>
                <button
                  onClick={openAddStep}
                  className="px-6 py-2.5 bg-[#1C1C1C] text-white text-[10px] uppercase tracking-wider font-semibold rounded-xl"
                >
                  Create Your First Ritual Step
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {weeklySteps
                  .filter(step => selectedDayFilter === 'All Days' || step.days.includes(selectedDayFilter))
                  .map(step => (
                    <div
                      key={step.id}
                      className="bg-white border border-[#1C1C1C]/10 rounded-2xl p-5 hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      {/* Sub-badge indicating schedule time */}
                      <span className={`absolute top-0 right-0 px-4 py-1 text-[9px] uppercase tracking-widest font-bold ${
                        step.amPm === 'AM' ? 'bg-[#FAF6EC] text-[#D18A6A]' : 'bg-[#1C1C1C] text-white'
                      } rounded-bl-xl`}>
                        ✨ {step.amPm} Routine
                      </span>

                      <div className="flex items-start gap-4">
                        {/* Image associated with step or custom */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#1C1C1C]/10 flex-shrink-0 bg-[#F2EDE4]">
                          <img
                            src={getProductImage(step.productId)}
                            alt="Skincare item"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Title and product tags */}
                        <div className="flex-grow space-y-2 max-w-md">
                          <h4 className="font-serif text-lg font-light text-[#1C1C1C] pr-16">{step.title}</h4>
                          
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B9474] bg-[#8B9474]/10 px-2 py-0.5 rounded-md">
                              Product: {getProductName(step)}
                            </span>
                            
                            <span className="text-[10px] font-mono text-[#1C1C1C]/50">
                              🕒 {step.days.length} days/week
                            </span>
                          </div>

                          {/* Days visual pill map */}
                          <div className="flex flex-wrap gap-1 pt-1">
                            {DAYS_OF_WEEK.map(d => {
                              const isScheduledOnDay = step.days.includes(d);
                              const isCompletedOnDay = step.completedDays[d];
                              
                              if (!isScheduledOnDay) return null;

                              return (
                                <button
                                  key={d}
                                  onClick={() => handleToggleDayCompletion(step.id, d)}
                                  className={`px-2 py-1 rounded-md text-[9px] uppercase tracking-wider font-bold transition-all flex items-center gap-1 border ${
                                    isCompletedOnDay
                                      ? 'bg-[#8B9474]/15 border-[#8B9474] text-[#8B9474]'
                                      : 'bg-transparent border-[#1C1C1C]/10 text-[#1C1C1C]/60 hover:border-[#1C1C1C]/40'
                                  }`}
                                  title={`Toggle checkout for ${d}`}
                                >
                                  <span>{d.substring(0, 3)}</span>
                                  <span className="material-symbols-outlined text-[11px] leading-none">
                                    {isCompletedOnDay ? 'check_circle' : 'circle'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Actions block on right */}
                        <div className="flex flex-col items-end gap-2 ml-auto">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditStep(step)}
                              className="p-1.5 hover:text-[#8B9474] transition-colors rounded-lg hover:bg-gray-50 text-[#1C1C1C]/60"
                              title="Edit Step settings"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteStep(step.id)}
                              className="p-1.5 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-50 text-[#1C1C1C]/60"
                              title="Delete Step"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>

          {/* RIGHT PANEL: Week-at-a-glance Interactive Checkouts */}
          <section className="lg:col-span-4 bg-white border border-[#1C1C1C]/15 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#8B9474] font-bold">Weekly Check-Out Monitor</span>
              <h3 className="text-xl font-serif font-light">Calendar Flow</h3>
            </div>

            <p className="text-xs text-[#1C1C1C]/60 leading-relaxed font-serif italic">
              Check off your steps as you flow through the week. Keep a clean, hydrated skin barrier with full aesthetic control.
            </p>

            <div className="space-y-4">
              {DAYS_OF_WEEK.map(day => {
                const daySteps = weeklySteps.filter(s => s.days.includes(day));
                const completedCount = daySteps.filter(s => s.completedDays[day]).length;
                const isSelected = selectedDayFilter === day;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDayFilter(day)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF8F5] border-[#8B9474] shadow-sm'
                        : 'bg-white border-[#1C1C1C]/10 hover:border-[#1C1C1C]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs uppercase tracking-widest font-bold text-[#1C1C1C]">
                        {day}
                      </span>
                      {daySteps.length > 0 ? (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          completedCount === daySteps.length
                            ? 'bg-[#8B9474]/20 text-[#8B9474] font-bold'
                            : 'bg-[#FAF4ED] text-[#D18A6A]'
                        }`}>
                          {completedCount}/{daySteps.length} checked
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono opacity-40 text-[#1C1C1C]">Rest Day</span>
                      )}
                    </div>

                    {/* Progress thin bar */}
                    {daySteps.length > 0 && (
                      <div className="w-full h-1 bg-[#1C1C1C]/5 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-[#8B9474]"
                          style={{ width: `${(completedCount / daySteps.length) * 100}%` }}
                        />
                      </div>
                    )}

                    {/* Quick checkboxes listed inside the checklist day box directly */}
                    {daySteps.length > 0 && (
                      <div className="mt-3 space-y-1.5 pl-1 border-l-2 border-[#8B9474]/20">
                        {daySteps.map(step => {
                          const isDone = !!step.completedDays[day];
                          return (
                            <div
                              key={step.id}
                              onClick={(e) => {
                                e.stopPropagation(); // Avoid filter click collision
                                handleToggleDayCompletion(step.id, day);
                              }}
                              className="flex items-center justify-between text-[11px] group text-[#1C1C1C] hover:text-[#8B9474] transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`material-symbols-outlined text-[13px] leading-none ${
                                  isDone ? 'text-[#8B9474]' : 'text-[#1C1C1C]/30'
                                }`}>
                                  {isDone ? 'check_box' : 'check_box_outline_blank'}
                                </span>
                                <span className={`line-through-transition select-none ${isDone ? 'line-through opacity-45' : ''}`}>
                                  {step.title}
                                </span>
                              </div>
                              <span className="text-[9px] opacity-40 uppercase tracking-widest">{step.amPm}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </main>

      {/* Editor Modal Popup for Adding or Modifying a Ritual Step */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#FBF9F6] border border-[#1C1C1C]/15 rounded-3xl p-6 md:p-8 max-w-lg w-full relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-serif text-[#1C1C1C]">
                    {editingStepId ? 'Edit Alignment Step' : 'Add Ritual Step'}
                  </h3>
                  <p className="text-[9px] uppercase tracking-widest text-[#8B9474]">Apothecary Customizer</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-[#1C1C1C]/5 transition-colors rounded-full"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <form onSubmit={handleSaveStep} className="space-y-5">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1C1C1C]/70 block">
                    Routine Step Title
                  </label>
                  <input
                    type="text"
                    required
                    value={stepTitle}
                    onChange={(e) => setStepTitle(e.target.value)}
                    placeholder="e.g. Saffron Morning Glow, Green Tea Skin Mud wrap"
                    className="w-full bg-white border border-[#1C1C1C]/15 text-xs rounded-xl p-3 focus:outline-none focus:border-[#8B9474] text-[#1C1C1C]"
                  />
                </div>

                {/* AM / PM Option */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1C1C1C]/70 block">
                    Ritual Diurnal Period
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setStepAmPm('AM')}
                      className={`py-2 px-4 rounded-xl text-xs uppercase tracking-wider font-bold transition-all border ${
                        stepAmPm === 'AM'
                          ? 'bg-[#D18A6A]/10 border-[#D18A6A] text-[#D18A6A]'
                          : 'bg-white border-[#1C1C1C]/10 text-[#1C1C1C]/60 hover:border-[#1C1C1C]/25'
                      }`}
                    >
                      ☀️ Morning (AM)
                    </button>
                    <button
                      type="button"
                      onClick={() => setStepAmPm('PM')}
                      className={`py-2 px-4 rounded-xl text-xs uppercase tracking-wider font-bold transition-all border ${
                        stepAmPm === 'PM'
                          ? 'bg-[#1C1C1C] border-[#1C1C1C] text-white'
                          : 'bg-white border-[#1C1C1C]/10 text-[#1C1C1C]/60 hover:border-[#1C1C1C]/25'
                      }`}
                    >
                      🌙 Evening (PM)
                    </button>
                  </div>
                </div>

                {/* Day selector - multi-select for true week-based customize ability */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1C1C1C]/70 block">
                    Occurs on Weekdays (Multi-day Planner)
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {DAYS_OF_WEEK.map(day => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedDays(selectedDays.filter(d => d !== day));
                            } else {
                              setSelectedDays([...selectedDays, day]);
                            }
                          }}
                          className={`py-1.5 rounded-lg text-[9px] uppercase tracking-wider font-bold transition-all border ${
                            isSelected
                              ? 'bg-[#8B9474] border-[#8B9474] text-white shadow-xs'
                              : 'bg-white border-[#1C1C1C]/10 text-[#1C1C1C]/60'
                          }`}
                        >
                          {day.substring(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Product Association */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1C1C1C]/70 block">
                    Link with Active Product
                  </label>
                  <select
                    value={stepProductId}
                    onChange={(e) => setStepProductId(e.target.value)}
                    className="w-full bg-white border border-[#1C1C1C]/15 text-xs rounded-xl p-3 focus:outline-none focus:border-[#8B9474] text-[#1C1C1C]"
                  >
                    {PRODUCTS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category})
                      </option>
                    ))}
                    <option value="custom">Other / Custom Botanical</option>
                  </select>
                </div>

                {/* Custom product name if other is chosen */}
                {stepProductId === 'custom' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1C1C1C]/70 block">
                      Custom Botanical Name
                    </label>
                    <input
                      type="text"
                      required
                      value={stepCustomName}
                      onChange={(e) => setStepCustomName(e.target.value)}
                      placeholder="e.g. Scented Honey, Coconut Warm Herb extract"
                      className="w-full bg-white border border-[#1C1C1C]/15 text-xs rounded-xl p-3 focus:outline-none focus:border-[#8B9474] text-[#1C1C1C]"
                    />
                  </div>
                )}

                {/* Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 bg-white border border-[#1C1C1C]/10 text-[#1C1C1C]/70 hover:bg-gray-100 font-semibold text-[10px] uppercase mt-1 tracking-wider rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#1C1C1C] hover:bg-[#8B9474] text-white font-semibold text-[10px] uppercase mt-1 tracking-wider rounded-xl transition-colors"
                  >
                    {editingStepId ? 'Save Alignment' : 'Align Ritual Step'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EXQUISITE INTERACTIVE PDF PREVIEW & PRINT DIALOG MODAL */}
      <AnimatePresence>
        {showPrintModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto print:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#FAF6F2] border border-[#1C1C1C]/10 rounded-2xl max-w-4xl w-full flex flex-col max-h-[90vh] shadow-2xl relative overflow-hidden text-[#1C1C1C]"
            >
              {/* Modal control bar header */}
              <div className="bg-white px-6 py-4 border-b border-[#1C1C1C]/10 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-light text-[#1C1C1C]">Print & Download PDF Report</h3>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-[#8B9474]">Apothecary Summary & Diagnostic Matrix</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-[#8B9474] text-white hover:bg-[#8B9474]/95 text-[10px] uppercase tracking-widest font-bold transition-all rounded-xl flex items-center gap-2 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">print</span>
                    <span>Confirm & Print</span>
                  </button>
                  <button
                    onClick={() => setShowPrintModal(false)}
                    className="p-2 hover:bg-[#1C1C1C]/5 transition-colors rounded-full flex items-center justify-center text-[#1C1C1C]"
                    title="Close Preview"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              </div>

              {/* PDF Preview Content view - simulated papersheet */}
              <div className="p-4 md:p-8 overflow-y-auto bg-gray-200/50 flex-1">
                {/* Simulated Paper */}
                <div className="bg-white max-w-3xl mx-auto p-6 md:p-12 shadow-md border border-gray-100 min-h-[980px] text-[#1c1c1c] leading-relaxed relative flex flex-col justify-between font-serif">
                  {/* Watermark brand icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#8B9474]/4 text-[240px] pointer-events-none select-none z-0">
                    <span className="material-symbols-outlined text-inherit">spa</span>
                  </div>

                  <div className="space-y-8 relative z-10 text-left">
                    {/* Header border design */}
                    <div className="border-b-2 border-[#1C1C1C]/10 pb-6 flex justify-between items-start gap-4">
                      <div>
                        <h2 className="text-3xl font-serif italic font-light tracking-tight">Agnes.</h2>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8B9474] font-bold mt-1">
                          Skincare Sanctuary & Apothecary
                        </p>
                      </div>
                      <div className="text-right text-[10px] font-mono text-gray-500 uppercase space-y-1">
                        <p>Date: June 14, 2026</p>
                        <p>System Time: 12:13 PM</p>
                        <p className="text-[#8B9474] font-bold">Protocol ID: AG-88219</p>
                      </div>
                    </div>

                    {/* Report title */}
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-serif font-light uppercase tracking-widest text-[#1C1C1C]">
                        Customized Skincare Protocol & Safety Report
                      </h3>
                      <div className="w-16 h-[1.5px] bg-[#8B9474] mx-auto" />
                      <p className="text-xs font-serif italic text-gray-500 max-w-md mx-auto">
                        An authentic, personalized record of clinical skin diagnostics, tailored weekly ritual mappings, and chemical ingredient safety audits.
                      </p>
                    </div>

                    {/* Section 1: Client Portrait */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B9474] border-b border-gray-100 pb-1">
                        I. Client Diagnostic Portrait
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                        <div className="space-y-2 bg-[#FAF8F5] p-3 rounded-xl border border-gray-150">
                          <p className="text-[10px] font-mono text-gray-400 uppercase font-semibold">User Details</p>
                          <p className="text-sm font-serif font-bold text-gray-800">{userProfile.name}</p>
                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-gray-600 font-mono">
                            <div>Experience: <span className="font-bold">{userProfile.experienceLevel}</span></div>
                            <div>Gender: <span className="font-bold">{userProfile.gender}</span></div>
                          </div>
                        </div>

                        <div className="space-y-2 bg-[#FAF8F5] p-3 rounded-xl border border-gray-150">
                          <p className="text-[10px] font-mono text-gray-400 uppercase font-semibold">Skin Type Quiz Record</p>
                          {quizResult?.completed ? (
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-gray-800">
                                Feel: <span className="font-serif italic font-normal text-gray-600">{quizResult?.faceFeel || 'Dry & Dehydrated'}</span>
                              </p>
                              <div className="flex items-center gap-4 text-[11px] text-gray-600 font-mono">
                                <div>Sensitivity: <span className="text-[#D18A6A] font-bold">{quizResult?.sensitivityLevel}/5</span></div>
                                <div>Body: <span className="font-serif font-bold">{quizResult?.bodyHydration || 'Dehydrated'}</span></div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 italic font-serif">
                              Baseline custom state. Complete skin quiz to populate premium diagnostics.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Weekly Ritual Matrix */}
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-baseline border-b border-gray-100 pb-1">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B9474]">
                          II. Weekly Ritual Alignment Matrix
                        </h4>
                        <span className="text-[10px] font-mono uppercase bg-[#8B9474]/15 text-[#8B9474] px-2 py-0.5 rounded-md font-bold">
                          Goal Progress: {metrics.percent}% Aligned
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-[10px] font-sans">
                          <thead>
                            <tr className="border-b border-[#1C1C1C]/10 text-[9px] font-mono uppercase text-gray-400">
                              <th className="py-2 pr-4 font-bold">Day</th>
                              <th className="py-2 px-3 font-bold">Ritual Step & Action</th>
                              <th className="py-2 px-3 font-bold">Associated Product Recommendation</th>
                              <th className="py-2 px-3 font-bold">Cycle</th>
                              <th className="py-2 pl-3 font-bold text-right font-mono">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {DAYS_OF_WEEK.map((day) => {
                              const stepsForDay = weeklySteps.filter((s) => s.days.includes(day));
                              if (stepsForDay.length === 0) {
                                return (
                                  <tr key={day} className="hover:bg-gray-50/40">
                                    <td className="py-2 pr-4 font-serif font-bold text-gray-500">{day}</td>
                                    <td colSpan={4} className="py-2 px-3 text-gray-400 italic font-serif text-[10px]">
                                      Restful day - simple copper warm wash recommended
                                    </td>
                                  </tr>
                                );
                              }

                              return stepsForDay.map((step, idx) => {
                                const isChecked = !!step.completedDays[day];
                                return (
                                  <tr key={`${day}-${step.id}`} className="hover:bg-gray-50/40">
                                    <td className="py-2 pr-4 font-serif font-bold text-gray-800">
                                      {idx === 0 ? day : ''}
                                    </td>
                                    <td className="py-2 px-3 font-serif text-gray-900 font-semibold">{step.title}</td>
                                    <td className="py-2 px-3 text-gray-500 italic font-serif text-[10.5px]">{getProductName(step)}</td>
                                    <td className="py-2 px-3">
                                      <span className={`px-1 rounded-[4px] font-mono text-[8px] uppercase font-bold tracking-wider ${
                                        step.amPm === 'AM' ? 'bg-[#D18A6A]/15 text-[#D18A6A]' : 'bg-gray-100 text-gray-600'
                                      }`}>
                                        {step.amPm}
                                      </span>
                                    </td>
                                    <td className="py-2 pl-3 text-right">
                                      <span className={`font-mono text-[9px] font-bold ${
                                        isChecked ? 'text-[#8B9474]' : 'text-gray-300'
                                      }`}>
                                        {isChecked ? '✓ DONE' : '○ PENDING'}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              });
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Section 3: Ingredient Scan Safety History */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B9474] border-b border-gray-100 pb-1">
                        III. Chemical & Active Ingredient Scan History (Persistent Logs)
                      </h4>
                      
                      {scannedHistory.length > 0 ? (
                        <div className="space-y-2.5 font-sans">
                          {scannedHistory.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="p-3 bg-[#FAF8F5] border border-gray-150 rounded-xl space-y-1.5 text-[11px]">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-serif font-bold text-gray-800">{item.productName}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-mono text-gray-400">{item.scannedAt}</span>
                                  <span className="px-2 py-0.5 bg-[#8B9474]/15 text-[#8B9474] font-mono text-[9px] rounded font-bold uppercase tracking-wider">
                                    {item.safetyRating}
                                  </span>
                                </div>
                              </div>
                              <p className="text-[10.5px] font-serif italic text-gray-600 leading-relaxed">
                                "{item.verdict}"
                              </p>
                              {item.scannedIngredients && item.scannedIngredients.length > 0 && (
                                <div className="text-[9px] text-gray-400 font-mono tracking-wide leading-normal">
                                  Compounds detected: {item.scannedIngredients.slice(0, 9).join(', ')}
                                  {item.scannedIngredients.length > 9 ? '...' : ''}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border border-dashed border-gray-200 p-4 rounded-xl text-center font-sans">
                          <p className="text-xs italic font-serif text-gray-400">
                            No scanned labels parsed yet. Launch AI Ingredient Scan from the home portal to compile safe lab safety scores here.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Certified Foot stamps & Signatures */}
                  <div className="pt-6 border-t border-gray-100 flex justify-between items-end relative z-10 text-[9px] font-sans">
                    <div className="text-gray-400 space-y-0.5 text-left font-mono">
                      <p>CERTIFIED APOTHECARY REGISTRY CO.</p>
                      <p>AGNES MINDFUL PRACTICES FOR LUNAR SEASONS</p>
                    </div>
                    <div className="text-center font-serif space-y-1">
                      <p className="italic font-light tracking-widest text-[#1C1C1C] text-xs">Agis Dev. Team</p>
                      <div className="w-24 h-[1px] bg-gray-300 mx-auto" />
                      <p className="text-[8px] font-mono text-gray-400 uppercase tracking-widest">Aesthetic Endorsement Stamp</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help footer */}
              <div className="bg-white px-6 py-4 border-t border-[#1C1C1C]/15 text-center text-[10px] font-mono text-gray-400">
                Tip: Configures easily using "Save as PDF" directly in the print preview channel!
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RAW printable layout shown exclusively during printing browser frame */}
      <div className="hidden print:block absolute inset-0 bg-white text-[#1c1c1c] p-8 font-serif max-w-4xl mx-auto z-100 overflow-visible">
        <div className="space-y-8 text-left h-full">
          {/* Header border design */}
          <div className="border-b-2 border-[#1C1C1C]/15 pb-6 flex justify-between items-start gap-4">
            <div>
              <h2 className="text-3xl font-serif italic font-light tracking-tight">Agnes.</h2>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8B9474] font-bold mt-1">
                Skincare Sanctuary & Apothecary
              </p>
            </div>
            <div className="text-right text-[10px] font-mono text-gray-500 uppercase space-y-1">
              <p>Printed: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              <p>System Time: 12:13 PM</p>
              <p className="text-[#8B9474] font-bold">Protocol ID: AG-88219</p>
            </div>
          </div>

          {/* Report title */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-serif font-light uppercase tracking-widest text-[#1C1C1C]">
              Customized Skincare Protocol & Safety Report
            </h3>
            <div className="w-16 h-[1.5px] bg-[#8B9474] mx-auto" />
            <p className="text-xs font-serif italic text-gray-500 max-w-md mx-auto">
              An authentic, personalized record of clinical skin diagnostics, tailored weekly ritual mappings, and chemical ingredient safety audits.
            </p>
          </div>

          {/* Section 1: Client Portrait */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B9474] border-b border-gray-100 pb-1">
              I. Client Diagnostic Portrait
            </h4>
            <div className="grid grid-cols-2 gap-6 text-xs font-sans">
              <div className="space-y-2 bg-[#FAF8F5] p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] font-mono text-gray-400 uppercase font-semibold">User Details</p>
                <p className="text-sm font-serif font-bold text-gray-800">{userProfile.name}</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-gray-600 font-mono">
                  <div>Experience: <span className="font-bold">{userProfile.experienceLevel}</span></div>
                  <div>Gender: <span className="font-bold">{userProfile.gender}</span></div>
                </div>
              </div>

              <div className="space-y-2 bg-[#FAF8F5] p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] font-mono text-gray-400 uppercase font-semibold">Skin Type Quiz Record</p>
                {quizResult?.completed ? (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-800">
                      Feel: <span className="font-serif italic font-normal text-gray-600">{quizResult?.faceFeel || 'Dry & Dehydrated'}</span>
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-gray-600 font-mono">
                      <div>Sensitivity: <span className="text-[#D18A6A] font-bold">{quizResult?.sensitivityLevel}/5</span></div>
                      <div>Body: <span className="font-serif font-bold">{quizResult?.bodyHydration || 'Dehydrated'}</span></div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic font-serif">
                    Baseline custom state. Complete skin quiz to populate premium diagnostics.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Weekly Ritual Matrix */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-baseline border-b border-gray-100 pb-1">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B9474]">
                II. Weekly Ritual Alignment Matrix
              </h4>
              <span className="text-[10px] font-mono uppercase bg-[#8B9474]/15 text-[#8B9474] px-2 py-0.5 rounded-md font-bold">
                Goal Progress: {metrics.percent}% Aligned
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px] font-sans">
                <thead>
                  <tr className="border-b border-[#1C1C1C]/10 text-[9px] font-mono uppercase text-gray-400">
                    <th className="py-2 pr-4 font-bold">Day</th>
                    <th className="py-2 px-3 font-bold">Ritual Step & Action</th>
                    <th className="py-2 px-3 font-bold">Associated Product Recommendation</th>
                    <th className="py-2 px-3 font-bold">Cycle</th>
                    <th className="py-2 pl-3 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {DAYS_OF_WEEK.map((day) => {
                    const stepsForDay = weeklySteps.filter((s) => s.days.includes(day));
                    if (stepsForDay.length === 0) {
                      return (
                        <tr key={day} className="hover:bg-gray-50/40">
                          <td className="py-2.5 pr-4 font-serif font-bold text-gray-500">{day}</td>
                          <td colSpan={4} className="py-2.5 px-3 text-gray-400 italic font-serif text-[10px]">
                            Restful day - simple copper warm wash recommended
                          </td>
                        </tr>
                      );
                    }

                    return stepsForDay.map((step, idx) => {
                      const isChecked = !!step.completedDays[day];
                      return (
                        <tr key={`${day}-${step.id}`} className="hover:bg-gray-50/40">
                          <td className="py-2.5 pr-4 font-serif font-bold text-gray-800">
                            {idx === 0 ? day : ''}
                          </td>
                          <td className="py-2.5 px-3 font-serif text-gray-900 font-semibold">{step.title}</td>
                          <td className="py-2.5 px-3 text-gray-500 italic font-serif">{getProductName(step)}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-1 rounded-[4px] font-mono text-[9px] uppercase font-bold tracking-wider ${
                              step.amPm === 'AM' ? 'bg-[#D18A6A]/15 text-[#D18A6A]' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {step.amPm}
                            </span>
                          </td>
                          <td className="py-2.5 pl-3 text-right">
                            <span className={`font-mono text-[10px] font-bold ${
                              isChecked ? 'text-[#8B9474]' : 'text-gray-300'
                            }`}>
                              {isChecked ? '✓ DONE' : '○ PENDING'}
                            </span>
                          </td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Ingredient Scan Safety History */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B9474] border-b border-gray-100 pb-1">
              III. Chemical & Active Ingredient Scan History
            </h4>
            
            {scannedHistory.length > 0 ? (
              <div className="space-y-3 font-sans">
                {scannedHistory.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="p-3 bg-white border border-gray-100 rounded-xl space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-serif font-bold text-gray-800">{item.productName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-gray-400">{item.scannedAt}</span>
                        <span className="px-2 py-0.5 bg-[#8B9474]/15 text-[#8B9474] font-mono text-[9px] rounded font-bold uppercase tracking-wider">
                          {item.safetyRating}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10.5px] font-serif italic text-gray-500 leading-relaxed">
                      "{item.verdict}"
                    </p>
                    {item.scannedIngredients && item.scannedIngredients.length > 0 && (
                      <div className="text-[9px] text-gray-400 font-mono tracking-wide leading-normal">
                        Compounds detected: {item.scannedIngredients.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-gray-200 p-4 rounded-xl text-center">
                <p className="text-xs italic font-serif text-gray-400">
                  No scanned labels parsed yet. Launch AI Ingredient Scan from the home portal to compile safe lab safety scores here.
                </p>
              </div>
            )}
          </div>

          {/* Certified Foot stamps & Signatures */}
          <div className="pt-12 border-t border-gray-100 flex justify-between items-end relative z-10 text-[9px] font-sans">
            <div className="text-gray-400 space-y-0.5 text-left font-mono">
              <p>CERTIFIED APOTHECARY REGISTRY CO.</p>
              <p>AGNES MINDFUL PRACTICES FOR LUNAR SEASONS</p>
            </div>
            <div className="text-center font-serif space-y-1.5">
              <p className="italic font-light tracking-widest text-[#1C1C1C] text-xs">Agis Dev. Team</p>
              <div className="w-24 h-[1px] bg-gray-300 mx-auto" />
              <p className="text-[8px] font-mono text-gray-400 uppercase tracking-widest">Aesthetic Endorsement Stamp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tactile Skincare Notification toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1C1C1C] text-white px-5 py-3 rounded-full flex items-center gap-2.5 shadow-xl text-xs font-mono uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-sm text-[#8B9474] leading-none animate-spin">spa</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
