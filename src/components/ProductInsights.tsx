import React, { useState, useEffect } from 'react';
import { Product, UserProfile, QuizState } from '../types';
import { PRODUCTS, INGREDIENT_DETAILS } from '../data';
import Ladybug from './Ladybug';

interface IngredientImpact {
  status: 'beneficial' | 'problematic' | 'neutral';
  reason?: string;
}

export function getIngredientImpact(ingredientName: string, filter: string): IngredientImpact {
  const ing = ingredientName.toLowerCase().trim();
  
  if (filter === 'acne') {
    if (
      ing.includes('zinc pca') ||
      ing.includes('aloe barbadensis') ||
      ing.includes('aloe') ||
      ing.includes('allantoin') ||
      ing.includes('panthenol') ||
      ing.includes('niacinamide') ||
      ing.includes('silica') ||
      ing.includes('zinc oxide') ||
      ing.includes('titanium dioxide') ||
      ing.includes('salicylic') ||
      ing.includes('azelaic')
    ) {
      return { status: 'beneficial', reason: 'Regulates sebum, speeds acne healing, or provides non-comedogenic physical defense.' };
    }
    if (
      ing.includes('isopropyl myristate') ||
      ing.includes('shea butter') ||
      ing.includes('butyrospermum parkii') ||
      ing.includes('coconut oil') ||
      ing.includes('stearic acid')
    ) {
      return { status: 'problematic', reason: 'High comedogenicity index; pre-disposed to clogs and nesting breakout bacteria.' };
    }
  }
  
  if (filter === 'pigmentation') {
    if (
      ing.includes('niacinamide') ||
      ing.includes('azelaic') ||
      ing.includes('saffron') ||
      ing.includes('ascorbic') ||
      ing.includes('glycolic') ||
      ing.includes('panthenol') ||
      ing.includes('allantoin')
    ) {
      return { status: 'beneficial', reason: 'Targets melanin pathways, diminishes post-blemish spots, or triggers clean cell turnover.' };
    }
    if (ing.includes('alcohol denat') || ing.includes('fragrance')) {
      return { status: 'problematic', reason: 'Drying agent or scent trace; can induce micro-irritation which worsens dark spots.' };
    }
  }

  if (filter === 'rosacea') {
    if (
      ing.includes('panthenol') ||
      ing.includes('allantoin') ||
      ing.includes('niacinamide') ||
      ing.includes('aloe barbadensis') ||
      ing.includes('aloe') ||
      ing.includes('glycerin') ||
      ing.includes('hyaluronic') ||
      ing.includes('sodium hyaluronate') ||
      ing.includes('azelaic') ||
      ing.includes('centella') ||
      ing.includes('green tea')
    ) {
      return { status: 'beneficial', reason: 'Reduces vascular stress, cools localized surface heat, and fortifies capillaries.' };
    }
    if (
      ing.includes('benzophenone-3') ||
      ing.includes('fragrance') ||
      ing.includes('alcohol denat') ||
      ing.includes('blue 1') ||
      ing.includes('salicylic') ||
      ing.includes('glycolic')
    ) {
      return { status: 'problematic', reason: 'Known chemical trigger that exacerbates facial redness and burning sensations.' };
    }
  }

  if (filter === 'eczema') {
    if (
      ing.includes('ceramide') ||
      ing.includes('cholesterol') ||
      ing.includes('phytosphingosine') ||
      ing.includes('shea butter') ||
      ing.includes('butyrospermum parkii') ||
      ing.includes('glycerin') ||
      ing.includes('glycerine') ||
      ing.includes('panthenol') ||
      ing.includes('hyaluronic') ||
      ing.includes('sodium hyaluronate') ||
      ing.includes('squalane') ||
      ing.includes('macadamia') ||
      ing.includes('oatmeal') ||
      ing.includes('allantoin') ||
      ing.includes('phospholipids') ||
      ing.includes('hydrogenated polyisobutene')
    ) {
      return { status: 'beneficial', reason: 'Replenishes vital intercellular lipids, secures loose scales, and provides lipid weight.' };
    }
    if (
      ing.includes('alcohol denat') ||
      ing.includes('fragrance') ||
      ing.includes('benzophenone-3') ||
      ing.includes('blue 1') ||
      ing.includes('salicylic') ||
      ing.includes('glycolic')
    ) {
      return { status: 'problematic', reason: 'Excoriating agent; strips valuable moisture barrier fats and stings cracked patches.' };
    }
  }

  if (filter === 'lips') {
    if (
      ing.includes('glycerin') ||
      ing.includes('glycerine') ||
      ing.includes('panthenol') ||
      ing.includes('sodium hyaluronate') ||
      ing.includes('hyaluronic') ||
      ing.includes('shea butter') ||
      ing.includes('butyrospermum parkii') ||
      ing.includes('squalane') ||
      ing.includes('petrolatum') ||
      ing.includes('allantoin') ||
      ing.includes('ceramide') ||
      ing.includes('hydrogenated polyisobutene')
    ) {
      return { status: 'beneficial', reason: 'Nourishes sensitive thin lip skin, sealing raw micro-cracks and keeping moisture locked.' };
    }
    if (
      ing.includes('benzophenone-3') ||
      ing.includes('fragrance') ||
      ing.includes('alcohol denat') ||
      ing.includes('isopropyl myristate') ||
      ing.includes('blue 1') ||
      ing.includes('salicylic')
    ) {
      return { status: 'problematic', reason: 'Highly drying or harsh synthetic element unfit for delicate lip lines.' };
    }
  }

  if (filter === 'dehydration') {
    if (
      ing.includes('glycerin') ||
      ing.includes('glycerine') ||
      ing.includes('hyaluronic') ||
      ing.includes('sodium hyaluronate') ||
      ing.includes('panthenol') ||
      ing.includes('xylitylglucoside') ||
      ing.includes('anhydroxylitol') ||
      ing.includes('xylitol') ||
      ing.includes('betaine') ||
      ing.includes('polyglutamic') ||
      ing.includes('butylene glycol') ||
      ing.includes('propylene glycol') ||
      ing.includes('aloe') ||
      ing.includes('phospholipids')
    ) {
      return { status: 'beneficial', reason: 'Humectant element that draws cellular hydration into dry epidermal layers.' };
    }
  }

  return { status: 'neutral' };
}

