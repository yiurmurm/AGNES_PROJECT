import React, { useState } from 'react';
import { QuizState } from '../types';
import Ladybug from './Ladybug';

interface SkinTypeQuizProps {
  quizState: QuizState;
  onSaveQuizResults: (results: QuizState) => void;
  onNavigateHome: () => void;
}

interface Question {
  id: number;
  text: string;
  subtext: string;
  options: {
    value: 'A' | 'B' | 'C' | 'Yes' | 'No';
    text: string;
    subtext?: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Two hours after washing your face, look at your face in bright light. What do you see?",
    subtext: "Assess visual reflection and sebum output on your skin.",
    options: [
      {
        value: 'A',
        text: "No reflection of light at all; it looks entirely matte or dull.",
        subtext: "Indicates low sebum levels."
      },
      {
        value: 'B',
        text: "A slight reflection on my nose and forehead (T-zone), but my cheeks are matte.",
        subtext: "Localized, typical of combination behaviors."
      },
      {
        value: 'C',
        text: "Distinct shine across my forehead, nose, and cheeks.",
        subtext: "Active sebum production is present."
      }
    ]
  },
  {
    id: 2,
    text: "Run a clean finger across your cheeks and forehead. How does the texture feel?",
    subtext: "Observe tactile flakiness or slipperiness directly.",
    options: [
      {
        value: 'A',
        text: "Rough, sand-paperish, flakey, or tight.",
        subtext: "Suggests low moisture or dead skin accumulation."
      },
      {
        value: 'B',
        text: "Smooth and comfortable.",
        subtext: "A balanced, soft protective layer."
      },
      {
        value: 'C',
        text: "Slippery, greasy, or slick.",
        subtext: "Signifies a high oil-to-water ratio."
      }
    ]
  },
  {
    id: 3,
    text: "When you are in a cold, dry, or air-conditioned environment without moisturizer, your skin:",
    subtext: "The Environmental Stress Test tracks transepidermal water loss.",
    options: [
      {
        value: 'A',
        text: "Tightens significantly, feels intensely parched, or begins to flake/crack.",
        subtext: "Extremely delicate barrier response."
      },
      {
        value: 'B',
        text: "Feels slightly dry or normal, but generally manageable.",
        subtext: "Adaptable water retention capacity."
      },
      {
        value: 'C',
        text: "Stays completely fine or even looks shiny; I rarely feel the urgent need for a moisturizer.",
        subtext: "Robust intrinsic self-moisturization."
      }
    ]
  },
  {
    id: 4,
    text: "Look closely at your nose and the areas right next to it in a mirror. Your pores are:",
    subtext: "Pores act as outlets for oil production and structural visibility.",
    options: [
      {
        value: 'A',
        text: "Microscopic or virtually invisible.",
        subtext: "Highly compact skin structure."
      },
      {
        value: 'B',
        text: "Visibly apparent mainly on the nose, with occasional blackheads.",
        subtext: "Standard pore profile."
      },
      {
        value: 'C',
        text: "Large, noticeably dilated, and I frequently get blackheads or whiteheads across my whole face.",
        subtext: "Open sebum channels prone to debris."
      }
    ]
  },
  {
    id: 5,
    text: "Does your skin ever feel tight or stretched while simultaneously looking shiny or greasy on top?",
    subtext: "The Dehydration vs. Oiliness Paradox reveals underlying moisture barrier status.",
    options: [
      {
        value: 'Yes',
        text: "Yes, frequently.",
        subtext: "This indicates a compromised skin barrier letting water escape, despite high oil production."
      },
      {
        value: 'No',
        text: "No, virtually never.",
        subtext: "My skin's oil levels match how tight or comfortable it feels."
      }
    ]
  }
];