export function getIngredientDescription(name: string, product: Product): string {
  const normName = name.toLowerCase().trim();
  
  const dictMatch = product.ingredientsDictionary?.find(
    (item) => item.ingredient.toLowerCase().trim() === normName
  );
  if (dictMatch) return dictMatch.function;

  const globalMatch = Object.entries(INGREDIENT_DETAILS).find(
    ([key]) => key.toLowerCase().trim() === normName
  );
  if (globalMatch) return globalMatch[1];

  if (normName.includes('aqua') || normName.includes('water')) {
    return 'Primary pure base solvent that delivers and suspends water-soluble botanical and chemical nutrients.';
  }
  if (normName.includes('phenoxyethanol') || normName.includes('ethylhexylglycerin')) {
    return 'Dermatologist-approved preservative that keeps the bottle sterile and free from unwanted microbes.';
  }
  if (normName.includes('carbomer') || normName.includes('sodium hydroxide')) {
    return 'pH-balancing or texture-regulating helper to maintain a cooling gel standard.';
  }
  
  return 'A safe carrier, texture enhancer, or emulsion medium assisting in the consistent application of pure actives.';
}

interface ProductInsightsProps {
  productId?: string;
  userProfile?: UserProfile;
  quizState?: QuizState;
  onNavigateHome: () => void;
}

export default function ProductInsights({ productId = 'marine-dew-serum', userProfile, quizState, onNavigateHome }: ProductInsightsProps) {
  // Retrieve target product, default to Marine Dew
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  const [activeIngredient, setActiveIngredient] = useState<string | null>(null);
  const [showConsultForm, setShowConsultForm] = useState(false);
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(true);
  const [ingSearchQuery, setIngSearchQuery] = useState('');
  const [selectedClinicalFilter, setSelectedClinicalFilter] = useState<string | null>(null);

  // Automatically pre-load clinical target matching the user's skin profile/quiz answers
  useEffect(() => {
    if (quizState) {
      if (quizState.lipFeel === 'Chapped' || quizState.lipFeel === 'Flaky') {
        setSelectedClinicalFilter('lips');
      } else if (quizState.faceFeel === 'Oily') {
        setSelectedClinicalFilter('acne');
      } else if (quizState.faceFeel === 'Sensitive' || quizState.sensitivityLevel >= 7) {
        setSelectedClinicalFilter('rosacea');
      } else if (quizState.faceFeel === 'Dry') {
        setSelectedClinicalFilter('eczema');
      } else {
        setSelectedClinicalFilter('dehydration'); // gentle default safe for dehydration
      }
    }
  }, [quizState, productId]);

  // Bot chat interaction
  const [chatMessages, setChatMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    {
      sender: 'bot',
      text: `Hello there! I'm Agnes Bot. ${
        product.isDiscontinued
          ? `Since the beloved ${product.name} has been discontinued, I can recommend amazing active alternatives tailored to your profile!`
          : `I can help answer any questions you have about our ${product.name} formula!`
      }`,
    },
  ]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setUserInput('');

    // Instant smart answers based on product ingredients
    setTimeout(() => {
      let botResponse = `To complement your skincare ritual with the premium qualities of ${product.name}, I recommend incorporating formulas with ${
        product.id === 'marine-dew-serum' ? 'Sodium Hyaluronate or Niacinamide' : 'Saffron or Aloe'
      }. These maintain hydration while preserving barrier strength!`;

      if (userText.toLowerCase().includes('discontinue') || userText.toLowerCase().includes('alternative')) {
        botResponse = `Since ${product.name} is no longer manufactured, the best direct active matches are the Saffron Sunshine Gel or Minimalist Niacinamide serum, depending on your core skin quiz results!`;
      } else if (userText.toLowerCase().includes('ingredient') || userText.toLowerCase().includes('acid')) {
        botResponse = `This formulation utilizes natural skin-identical elements like Aqua and Panthenol to ensure compatibility with high-sensitivity indexes without triggering dermal redness!`;
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    }, 800);
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultSubmitted(true);
    setTimeout(() => {
      setConsultSubmitted(false);
      setShowConsultForm(false);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#F9F6F2] font-sans pb-32 overflow-x-hidden text-[#1C1C1C]">
      
      {/* Top Application Bar */}
      <header className="flex items-baseline justify-between px-12 pt-10 pb-6 w-full fixed top-0 z-50 bg-[#F9F6F2]/90 backdrop-blur-md border-b border-[#1C1C1C]/10">
        <div className="flex items-center space-x-12">
          <h1 className="text-3xl font-serif italic tracking-tight font-light text-[#1C1C1C]">Agnes.</h1>
          <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-widest opacity-60">
            Ingredient Insights
          </span>
        </div>

        {/* HOME XPATH EXACT ANCHOR IN SPECIFICATION */}
        <a
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome();
          }}
          href="#"
          className="flex items-center gap-2 group opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        >
          {/* Exact data-icon='home' and className material-symbols-outlined */}
          <span data-icon="home" className="material-symbols-outlined text-[#1C1C1C] text-2xl">
            home
          </span>
        </a>
      </header>

      {/* Main product showcase */}
      <main className="max-w-6xl mx-auto pt-36 px-12 space-y-12 z-10 relative">
        
        {/* Ladybugs of Product page */}
        <Ladybug className="bottom-[20%] left-12 scale-100" initialRotation={190} />
        <Ladybug className="top-12 right-24 scale-95" initialRotation={10} />

        {/* Back Link Breadcrumb */}
        <div className="pt-4">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#1C1C1C]/60 hover:text-[#1C1C1C] duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Sanctuary Shelf
          </button>
        </div>

        {/* Product Hero Profile card */}
        <section className="bg-white p-8 md:p-12 border border-[#1C1C1C]/10 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.05)] grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          {/* Product image with Loves Indicator */}
          <div className="flex flex-col items-center justify-center relative p-6 bg-[#F9F6F2] border border-[#1C1C1C]/5">
            {/* Loves Pill Indicator */}
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-[#D18A6A] text-white text-[10px] font-mono uppercase tracking-widest">
              <span className="material-symbols-outlined text-xs">favorite</span>
              <span>{product.lovesCount} Loved</span>
            </div>

            {product.isDiscontinued && (
              <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 border border-red-100 text-[9px] font-mono uppercase tracking-widest z-20">
                <span className="material-symbols-outlined text-[10px]">error</span>
                <span>Discontinued</span>
              </div>
            )}

            <div className="h-64 md:h-80 mix-blend-multiply hover:rotate-3 transition-transform duration-500">
              <img alt={product.name} className="h-full object-contain" src={product.imgUrl} />
            </div>
          </div>

          {/* Product details */}
          <div className="space-y-6">
            <div>
              <span className="text-[10px] tracking-widest font-mono uppercase opacity-55">
                {product.category}
              </span>
              <h2 className="font-serif text-4xl font-light text-[#1C1C1C] leading-snug tracking-tight mt-1">
                {product.name}
              </h2>
            </div>

            <p className="text-base font-serif italic text-[#1C1C1C]/70 leading-relaxed font-sans">
              {product.quote}
            </p>

            {/* Compatibility rating bar */}
            <div className="p-5 bg-[#F9F6F2] border border-[#1C1C1C]/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-60">Compatibility Match</span>
                <span className="text-xs font-mono font-bold text-[#1C1C1C]">{product.compatibilityScore}%</span>
              </div>
              <div className="w-full bg-white border border-[#1C1C1C]/5 rounded-sm h-1.5 overflow-hidden">
                <div
                  className="bg-[#8B9474] h-full duration-500"
                  style={{ width: `${product.compatibilityScore}%` }}
                />
              </div>
            </div>

            {/* Timeline Milestones box */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-[#1C1C1C]/10 py-5 font-mono text-[10px]">
              <div>
                <p className="text-[#1C1C1C]/50 tracking-widest font-bold uppercase">Manufacturing debut</p>
                <p className="text-[#1C1C1C] mt-1 text-xs font-semibold">{product.manufacturingDate}</p>
              </div>
              <div>
                <p className="text-[#1C1C1C]/50 tracking-widest font-bold uppercase">Archive date</p>
                <p
                  className={`mt-1 text-xs font-semibold ${
                    product.isDiscontinued ? 'text-red-500 font-bold' : 'text-[#1C1C1C]'
                  }`}
                >
                  {product.discontinuedDate}
                </p>
              </div>
            </div>

            {/* Action rows */}
            <div className="flex flex-wrap gap-4">
              <a
                href={product.amazonUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 border border-[#FF9900]/40 text-[#a06010] bg-[#FF9900]/5 hover:bg-[#FF9900]/10 text-[11px] font-mono uppercase tracking-widest transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">local_mall</span>
                Find on Amazon
              </a>

              <button
                onClick={() => setShowConsultForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#1C1C1C] text-white hover:bg-[#2D423F] text-[11px] font-mono uppercase tracking-widest transition-colors shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">medical_services</span>
                Consult panel
              </button>
            </div>
          </div>
        </section>

        {/* Expandable Core Ingredients Bubbles list with Dynamic clinical targeting */}
        <section id="clinical-targeting-pills" className="bg-white p-8 border border-[#1C1C1C]/10 shadow-sm scroll-mt-28">
          <div className="mb-6 border-b border-[#1C1C1C]/5 pb-4">
            <h3 className="text-lg font-serif font-light text-[#1C1C1C] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8B9474]">biotech</span>
              Dynamic Formulation Explorer
            </h3>
            <p className="text-xs text-[#1C1C1C]/60 italic mt-1 font-serif leading-relaxed">
              Explore the exact chemical ledger of the <strong>{product.name}</strong> formulation. Filter by targets, or search specific active components.
            </p>
          </div>

          {/* Interactive Search Bar */}
          <div className="relative mb-5">
            <input
              type="text"
              value={ingSearchQuery}
              onChange={(e) => setIngSearchQuery(e.target.value)}
              placeholder="🔍 Search ingredients or clinical functions in this formula..."
              className="w-full bg-[#F9F6F2] border border-[#1C1C1C]/15 py-3.5 pl-11 pr-12 outline-none text-xs text-[#1C1C1C] rounded-2xl focus:border-[#2D423F] font-sans"
            />
            {ingSearchQuery && (
              <button
                onClick={() => setIngSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono uppercase tracking-widest text-[#1C1C1C]/40 hover:text-[#1C1C1C] px-2 py-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Skin Conditions & Effected Skin Parts Toolbar */}
          <div className="mb-6 bg-[#F9F6F2]/40 p-4 border border-[#1C1C1C]/5 rounded-2xl">
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-55 block mb-2 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">tune</span>
              Target Condition / Affected Zone
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'acne', label: '🌋 Acne & Pores', activeBg: 'bg-orange-50 text-[#D18A6A] border-orange-200' },
                { id: 'pigmentation', label: '✨ Pigmentation', activeBg: 'bg-amber-50 text-amber-800 border-amber-200' },
                { id: 'rosacea', label: '🌸 Rosacea & Redness', activeBg: 'bg-rose-50 text-red-800 border-rose-200' },
                { id: 'eczema', label: '❄️ Eczema & Dryness', activeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                { id: 'lips', label: '🩹 Lips & Delicate Zone', activeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
                { id: 'dehydration', label: '💧 Dehydration', activeBg: 'bg-blue-50 text-blue-800 border-blue-200' }
              ].map((target) => {
                const isActive = selectedClinicalFilter === target.id;
                return (
                  <button
                    key={target.id}
                    onClick={() => {
                      setSelectedClinicalFilter(isActive ? null : target.id);
                      setActiveIngredient(null);
                    }}
                    className={`px-3.5 py-1.5 text-[10px] font-mono tracking-wide rounded-xl border transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-sm'
                        : 'bg-white text-[#1C1C1C]/65 border-[#1C1C1C]/10 hover:border-[#1C1C1C]/35 hover:text-[#1C1C1C]'
                    }`}
                  >
                    {target.label}
                    {isActive && (
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active clinical analysis summary */}
          {selectedClinicalFilter && (
            <div className="mb-6 p-4 border border-[#8B9474]/20 bg-[#8B9474]/5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-fadeIn">
              <div>
                <h4 className="font-serif font-bold text-xs text-[#1C1C1C] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#8B9474]">analytics</span>
                  Agnes Formulation Scan: {
                    selectedClinicalFilter === 'acne' ? 'Acne & Pores' : 
                    selectedClinicalFilter === 'pigmentation' ? 'Pigmentation Care' :
                    selectedClinicalFilter === 'rosacea' ? 'Rosacea & Redness' :
                    selectedClinicalFilter === 'eczema' ? 'Eczema / Flake Defense' :
                    selectedClinicalFilter === 'lips' ? 'Sensitive Lips & Mucosa' : 'Dehydration Therapy'
                  }
                </h4>
                <p className="text-[10px] text-[#1C1C1C]/60 mt-0.5 leading-relaxed font-sans">
                  The active elements below are color-coded based on proven clinical compatibility with your selected target.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="text-center bg-white px-3 py-1.5 border border-[#1C1C1C]/5 rounded-lg min-w-[70px]">
                  <div className="text-sm font-serif font-bold text-emerald-800">
                    {product.ingredients?.split(',').map(item => item.trim()).filter(Boolean).filter(ing => getIngredientImpact(ing, selectedClinicalFilter).status === 'beneficial').length || 0}
                  </div>
                  <div className="text-[8px] font-mono uppercase tracking-widest text-[#1C1C1C]/55">Beneficial</div>
                </div>
                <div className="text-center bg-white px-3 py-1.5 border border-[#1C1C1C]/5 rounded-lg min-w-[70px]">
                  <div className="text-sm font-serif font-bold text-rose-800">
                    {product.ingredients?.split(',').map(item => item.trim()).filter(Boolean).filter(ing => getIngredientImpact(ing, selectedClinicalFilter).status === 'problematic').length || 0}
                  </div>
                  <div className="text-[8px] font-mono uppercase tracking-widest text-[#1C1C1C]/55">Avoid / Test</div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Bubble Pills */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            {product.ingredients?.split(',').map(item => item.trim()).filter(Boolean)
              .filter(ing => !ingSearchQuery || ing.toLowerCase().includes(ingSearchQuery.toLowerCase()))
              .map((ingredient) => {
                const impact = selectedClinicalFilter 
                  ? getIngredientImpact(ingredient, selectedClinicalFilter) 
                  : { status: 'neutral' };

                let pillStyle = "bg-white text-[#1C1C1C]/75 border-[#1C1C1C]/10 hover:border-[#1C1C1C]/35";
                let badgeSym = "";

                if (impact.status === 'beneficial') {
                  pillStyle = 'bg-emerald-50/80 text-emerald-900 border-emerald-300 hover:border-emerald-500 shadow-[0_2px_4px_rgba(16,185,129,0.08)]';
                  badgeSym = "✨";
                } else if (impact.status === 'problematic') {
                  pillStyle = 'bg-rose-50/80 text-rose-900 border-rose-300 hover:border-rose-500 shadow-[0_2px_4px_rgba(244,63,94,0.08)]';
                  badgeSym = "⚠️";
                }

                const isActive = activeIngredient?.toLowerCase().trim() === ingredient.toLowerCase().trim();

                return (
                  <button
                    key={ingredient}
                    onClick={() => setActiveIngredient(isActive ? null : ingredient)}
                    className={`px-3.5 py-2 font-mono text-[10px] uppercase font-bold tracking-wider transition-all duration-300 border rounded-lg flex items-center gap-1 cursor-pointer ${pillStyle} ${
                      isActive ? 'ring-2 ring-[#2D423F] ring-offset-1 font-extrabold scale-102' : ''
                    }`}
                  >
                    {badgeSym && <span className="text-[10px] leading-none pr-0.5">{badgeSym}</span>}
                    <span>{ingredient}</span>
                    <span className="material-symbols-outlined text-[9px] leading-none ml-1 opacity-50">
                      {isActive ? 'remove' : 'add'}
                    </span>
                  </button>
                );
              })}

            {/* Empty state list */}
            {product.ingredients?.split(',').map(item => item.trim()).filter(Boolean).filter(ing => !ingSearchQuery || ing.toLowerCase().includes(ingSearchQuery.toLowerCase())).length === 0 && (
              <div className="w-full text-center py-6 bg-[#F9F6F2]/45 border border-dashed border-[#1C1C1C]/10 rounded-xl">
                <span className="material-symbols-outlined text-neutral-300 text-xl block mb-1">search_off</span>
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">No ingredient matching "{ingSearchQuery}" found in this formula.</p>
              </div>
            )}
          </div>

          {/* Interactive detail drawer */}
          {activeIngredient ? (
            <div className="p-5 bg-[#F9F6F2] border-l-3 border-[#8B9474] font-serif text-sm italic text-[#1C1C1C]/80 leading-relaxed rounded-r-xl transition-all duration-300">
              <strong className="text-[10px] tracking-widest font-mono uppercase text-[#8B9474] block mb-2">
                {activeIngredient}
                {selectedClinicalFilter && getIngredientImpact(activeIngredient, selectedClinicalFilter).status !== 'neutral' && (
                  <span className={`ml-2 text-[9px] px-1.5 py-0.5 rounded ${
                    getIngredientImpact(activeIngredient, selectedClinicalFilter).status === 'beneficial'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-250'
                      : 'bg-rose-100 text-rose-800 border border-rose-250'
                  }`}>
                    {getIngredientImpact(activeIngredient, selectedClinicalFilter).status === 'beneficial' ? '✓ Clinically Beneficial' : '⚠️ Test / Avoid'}
                  </span>
                )}
              </strong>
              <p className="mb-2 font-sans text-xs text-[#1C1C1C]/80">{getIngredientDescription(activeIngredient, product)}</p>
              {selectedClinicalFilter && getIngredientImpact(activeIngredient, selectedClinicalFilter).status !== 'neutral' && (
                <div className="mt-3 p-3 bg-white/70 border border-[#1C1C1C]/5 rounded-lg text-xs font-sans not-italic">
                  <span className="font-mono text-[9px] tracking-widest uppercase opacity-50 block mb-0.5 font-bold">clinical alignment reason</span>
                  {getIngredientImpact(activeIngredient, selectedClinicalFilter).reason}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-[#F2EDE4]/30 text-center text-[10px] font-mono tracking-wide opacity-50 uppercase rounded-xl">
              Pro-tip: Select any pill above to see clinical descriptions & target compatibility reasons.
            </div>
          )}
        </section>

        {/* Full Chemical disclosures listed */}
        <section className="bg-white p-8 border border-[#1C1C1C]/10 shadow-sm">
          <h3 className="text-lg font-serif font-light text-[#1C1C1C] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8B9474]">menu_book</span>
            Clean Ingredient Disclosure (INCI ledger)
          </h3>
          <div className="bg-[#F9F6F2] p-5 font-mono text-xs text-[#1C1C1C]/75 leading-relaxed border border-[#1C1C1C]/5">
            {product.ingredients}
          </div>
          <p className="text-[10px] text-[#1C1C1C]/50 mt-3 italic leading-relaxed">
            *In compliance with clinical purity mandates, Project Agnes lists 100% of ingredient materials openly. Zero hidden fragrance agents or undisclosed chemical vehicles are permitted on our Sanctuary Shelf.
          </p>
        </section>

        {/* Expert Sanctuary Voices */}
        <section className="bg-white p-8 border border-[#1C1C1C]/10 shadow-sm">
          <div className="mb-6 border-b border-[#1C1C1C]/5 pb-4">
            <h3 className="text-lg font-serif font-light text-[#1C1C1C] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8B9474]">forum</span>
              Expert Sanctuary Voices
            </h3>
            <p className="text-xs text-[#1C1C1C]/60 italic font-serif leading-relaxed">
              Verified clinical findings, dermatological insights, and community testimonials.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start p-5 bg-[#F9F6F2]/60 border border-[#1C1C1C]/5">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-[#1C1C1C]/10 flex-shrink-0 bg-white">
              <img alt="Expert Avatar Doctor" className="w-full h-full object-cover" src={product.expertAvatar} />
            </div>
            <div className="space-y-2 flex-grow">
              <div className="flex items-center gap-1.5 text-[#D18A6A]">
                <span className="material-symbols-outlined text-xs leading-none">star</span>
                <span className="material-symbols-outlined text-xs leading-none">star</span>
                <span className="material-symbols-outlined text-xs leading-none">star</span>
                <span className="material-symbols-outlined text-xs leading-none">star</span>
                <span className="material-symbols-outlined text-xs leading-none">star</span>
                <span className="text-[10px] font-mono tracking-wider ml-1 text-[#1C1C1C]/60">Clinical Review</span>
              </div>
              <p className="text-base font-serif italic text-[#1C1C1C]/80 leading-relaxed">
                "{product.expertReview}"
              </p>
              <div className="pt-2">
                <p className="text-xs font-serif font-bold text-[#1C1C1C]">{product.expertName}</p>
                <p className="text-[9px] font-mono uppercase tracking-widest text-[#1C1C1C]/40 mt-0.5">{product.expertRole}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Counselor Chatbot floating widget in corner */}
      {isChatCollapsed ? (
        <button
          onClick={() => setIsChatCollapsed(false)}
          className="fixed bottom-6 right-6 z-40 bg-[#1C1C1C] text-[#F9F6F2] p-3 shadow-2xl rounded-full flex items-center gap-2 hover:bg-[#2D423F] transition-all duration-300 cursor-pointer border border-white/10"
        >
          <span className="material-symbols-outlined text-lg leading-none">smart_toy</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] font-semibold pr-1">Consult Counselor Bot</span>
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        </button>
      ) : (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm w-80 sm:w-96 bg-white border border-[#1C1C1C]/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col p-5 animate-fadeIn">
          <div className="flex justify-between items-center pb-2 border-b border-[#1C1C1C]/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1C1C1C] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <div>
                <p className="text-xs font-serif font-bold text-[#1C1C1C]">Agnes Counselor Bot</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                  <span className="text-[9px] font-mono tracking-widest opacity-60 uppercase">Companion Active</span>
                </div>
              </div>
            </div>
            
            {/* Collapse Button */}
            <button
              onClick={() => setIsChatCollapsed(true)}
              className="p-1 hover:bg-[#F9F6F2] text-[#1C1C1C]/60 hover:text-[#1C1C1C] transition-colors rounded-sm cursor-pointer flex items-center justify-center"
              title="Minimize chat"
            >
              <span className="material-symbols-outlined text-sm">close_fullscreen</span>
            </button>
          </div>

          {/* Messages Body */}
          <div className="h-44 overflow-y-auto my-3 space-y-3 p-1 text-xs">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3 max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#2D423F] text-white'
                      : 'bg-[#F9F6F2] text-[#1C1C1C] border border-[#1C1C1C]/5'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Answer Options */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            <button
              onClick={() => {
                setUserInput('What is a safe alternative?');
              }}
              className="text-[9px] font-mono tracking-wider uppercase bg-[#F2EDE4] text-[#1C1C1C]/70 hover:bg-[#2D423F] hover:text-white border border-[#1C1C1C]/5 p-1 px-2.5 rounded-sm transition-all duration-200 cursor-pointer"
            >
              Alternatives?
            </button>
            <button
              onClick={() => {
                setUserInput('Is Niacinamide safe for dry skin?');
              }}
              className="text-[9px] font-mono tracking-wider uppercase bg-[#F2EDE4] text-[#1C1C1C]/70 hover:bg-[#2D423F] hover:text-white border border-[#1C1C1C]/5 p-1 px-2.5 rounded-sm transition-all duration-200 cursor-pointer"
            >
              Dry Skin match?
            </button>
          </div>

          {/* Input box form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type standard questions..."
              className="flex-1 text-xs bg-[#F9F6F2] border border-[#1C1C1C]/10 px-3 py-2 outline-none focus:border-[#1C1C1C]/30 text-[#1C1C1C]"
            />
            <button
              type="submit"
              className="p-2 bg-[#1C1C1C] text-white hover:bg-[#2D423F] transition-colors flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">send</span>
            </button>
          </form>
        </div>
      )}

      {/* Mini consultations form modal overlay */}
      {showConsultForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white p-8 max-w-md w-full border border-[#1C1C1C]/10 shadow-2xl relative">
            <button
              onClick={() => setShowConsultForm(false)}
              className="absolute top-4 right-4 text-[#1C1C1C]/60 hover:text-red-500 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="font-serif text-xl font-light text-[#1C1C1C] mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#8B9474]">medical_services</span>
              Consultation Booking
            </h3>
            <p className="text-xs font-serif italic text-[#1C1C1C]/60 mb-6 leading-relaxed border-b border-[#1C1C1C]/5 pb-4">
              We bridge the wisdom of traditional remedies with cutting-edge dermatology. Speak to our verified panel.
            </p>

            {consultSubmitted ? (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-4xl text-[#8B9474] mb-2">check_circle</span>
                <p className="font-serif text-base font-light text-[#1C1C1C]">Consultation Registered!</p>
                <p className="text-xs text-[#1C1C1C]/60 italic mt-1">A senior dermatologist will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-[9px] font-mono tracking-widest text-[#1C1C1C]/50 font-bold mb-1 block">YOUR CONTACT DETAILS</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#F9F6F2] border border-[#1C1C1C]/10 p-2.5 outline-none focus:border-[#1C1C1C]/40 text-xs text-[#1C1C1C]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono tracking-widest text-[#1C1C1C]/50 font-bold mb-1 block">CURRENT SKIN STATUS</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Dryness, redness from acids, or blemish protection..."
                    className="w-full bg-[#F9F6F2] border border-[#1C1C1C]/10 p-2.5 outline-none focus:border-[#1C1C1C]/40 text-xs text-[#1C1C1C]"
                  />
                </div>
                <div className="pt-2 text-right">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1C1C1C] text-white hover:bg-[#2D423F] transition-all font-mono text-[10px] uppercase tracking-widest cursor-pointer"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