export default function SkinTypeQuiz({ quizState, onSaveQuizResults, onNavigateHome }: SkinTypeQuizProps) {
  // If previously completed, start at result screen (step = 6)
  const [currentStep, setCurrentStep] = useState(quizState.completed ? 6 : 0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'Yes' | 'No'>>({});
  
  const handleSelectOption = (questionId: number, value: 'A' | 'B' | 'C' | 'Yes' | 'No') => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep < 5) {
      if (!answers[currentStep]) {
        alert("Please pick an option to proceed.");
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5) {
      if (!answers[5]) {
        alert("Please pick an option to proceed.");
        return;
      }
      calculateAndSave();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateAndSave = () => {
    const listAnswers = [answers[1], answers[2], answers[3], answers[4], answers[5]];
    const numA = listAnswers.slice(0, 4).filter(a => a === 'A').length;
    const numB = listAnswers.slice(0, 4).filter(a => a === 'B').length;
    const numC = listAnswers.slice(0, 4).filter(a => a === 'C').length;
    const hasQ5Yes = answers[5] === 'Yes';

    let type = "Normal Skin";
    let needMoisture = "Maintenance Only";
    let directive = "Balanced oil and balanced water. Light lotions or basic hydrators preserve the baseline equilibrium.";
    let faceFeelMapped: 'Dry' | 'Oily' | 'Sensitive' | 'Normal' = 'Normal';

    if (hasQ5Yes) {
      if (numA >= numC) {
        type = "Severely Dry & Dehydrated";
        needMoisture = "Yes (Maximum Repair)";
        directive = "Critically low in both oil and water. Skin barrier is highly vulnerable. Requires rich barrier repair creams featuring ceramides and fatty acids.";
        faceFeelMapped = 'Dry';
      } else {
        type = "Oily, Dehydrated Skin";
        needMoisture = "Yes (Water-based)";
        directive = "High sebum but highly compromised moisture barrier. Avoid heavy oils (which cause acne); flood the skin with oil-free water binders like Hyaluronic Acid or Glycerin.";
        faceFeelMapped = 'Oily';
      }
    } else {
      if (numA >= 2 && numC <= 1) {
        type = "True Dry Skin";
        needMoisture = "Yes (High Priority)";
        directive = "Low sebum and low hydration. Needs both emollients (oils) to mimic sebum and humectants (water-binders).";
        faceFeelMapped = 'Dry';
      } else if (numC >= 2 && numA <= 1) {
        type = "True Oily Skin";
        needMoisture = "No / Minimal";
        directive = "High sebum and healthy hydration. Skip heavy creams. Use weightless, oil-free fluids or humectant-only gels if desired.";
        faceFeelMapped = 'Oily';
      } else if (numA > 0 && numC > 0) {
        type = "Combination Skin";
        needMoisture = "Zonal Moisture";
        directive = "Sebum is localized (high on T-zone, low on cheeks). Zone-hydrate: target cheeks with moisture, keep the T-zone light.";
        faceFeelMapped = 'Normal'; // Fits dynamic baseline
      } else {
        type = "Normal Skin";
        needMoisture = "Maintenance Only";
        directive = "Balanced oil and balanced water. Light lotions or basic hydrators preserve the baseline equilibrium.";
        faceFeelMapped = 'Normal';
      }
    }

    onSaveQuizResults({
      faceFeel: faceFeelMapped,
      sensitivityLevel: hasQ5Yes ? 8 : 3,
      bodyTexture: numA >= 2 ? 'Rough like Coral' : 'Smooth like Sand',
      bodyHydration: numA >= 2 ? 'Thirsty for Water' : 'Plump like a Mango',
      lipFeel: numA >= 2 ? 'Flaky' : 'Perfectly Soft',
      completed: true,
      resultTitle: type,
      resultDescription: `${needMoisture} | ${directive}`
    });

    setCurrentStep(6);
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentStep(0);
  };

  // Helper to extract cached scores to present elegantly
  const getResultsDisplay = () => {
    if (!quizState.resultTitle || !quizState.resultDescription) {
      return {
        type: "Normal Skin",
        needMoisture: "Maintenance Only",
        directive: "Balanced oil and balanced water. Light lotions or basic hydrators preserve the baseline equilibrium."
      };
    }
    const [need, ...rest] = quizState.resultDescription.split(' | ');
    return {
      type: quizState.resultTitle,
      needMoisture: need || 'Maintenance Only',
      directive: rest.join(' | ') || 'Balanced preservation.'
    };
  };

  return (
    <div className="relative min-h-screen bg-[#F9F6F2] font-sans pb-32 overflow-x-hidden text-[#1C1C1C] flex flex-col md:flex-row">
      
      {/* Side Menu Navigation Panel (Persistent on desktop) */}
      <nav className="fixed left-0 top-0 h-full w-72 z-40 bg-white border-r border-[#1C1C1C]/10 hidden md:flex flex-col p-8 select-none">
        <div className="mb-12">
          <h2 className="text-3xl font-serif italic tracking-tight font-light text-[#1C1C1C]">Agnes.</h2>
          <p className="text-[9px] font-mono uppercase tracking-widest opacity-60 mt-1">Your Skincare Sanctuary</p>
        </div>

        <div className="space-y-4 flex-grow">
          {/* Active Skin Type Quiz State */}
          <div className="flex items-center gap-4 bg-[#F9F6F2] text-[#1C1C1C] p-3 border border-[#1C1C1C]/10">
            <span className="material-symbols-outlined text-[#8B9474]">auto_awesome</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Skin Type Quiz</span>
          </div>

          <button
            onClick={onNavigateHome}
            className="w-full flex items-center gap-4 text-left p-3 hover:bg-[#F9F6F2]/60 transition-all cursor-pointer border border-transparent hover:border-[#1C1C1C]/5"
          >
            <span className="material-symbols-outlined text-[#1C1C1C] opacity-70">cottage</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1C1C1C]/70">Sanctuary Home</span>
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-[#1C1C1C]/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F9F6F2] overflow-hidden border border-[#1C1C1C]/10">
            <img
              alt="User Avatar"
              className="w-full h-full object-cover grayscale"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkNJy08aBHsj_Va7bLNYdBI6R_70b2UiTmcMtfol8cMgRSRpJoA34zCyKMmWHlW9bg9g5wegJe4O65IF1LPHbTW0v4YVShzMDo9gwH7Zi-_h1n2jasC1vg6roKUI3Li_l-xw5JO6kZ4AOrCBC9eYhATjReIZgK1CwcvyVld6bDVnjkSE3MLj6P1pxCDohqLOn62w8RGGPjd1ONMUqm_inwgWBb9e_CxKZ3vElZRdSqVhmF0lWSuzpHpAE7z6IAdVUy_6mX_MVwTNs"
            />
          </div>
          <div>
            <p className="text-xs font-serif font-bold text-[#1C1C1C] leading-none">Sweet Agnes</p>
            <p className="text-[9px] font-mono uppercase tracking-widest text-[#1C1C1C]/40 mt-1">Zen Member</p>
          </div>
        </div>
      </nav>

      {/* Main Content Pane */}
      <main className="flex-1 md:ml-72 pt-24 pb-32 px-6 md:px-12 relative overflow-hidden z-10">
        
        {/* Scurrying ladybugs of Quiz page behind text */}
        <Ladybug className="top-10 left-10 scale-[1.10] opacity-80" initialRotation={220} />
        <Ladybug className="bottom-[15%] right-[12%] scale-90 opacity-80" initialRotation={155} />

        {/* Top Header Row with specific "Back to Home" anchorage match */}
        <header className="flex justify-between items-center w-full mb-12">
          <div>
            <span className="text-[10px] tracking-widest font-mono uppercase opacity-55">
              Acupuncture & Sebum Diagnostic
            </span>
            <h2 className="font-serif text-2xl font-light text-[#1C1C1C]">Skin Typing Diagnostic</h2>
          </div>

          <a
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
            href="#"
            className="flex flex-col items-center gap-1 group transition-opacity opacity-65 hover:opacity-100 cursor-pointer"
          >
            <div className="w-10 h-10 bg-white flex items-center justify-center border border-[#1C1C1C]/10 hover:border-[#1C1C1C]/30 transition-colors">
              <span className="material-symbols-outlined text-[#1C1C1C] text-lg">cottage</span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider">Back to Home</span>
          </a>
        </header>

        {/* Dynamic Multi-Step Board */}
        <div className="max-w-2xl mx-auto bg-white/40 border border-[#1C1C1C]/10 rounded-3xl p-6 md:p-10 shadow-sm backdrop-blur-xs">
          
          {/* Step 0: Instructions Splash Screen */}
          {currentStep === 0 && (
            <div className="space-y-8 animate-fade-in text-center md:text-left">
              <div className="space-y-4">
                <h3 className="font-serif text-3xl font-light text-[#1C1C1C] tracking-tight leading-snug">
                  The Skin Typing Quiz
                </h3>
                
                <div className="bg-[#FAF8F5] border-l-4 border-[#8B9474] p-5 rounded-r-xl text-left shadow-xs">
                  <p className="text-xs font-mono uppercase tracking-widest font-bold text-[#8B9474] mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Preparation Guidelines
                  </p>
                  <p className="text-sm font-serif italic text-[#1C1C1C]/80 leading-relaxed">
                    To get the most accurate results, answer based on how your skin behaves <strong className="font-sans font-bold text-[#1C1C1C]">2 hours after washing your face</strong> without applying any skincare products.
                  </p>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-10 py-4 bg-[#1C1C1C] text-white hover:bg-[#2D423F] font-mono text-[11px] uppercase tracking-widest transition-all rounded-xl shadow-md cursor-pointer"
                >
                  Begin Diagnostic
                </button>
              </div>
            </div>
          )}

          {/* Steps 1 to 5: Custom Questions */}
          {currentStep > 0 && currentStep <= 5 && (
            <div className="space-y-8 animate-fade-in">
              {/* Micro progress line without complex text sideheadings */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-grow max-w-xs">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div
                      key={index}
                      className={`h-1 rounded-full transition-all duration-300 flex-grow ${
                        index <= currentStep ? 'bg-[#8B9474]' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-[#1C1C1C]/50 uppercase tracking-wider">
                  {currentStep} / 5 Finished
                </span>
              </div>

              {/* Dynamic Question Block */}
              <div className="space-y-1.5">
                <h3 className="font-serif text-xl md:text-2xl font-light text-[#1C1C1C] tracking-tight leading-relaxed">
                  {QUESTIONS[currentStep - 1].text}
                </h3>
                <p className="text-xs font-serif italic text-[#1C1C1C]/50">
                  {QUESTIONS[currentStep - 1].subtext}
                </p>
              </div>

              {/* Option cards */}
              <div className="space-y-4">
                {QUESTIONS[currentStep - 1].options.map((opt) => {
                  const isSelected = answers[currentStep] === opt.value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => handleSelectOption(currentStep, opt.value)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                        isSelected
                          ? 'border-[#1C1C1C] bg-[#8B9474]/5 shadow-xs'
                          : 'border-[#1C1C1C]/10 bg-white/75 hover:bg-white hover:border-[#1C1C1C]/25 text-[#1C1C1C]/80'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-lg leading-none mt-0.5 select-none ${
                        isSelected ? 'text-[#8B9474]' : 'text-gray-300'
                      }`}>
                        {isSelected ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <div className="flex-grow">
                        <p className="text-xs md:text-sm font-sans font-medium text-[#1C1C1C]">
                          {opt.text}
                        </p>
                        {opt.subtext && (
                          <p className="text-[11px] font-serif italic text-[#1C1C1C]/50 mt-1 leading-relaxed">
                            {opt.subtext}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step Navigation Controls */}
              <div className="pt-6 border-t border-[#1C1C1C]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-[#1C1C1C] border border-[#1C1C1C]/10 hover:border-[#1C1C1C]/30 rounded-xl font-mono text-[10px] uppercase tracking-wider transition-all"
                >
                  <span className="material-symbols-outlined text-xs">arrow_back</span>
                  Previous
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-7 py-3 bg-[#1C1C1C] text-white hover:bg-[#8B9474] font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-sm"
                >
                  <span>{currentStep === 5 ? 'Reveal My Skin Type' : 'Next Question'}</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Diagnostic results layout matching the requested permutation scoring */}
          {currentStep === 6 && (
            <div className="space-y-8 animate-fade-in text-center md:text-left">
              
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-[#8B9474] text-white text-[9px] font-mono uppercase tracking-widest rounded-md">
                  Validated Matrix Outcomes
                </span>
                <h3 className="font-serif text-2xl md:text-4xl font-light text-[#1C1C1C] tracking-tight">
                  Your Skin Type: <span className="italic font-bold">{getResultsDisplay().type}</span>
                </h3>
              </div>

              <div className="bg-white p-6 md:p-8 border border-[#1C1C1C]/15 rounded-2xl relative overflow-hidden shadow-sm space-y-6 text-left">
                <div className="space-y-3">
                  <p className="text-[9px] font-mono tracking-widest text-[#1C1C1C]/50 font-bold uppercase">
                    MOISTURE DIRECTIVE
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1 bg-[#FAF4ED] border border-[#D18A6A]/20 text-[#D18A6A] font-mono font-bold text-[10px] uppercase tracking-wider rounded-md">
                      Needs Hydration: {getResultsDisplay().needMoisture}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-[#1C1C1C]/10 pt-4">
                  <p className="text-[9px] font-mono tracking-widest text-[#1C1C1C]/50 font-bold uppercase">
                    BIOLOGICAL FORMULATION RULES
                  </p>
                  <p className="text-sm font-serif italic text-[#1C1C1C]/80 leading-relaxed">
                    "{getResultsDisplay().directive}"
                  </p>
                </div>

                <div className="space-y-3 border-t border-[#1C1C1C]/10 pt-4">
                  <p className="text-[9px] font-mono tracking-widest text-[#1C1C1C]/50 font-bold uppercase">
                    COMPENSATION THERAPY
                  </p>
                  <div className="p-4 bg-[#FAF8F5] border border-[#1C1C1C]/5 rounded-xl flex items-center gap-3 text-xs">
                    <span className="material-symbols-outlined text-[#8B9474] text-xl">auto_healing</span>
                    <p className="font-serif text-[#1C1C1C]/75 leading-relaxed">
                      This profile is mapped straight into your Sanctuary. Tap <strong className="font-sans font-bold">Save to My Shelf</strong> to link recommended marine-algae and sandalwood elements automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
                <button
                  onClick={onNavigateHome}
                  className="px-8 py-3.5 bg-[#1C1C1C] text-white hover:bg-[#8B9474] font-mono text-[10px] uppercase tracking-widest transition-all rounded-xl shadow-md cursor-pointer"
                >
                  Save to My Shelf
                </button>

                <button
                  onClick={handleRetake}
                  className="px-6 py-3.5 bg-white text-[#1C1C1C]/70 hover:text-[#1C1C1C] font-mono text-[10px] uppercase tracking-widest border border-[#1C1C1C]/10 hover:border-[#1C1C1C]/30 transition-all rounded-xl cursor-pointer"
                >
                  Reset & Retake
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
