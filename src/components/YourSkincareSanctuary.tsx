import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, UserProfile, SkinCondition, QuizState } from '../types';
import { PRODUCTS, CONDITIONS } from '../data';
import { getIngredientImpact } from './ProductInsights';
import Ladybug from './Ladybug';
import CrayonFlower from './CrayonFlower';

// Dynamic recipe combinations for the childcare/interactive mixing bowl
const TRADITIONAL_INGREDIENTS = [
  { id: 'saffron', name: 'Saffron (Kesar)', icon: 'brightness_5', color: '#D18A6A', desc: 'Prestige golden stamens for pristine cell warmth' },
  { id: 'turmeric', name: 'Turmeric (Haldi)', icon: 'grid_goldenratio', color: '#E5A93B', desc: 'Healing yellow root for gold ubtan purity' },
  { id: 'sandalwood', name: 'Sandalwood (Chandan)', icon: 'forest', color: '#8B9474', desc: 'Creamy fragrant timber that pacifies and cools' },
  { id: 'rosewater', name: 'Rose Water (Gulab Jal)', icon: 'water_drop', color: '#BD808A', desc: 'Slow steam-distilled hydrating floral dew' },
  { id: 'neem', name: 'Neem Leaves', icon: 'nature', color: '#4E6E58', desc: 'Sacred green leaves for deep clearing power' },
  { id: 'honey', name: 'Forest Honey (Madhu)', icon: 'hive', color: '#C97D54', desc: 'Ancient natural glaze that locks moist dews' },
];

const getRemedyRecipe = (ingredients: string[]) => {
  if (ingredients.length === 0) return null;
  const set = new Set(ingredients);
  if (set.has('saffron') && set.has('turmeric') && set.has('sandalwood')) {
    return {
      title: "The Royal Kanti Udvartana Paste",
      heritage: "Dating back to 11th century royal courts, this ubtan paste was custom compounded in stoneware mortar bowls to ignite a pristine inner lights glow.",
      benefits: "Promotes intense light radiance, regularizes complexion tone, and reduces dry seasonal scaling.",
      routine: "Combine with 3 spoonfuls of milk-cream. Gently circular-massage onto cheek contours, letting it calm for 12 minutes."
    };
  }
  if (set.has('neem') && set.has('sandalwood')) {
    return {
      title: "The Cool Amrita Purifying Mask",
      heritage: "Tradition recommends pacifying warm Pitta skin flares by grinding cold wood fibers of white sandalwood with cold-steeped neem mash.",
      benefits: "Deep cooling of active red stress, pore purification, and oil-gland balancing.",
      routine: "Mix equal parts. Paint onto active or warm cheeks. Cleanse with cold rainwater or spring water."
    };
  }
  if (set.has('rosewater') && set.has('saffron')) {
    return {
      title: "The Emperor's Pristine Glow Dew",
      heritage: "Dating back to the fragrance-factories of early Kannauj, this rose-soaked saffron extract mimics rare forest dawning dews.",
      benefits: "Nostalgic aroma sensory calming, immediate hydration bounce, and a plump golden hue.",
      routine: "Dab lightly with a organic cotton towel or spray lightly as a refreshing mist throughout hot hours."
    };
  }
  if (set.has('honey') && set.has('rosewater')) {
    return {
      title: "The Madhu-Pushpa Cushion Glaze",
      heritage: "Used by ancient courts to protect fragile facial barriers from dry wind drafts. Blends forest raw nectar with floral hydrosol.",
      benefits: "Deep water-retention sealing, velvety skin texturing, and reduction of micro-peeling.",
      routine: "Whisk together. Gloss over forehead and lips for 10 minutes. Cleanse using warm water wash."
    };
  }
  if (set.has('neem') && set.has('honey')) {
    return {
      title: "The Amrita Clarifying Nectar",
      heritage: "An historical forest mixture designed to cleanse active blemishes without stripping safe moisture envelopes.",
      benefits: "Microbe soothing, intense surface clearing, and moisture protection.",
      routine: "Dab directly on blemishes. Let sit overnight or rinse after 30 minutes with pure warm dews."
    };
  }
  if (set.has('saffron') && set.has('sandalwood')) {
    return {
      title: "The Imperial Chandan-Kesar Lepa",
      heritage: "A luxury paste reserved for festivals. Prepared by rubbing real sandalwood logs on flat granite stones with water and saffron stamens.",
      benefits: "Instant high-contrast brightness, skin cooling, and rich nostalgic scent.",
      routine: "Form a paste. Coat cheeks. Relax under quiet fan breeze, and wash off before the paste hardens fully."
    };
  }

  // Individual fallbacks
  if (set.has('turmeric')) {
    return {
      title: "The Sacred Golden Haridra Mash",
      heritage: "Sacred turmeric has served as India's premier wellness shield for thousands of years.",
      benefits: "Safe antiseptic shielding, brightening, and natural anti-redness care.",
      routine: "Blend with chickpea milk into a smooth paste. Keep on skin for 10 minutes."
    };
  }
  if (set.has('neem')) {
    return {
      title: "The Margosa Pure Leaf Wrap",
      heritage: "Villager households steep fresh neem leaves over slow wood fires to treat adolescent flares.",
      benefits: "Strong oil management, clarifying active blemishes, and pore tightening.",
      routine: "Apply to oily regions, leave as a clay wrap, and wash with pure running water."
    };
  }
  
  return {
    title: "Sanctuary Custom Apothecary Compound",
    heritage: "A custom natural compound generated directly within your Agnes Shelf, layering pure plant oils and ground essences.",
    benefits: "Combines the benefits of selected herbs into a nostalgic organic complex.",
    routine: "Mix thoroughly in your mortar. Apply to clean cheeks for 15 minutes."
  };
};

const NEWS_ITEMS = [
  {
    id: 'news-1',
    tag: 'HERITAGE NEWS',
    title: 'The Return of Kannauj Slow Copper Distillation',
    date: 'June 2026',
    summary: 'A group of traditional farmers in Uttar Pradesh are reviving "Deg Bhapka" slow clay-sealed copper vessels. Modern lab assays confirm slow fire preserve micro-nutrients that high-pressure steam completely strips away, invoking trust in age-old wisdom.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDH6mhLB8hklRek3QdFxc33QzKjMOqxDL9bPQ2pqpFLTSZkvXd7MuUeaEvJIKcnDfl0NogsxmufEq_L8i2xGhAJQUIhH4iESr3c5R1oCp2LwNRlQVb0jInAJEl0LuO6uoeC20I7iI5cWitowXcwZE0AN2kcBxwh01UZ0J-Xtk5qtyXp2a1MTdfm_r1gSwv3GEm3WNrrl2xdxDiIo8e7Th9z64NVQ-d2XeK6tUQIdODiPgjy8V5HYEGMq14sizkNR0XMDAR5rIvzv0'
  },
  {
    id: 'news-2',
    tag: 'CLINICAL CLINCH',
    title: 'New Study Correlates Saffron Carotenoids to UV Recovery',
    date: 'May 2026',
    summary: 'Dermatological studies publish double-blind evidence showing active Crocin compounds in Kashmiri Saffron help soothe light-induced skin fatigue and rebuild skin barrier lipid blocks naturally, providing a clinical seal of safety.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkNJy08aBHsj_Va7bLNYdBI6R_70b2UiTmcMtfol8cMgRSRpJoA34zCyKMmWHlW9bg9g5wegJe4O65IF1LPHbTW0v4YVShzMDo9gwH7Zi-_h1n2jasC1vg6roKUI3Li_l-xw5JO6kZ4AOrCBC9eYhATjReIZgK1CwcvyVld6bDVnjkSE3MLj6P1pxCDohqLOn62w8RGGPjd1ONMUqm_inwgWBb9e_CxKZ3vElZRdSqVhmF0lWSuwzHpAE7z6IAdVUy_6mX_MVwTNs'
  },
  {
    id: 'news-3',
    tag: 'CLIMATE RESPONSIVE',
    title: 'Project Agnes Releases Indian Monsoon Protection Indices',
    date: 'June 2026',
    summary: 'As local seasonal moisture indexes hit 85% range, dermatologists recommend shifting from heavy thick lipid creams toward breathable gels based on tea tree water, traditional mint distillate, and light botanical plant clays.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbiFdt9oMocV16R_H1NIs7FV_TJiN6RxM-qeFAzjhjr9vaHCpCp7Qg3XQGktx1L1VfRLiNDjugO1Pa8DY9DMuhWi034BDRlZ_TjKj4mSeB8ZL6JUdn7rbVsrk1Sy8acp7j1PXrbyf2xcl-VrUWJuiMSh1FZN9mvZsECWEeIMzFp266TMAu9X2rWB8fAbfNkFWN2cJn0PUvrqB8yq3clusTDn8-BzVjQPQlG92gykZl8jCY6UkdxcISkFFgapJM6PEVLotgOl6hPtw'
  }
];

interface YourSkincareSanctuaryProps {
  userProfile: UserProfile;
  quizState?: QuizState;
  onNavigateToQuiz: () => void;
  onNavigateToProduct: (productId?: string) => void;
  onNavigateToPersonalize: () => void;
  onNavigateToScan: () => void;
  onNavigateToRitual: () => void;
  onNavigateToDiagnostics: () => void;
  onReset: () => void;
}

export default function YourSkincareSanctuary({
  userProfile,
  quizState,
  onNavigateToQuiz,
  onNavigateToProduct,
  onNavigateToPersonalize,
  onNavigateToScan,
  onNavigateToRitual,
  onNavigateToDiagnostics,
  onReset,
}: YourSkincareSanctuaryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const databaseMode = 'products';
  const [showSideNav, setShowSideNav] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [homeClinicalFilter, setHomeClinicalFilter] = useState<string | null>(null);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(1000);

  // Auto-preload clinical filter based on latest user quiz results
  useEffect(() => {
    if (quizState) {
      if (quizState.lipFeel === 'Chapped' || quizState.lipFeel === 'Flaky') {
        setHomeClinicalFilter('lips');
      } else if (quizState.faceFeel === 'Oily') {
        setHomeClinicalFilter('acne');
      } else if (quizState.faceFeel === 'Sensitive' || quizState.sensitivityLevel >= 7) {
        setHomeClinicalFilter('rosacea');
      } else if (quizState.faceFeel === 'Dry') {
        setHomeClinicalFilter('eczema');
      } else {
        setHomeClinicalFilter('dehydration');
      }
    }
  }, [quizState]);

  // Slideshow State & Config
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 0,
      subtitle: "Volume I — The Pairings",
      titlePrefix: "The Magic of ",
      italicPart: "Vitamin C & Retinol",
      description: "Brighten by day, repair by night. Discover the perfect pairing for that Indian golden-hour glow without skin irritation.",
      buttonText: "Learn More",
      imageSrc: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Golden oranges reflecting sunshine morning rituals",
      action: () => onNavigateToProduct('marine-dew-serum'),
    },
    {
      id: 1,
      subtitle: "Volume II — Heritage Origins",
      titlePrefix: "Traditional Skincare ",
      italicPart: "& Ancient Heritage",
      description: "Journey back to courtly beauty where slow copper distillation and stone mortar bowls preserved active botanical nutrients.",
      buttonText: "Explore Origins",
      imageSrc: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Dry herbs, roses, and botanical resins in terracotta dishes",
      action: () => {
        const el = document.getElementById('traditional-apothecary');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 2,
      subtitle: "Volume III — Formulation Warning",
      titlePrefix: "Don't Mix Vitamin C ",
      italicPart: "& Retinol Together!",
      description: "Fun Fact: Using both at once can neutralize their benefits or trigger skin flares. Always use Vitamin C at dawn, Retinol at dusk.",
      buttonText: "Browse Formulations",
      imageSrc: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Elegant dropper bottle with sunlight shadows",
      action: () => {
        const el = document.getElementById('database-search');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 3,
      subtitle: "Volume IV — Seasonal Refresh",
      titlePrefix: "The Summer ",
      italicPart: "Recommended Collection",
      description: "Sun-drenched days demand breathable, weightless skin dews. Shield with deep marine-algae and pure tea tree hydrosols.",
      buttonText: "Check out Collection",
      imageSrc: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Clean droplets on green leaf highlighting hydration",
      action: () => {
        setSelectedCategoryFilter('Purifying Ritual');
        const el = document.getElementById('database-search');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  // Auto-play interval for the user's beautiful slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Traditional mortar state variables
  const [alchemyIngredients, setAlchemyIngredients] = useState<string[]>([]);
  const [isGrinding, setIsGrinding] = useState(false);
  const [alchemyResult, setAlchemyResult] = useState<ReturnType<typeof getRemedyRecipe>>(null);

  // Daily Skincare Ritual completion status
  const [dailyRituals, setDailyRituals] = useState(() => {
    const saved = localStorage.getItem('project_agnes_daily_rituals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: 'cleanse', name: 'Mornings: Pure Dew Wash', time: '08:00 AM', completed: false, description: 'Lifts night lipids with cold clay-distilled water.' },
      { id: 'rosewater', name: 'Midnoon: Sacred Rose Water Mist', time: '12:30 PM', completed: false, description: 'Cools warm Pitta flares and resets glowing dews.' },
      { id: 'saffron', name: 'Twilight: Saffron Peptide Elixir', time: '04:00 PM', completed: false, description: 'Delivers active Crocin antioxidants for golden-hour glow.' },
      { id: 'sandalwood', name: 'Night: Cooled Chandan Cream', time: '09:30 PM', completed: false, description: 'Nourishes dry skin barriers and calms sensory nerves.' },
    ];
  });

  const toggleRitual = (id: string) => {
    const updated = dailyRituals.map((r: any) => 
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    setDailyRituals(updated);
    localStorage.setItem('project_agnes_daily_rituals', JSON.stringify(updated));
  };

  // Map fallback prices cleanly to older PRODUCTS missing explicit database keys
  const productsWithPrices = PRODUCTS.map((p) => {
    if (p.price) return p;
    let price = 450;
    if (p.id === 'prod_minimalist_b5') price = 450;
    else if (p.id === 'prod_dermaco_aqua') price = 499;
    else if (p.id === 'prod_dotkey_barrier') price = 595;
    else if (p.id === 'prod_sebamed_clear') price = 580;
    else if (p.id === 'prod_requil_ultra') price = 780;
    else if (p.id === 'prod_neutrogena_hydro') price = 950;
    return { ...p, price };
  });

  // Filter products based on search, category select, or price boundaries
  const filteredProducts = productsWithPrices.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.ingredients.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter ? product.category === selectedCategoryFilter : true;
    const matchesPrice = product.price ? product.price <= maxPriceFilter : true;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Filter skin conditions based on search
  const filteredConditions = CONDITIONS.filter((cond) => {
    const q = searchQuery.toLowerCase();
    return (
      cond.name.toLowerCase().includes(q) ||
      cond.category.toLowerCase().includes(q) ||
      cond.symptoms.toLowerCase().includes(q) ||
      cond.clinicalOverview.toLowerCase().includes(q) ||
      cond.compatibleIngredients.some(i => i.toLowerCase().includes(q)) ||
      cond.forbiddenIngredients.some(i => i.toLowerCase().includes(q))
    );
  });

  const handleAlchemyToggle = (id: string) => {
    if (alchemyIngredients.includes(id)) {
      setAlchemyIngredients(alchemyIngredients.filter((x) => x !== id));
    } else {
      if (alchemyIngredients.length >= 3) {
        // limit 3 ingredients for safety
        alert("Your copper mortar bowl is full! Grind these ingredients or tap one to remove it.");
        return;
      }
      setAlchemyIngredients([...alchemyIngredients, id]);
    }
    setAlchemyResult(null);
  };

  const handleAlchemyGrind = () => {
    if (alchemyIngredients.length === 0) {
      alert("Please select at least one botanical to grind inside the ceramic mortar.");
      return;
    }
    setIsGrinding(true);
    setTimeout(() => {
      const result = getRemedyRecipe(alchemyIngredients);
      setAlchemyResult(result);
      setIsGrinding(false);
    }, 1800);
  };

  const handleAlchemyClear = () => {
    setAlchemyIngredients([]);
    setAlchemyResult(null);
  };


  return (
    <div className="relative min-h-screen bg-[#F9F6F2] font-sans pb-24 overflow-x-hidden text-[#1C1C1C]">
      {/* Top Application Bar */}
      <header className="flex items-baseline justify-between px-12 pt-10 pb-6 w-full fixed top-0 z-50 bg-[#F9F6F2]/90 backdrop-blur-md border-b border-[#1C1C1C]/10">
        <div className="flex items-center space-x-12">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSideNav(!showSideNav)}
              className="p-1 hover:opacity-100 opacity-60 transition-opacity text-[#1C1C1C] cursor-pointer"
              title="Menu"
            >
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
            <h1 className="text-3xl font-serif italic tracking-tight font-light text-[#1C1C1C]">Agnes.</h1>
          </div>
          <nav className="hidden lg:flex space-x-8 text-[11px] uppercase tracking-[0.2em] font-medium opacity-60">
            <a href="#" className="border-b border-[#1C1C1C] pb-1">Sanctuary</a>
            <button
              onClick={onNavigateToScan}
              className="hover:text-[#8B9474] cursor-pointer transition-colors pb-1 text-[#8B9474] font-bold"
            >
              AI Ingredient Scan
            </button>
            <span className="cursor-default">The Library</span>
            <button
              onClick={onNavigateToRitual}
              className="hover:text-[#8B9474] cursor-pointer transition-colors pb-1"
            >
              Ritual Alignment
            </button>
          </nav>
        </div>

        {/* Search Bar in center */}
        <div className="flex-1 max-w-md px-8 hidden md:block">
          <div className="relative group">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-[#1C1C1C]/20 py-2 pl-8 pr-8 focus:border-[#1C1C1C]/60 focus:outline-none transition-all font-sans text-xs tracking-wide text-[#1C1C1C]"
              placeholder="Search skincare miracles..."
              type="text"
            />
            <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 text-lg">search</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 hover:text-[#1C1C1C]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Avatar Trigger Button */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={onNavigateToPersonalize}
            className="hidden sm:inline-block text-[11px] uppercase tracking-[0.2em] font-medium opacity-60 hover:opacity-100 transition-opacity"
          >
            Personalize
          </button>
          <button
            onClick={onNavigateToPersonalize}
            className="w-10 h-10 rounded-full overflow-hidden border border-[#1C1C1C]/10 flex items-center justify-center bg-white shadow-sm hover:ring-2 ring-[#8B9474] transition-all cursor-pointer"
          >
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkNJy08aBHsj_Va7bLNYdBI6R_70b2UiTmcMtfol8cMgRSRpJoA34zCyKMmWHlW9bg9g5wegJe4O65IF1LPHbTW0v4YVShzMDo9gwH7Zi-_h1n2jasC1vg6roKUI3Li_l-xw5JO6kZ4AOrCBC9eYhATjReIZgK1CwcvyVld6bDVnjkSE3MLj6P1pxCDohqLOn62w8RGGPjd1ONMUqm_inwgWBb9e_CxKZ3vElZRdSqVhmF0lSuwzHpAE7z6IAdVUy_6mX_MVwTNs"
            />
          </button>
        </div>
      </header>

      {/* Side Navigation overlay drawer */}
      {showSideNav && (
        <div
          onClick={() => setShowSideNav(false)}
          className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 transition-opacity duration-300"
        />
      )}

      {/* Active Sidebar */}
      <nav
        className={`fixed left-0 top-0 h-full w-72 z-50 bg-[#F9F6F2] border-r border-[#1C1C1C]/10 shadow-xl flex flex-col p-8 transform transition-transform duration-300 ${
          showSideNav ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-10">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-serif italic text-3xl font-light text-[#1C1C1C]">Agnes.</h2>
            <button
              onClick={() => setShowSideNav(false)}
              className="p-1 text-[#1C1C1C]/60 hover:text-[#2D423F] transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Your Skincare Sanctuary</p>
        </div>

        <div className="space-y-4 flex-grow">
          <button
            onClick={() => {
              setShowSideNav(false);
              onNavigateToPersonalize();
            }}
            className="w-full flex items-center gap-4 text-left p-3 hover:bg-[#EBE5DA]/40 text-[#1C1C1C] rounded-md transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[#8B9474]">person_edit</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1C1C]">Edit Profile</span>
          </button>

          <button
            onClick={() => {
              setShowSideNav(false);
              onNavigateToQuiz();
            }}
            className="w-full flex items-center gap-4 text-left p-3 hover:bg-[#EBE5DA]/40 text-[#1C1C1C] rounded-md transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[#8B9474]">auto_awesome</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1C1C]">Skin Type Quiz</span>
          </button>

          <button
            onClick={() => {
              setShowSideNav(false);
              onNavigateToScan();
            }}
            className="w-full flex items-center gap-4 text-left p-3 bg-[#8B9474]/10 text-[#8B9474] hover:bg-[#8B9474]/20 rounded-md transition-all duration-200 border border-[#8B9474]/20"
          >
            <span className="material-symbols-outlined text-[#8B9474]">photo_camera</span>
            <span className="text-xs uppercase tracking-wider font-bold text-[#1C1C1C]">Ingredient Scanner</span>
          </button>

          <button
            onClick={() => {
              setShowSideNav(false);
              onNavigateToRitual();
            }}
            className="w-full flex items-center gap-4 text-left p-3 hover:bg-[#EBE5DA]/40 text-[#1C1C1C] rounded-md transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[#8B9474]">calendar_today</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1C1C]">Ritual Alignment</span>
          </button>

          <button
            onClick={() => {
              setShowSideNav(false);
              onNavigateToProduct();
            }}
            className="w-full flex items-center gap-4 text-left p-3 hover:bg-[#EBE5DA]/40 text-[#1C1C1C] rounded-md transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[#8B9474]">visibility</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1C1C]">Product Insights</span>
          </button>

          <button
            onClick={() => {
              setShowSideNav(false);
              onNavigateToDiagnostics();
            }}
            className="w-full flex items-center gap-4 text-left p-3 hover:bg-[#EBE5DA]/40 text-[#1C1C1C] rounded-md transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[#8B9474]">medical_services</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1C1C]">Clinical Diagnostics</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset your sanctuary progress?')) {
                onReset();
                setShowSideNav(false);
              }
            }}
            className="w-full flex items-center gap-4 text-left p-3 hover:bg-error/10 text-error rounded-md transition-all duration-200 mt-20"
          >
            <span className="material-symbols-outlined text-error">logout</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-error">Log Out</span>
          </button>
        </div>

        {/* Zen User Profile Badge section */}
        <div className="mt-auto pt-6 border-t border-[#1C1C1C]/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white overflow-hidden border border-[#1C1C1C]/10">
            <img
              alt="User Profile Avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkNJy08aBHsj_Va7bLNYdBI6R_70b2UiTmcMtfol8cMgRSRpJoA34zCyKMmWHlW9bg9g5wegJe4O65IF1LPHbTW0v4YVShzMDo9gwH7Zi-_h1n2jasC1vg6roKUI3Li_l-xw5JO6kZ4AOrCBC9eYhATjReIZgK1CwcvyVld6bDVnjkSE3MLj6P1pxCDohqLOn62w8RGGPjd1ONMUqm_inwgWBb9e_CxKZ3vElZRdSqVhmF0lWSuzpHpAE7z6IAdVUy_6mX_MVwTNs"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-[#1C1C1C] leading-none">{userProfile.name}</p>
            <p className="text-[10px] text-secondary uppercase tracking-wider font-semibold mt-1">
              {userProfile.experienceLevel} • {userProfile.gender}
            </p>
          </div>
        </div>
      </nav>

      {/* Main Sanctuary Dashboard View */}
      <main className="max-w-7xl mx-auto pt-36 px-12 space-y-16 relative">
        
        {/* Cute scattered nature imagery: styled as beautiful tactile stickers */}
        <div className="absolute top-20 left-10 bg-white border-[3px] border-white rounded-2xl p-2.5 shadow-[0_5px_12px_rgba(28,28,28,0.14)] pointer-events-none select-none animate-bounce z-10 flex items-center justify-center transform rotate-12" style={{ animationDuration: '6s' }}>
          <span className="material-symbols-outlined text-3xl text-[#8B9474]">spa</span>
        </div>
        <div className="absolute top-48 right-16 bg-white border-[3px] border-white rounded-2xl p-2.5 shadow-[0_5px_12px_rgba(28,28,28,0.14)] pointer-events-none select-none z-10 flex items-center justify-center transform -rotate-12">
          <span className="material-symbols-outlined text-4xl text-[#D18A6A]">eco</span>
        </div>
        <div className="absolute bottom-1/4 left-1/4 bg-white border-[3px] border-white rounded-2xl p-2.5 shadow-[0_5px_12px_rgba(28,28,28,0.14)] pointer-events-none select-none animate-pulse z-10 flex items-center justify-center transform rotate-6">
          <span className="material-symbols-outlined text-2xl text-[#8B9474]">nature</span>
        </div>
        <div className="absolute top-[60%] right-10 bg-white border-[3px] border-white rounded-2xl p-2.5 shadow-[0_5px_12px_rgba(28,28,28,0.14)] pointer-events-none select-none z-10 flex items-center justify-center transform rotate-45">
          <span className="material-symbols-outlined text-4xl text-[#4E6E58]">spa</span>
        </div>

        {/* Crayon Chamomile Spinning Flower floating in the upper corner */}
        <div className="absolute -top-12 right-12 z-40 bg-white/70 backdrop-blur-sm p-4 rounded-3xl border border-[#1C1C1C]/10 shadow-[0_15px_30px_rgba(139,148,116,0.1)] hover:scale-105 transition-all duration-300 flex flex-col items-center">
          <CrayonFlower size={64} />
          <span className="text-[8px] font-mono tracking-widest text-[#D18A6A] mt-1 uppercase opacity-75">Spin Me!</span>
        </div>

        {/* Ladybug micro-animations */}
        <Ladybug className="top-1/3 left-10 scale-100" initialRotation={45} />
        <Ladybug className="bottom-[15%] right-20 scale-105" initialRotation={315} />
        <Ladybug className="top-6 right-1/3 scale-90" initialRotation={160} />
        <Ladybug className="bottom-[40%] left-6 scale-110" initialRotation={240} />

        {/* Hero Slideshow Block - Warmer and more rounded! */}
        <section className="relative border border-[#1C1C1C]/15 bg-white shadow-xl overflow-hidden min-h-[460px] md:min-h-[440px] rounded-3xl transition-transform hover:shadow-2xl duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch h-full">
            {/* Slide Content Column: Explicitly separated to prevent overlaps */}
            <div className="flex flex-col justify-center p-8 md:p-12 bg-white space-y-6 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-6 flex flex-col justify-between h-full"
                >
                  <div className="space-y-4">
                    <span className="text-[12.5px] uppercase tracking-[0.3em] font-bold text-[#8B9474] block">
                      {slides[currentSlide].subtitle}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif font-light leading-[1.15] text-[#1C1C1C] tracking-tight">
                      {slides[currentSlide].titlePrefix}
                      <br />
                      <span className="italic">{slides[currentSlide].italicPart}</span>
                    </h2>
                    <p className="text-sm md:text-base font-serif italic text-[#1C1C1C]/70 leading-relaxed max-w-sm">
                      {slides[currentSlide].description}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button
                      onClick={slides[currentSlide].action}
                      className="px-8 py-3.5 bg-[#1C1C1C] text-white text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#2D423F] transition-all cursor-pointer shadow-sm hover:shadow-md rounded-2xl"
                    >
                      {slides[currentSlide].buttonText}
                    </button>
                    
                    {/* Small visual dots for responsive slide navigation inside the text block */}
                    <div className="flex items-center gap-1.5 md:hidden">
                      {slides.map((_, idx) => (
                        <button
                          key={idx}
                          aria-label={`Go to slide ${idx + 1}`}
                          onClick={() => setCurrentSlide(idx)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            currentSlide === idx ? 'bg-[#1C1C1C] w-4' : 'bg-[#1C1C1C]/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide Image Column: Clean, isolated panel to completely prevent overlaps */}
            <div className="h-[280px] md:h-full relative overflow-hidden bg-[#F2EDE4] border-t md:border-t-0 md:border-l border-[#1C1C1C]/5">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="h-full w-full object-cover select-none absolute inset-0"
                  alt={slides[currentSlide].imageAlt}
                  src={slides[currentSlide].imageSrc}
                />
              </AnimatePresence>

              {/* Arrow navigation handles for the slider - elegant & stylish minimal pill */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-2 rounded-full border border-[#1C1C1C]/10 shadow-sm z-20">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                  className="p-1 hover:text-[#8B9474] transition-colors cursor-pointer text-[#1C1C1C] flex items-center"
                  title="Previous slide"
                >
                  <span className="material-symbols-outlined text-lg leading-none block">arrow_back</span>
                </button>
                <span className="text-[10px] font-mono font-bold text-[#1C1C1C]/60 px-1">
                  {currentSlide + 1} / {slides.length}
                </span>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  className="p-1 hover:text-[#8B9474] transition-colors cursor-pointer text-[#1C1C1C] flex items-center"
                  title="Next slide"
                >
                  <span className="material-symbols-outlined text-lg leading-none block">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Subtle progressive slide indicator at the very bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1C1C1C]/5">
            <motion.div
              className="h-full bg-[#8B9474]"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </section>

        {/* NEW Elegant AI Ingredient Safety Scanner Promo Banner */}
        <section className="bg-gradient-to-br from-[#8B9474]/15 to-[#8B9474]/5 border border-[#8B9474]/25 p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#8B9474]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-4 max-w-xl text-left">
            <span className="text-[10px] uppercase tracking-widest font-mono font-bold bg-[#8B9474] text-white px-3 py-1 rounded-md">
              Gemini-3.5-Flash Powered
            </span>
            <div className="space-y-1.5">
              <h2 className="text-2xl md:text-3xl font-serif font-light text-[#1C1C1C]">
                Scan Product Labels Authentically
              </h2>
              <p className="text-xs md:text-sm text-[#1C1C1C]/70 font-serif italic leading-relaxed">
                Aim your device camera or upload a skincare label image. Read actual chemical compounds, flag barrier potential irritants instantly, and calculate direct compatibility scores for individual skin profiles.
              </p>
            </div>
            {/* Quick trust metrics */}
            <div className="flex flex-wrap gap-4 text-[10px] font-mono uppercase tracking-wider text-gray-500 pt-1">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B9474]" /> Active Optical OCR
              </span>
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B9474]" /> INCI Safety Decoders
              </span>
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B9474]" /> Zero Exposed Keys
              </span>
            </div>
          </div>

          <button
            onClick={onNavigateToScan}
            className="w-full md:w-auto px-8 py-4 bg-[#1C1C1C] hover:bg-[#8B9474] text-white font-mono text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer shrink-0 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">photo_camera</span>
            Launch Safety Scan
          </button>
        </section>

        {/* Daily Skincare Ritual Tracker Section - Rounded and warmer */}
        <section className="bg-white p-8 md:p-12 border border-[#1C1C1C]/10 rounded-3xl shadow-[0_22px_50px_rgba(28,28,28,0.03)] relative overflow-hidden">
          <div className="absolute top-4 right-4 text-[10px] uppercase font-mono bg-[#8B9474]/15 px-3 py-1 text-[#8B9474] font-bold tracking-widest rounded-full">
            Therapeutic Progress
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Checklist Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.25em] font-mono text-[#8B9474] font-bold block">
                  Mindful Skin Presence
                </span>
                <h2 className="text-3xl font-serif font-light text-[#1C1C1C]">
                  Your Daily Ritual Alignment
                </h2>
                <p className="text-xs md:text-sm text-[#1C1C1C]/70 font-serif italic leading-relaxed">
                   Skincare is not a chore—it is an act of honoring your vessel. Tap each botanical step below to mark your therapeutic progress as the day flows by, and watch your ritual ring expand with water and light.
                </p>
                <div className="pt-1.5">
                  <button
                    onClick={onNavigateToRitual}
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[#8B9474] hover:text-[#1C1C1C] transition-colors cursor-pointer group"
                  >
                    <span>Open Weekly Ritual Editor</span>
                    <span className="material-symbols-outlined text-xs group-hover:translate-x-1.5 transition-transform duration-300">calendar_today</span>
                  </button>
                </div>
              </div>

              {/* Ritual Checklist Cards */}
              <div className="space-y-3.5">
                {dailyRituals.map((r: any) => (
                  <button
                    key={r.id}
                    onClick={() => toggleRitual(r.id)}
                    className="w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 bg-[#F9F6F2] hover:bg-[#EBE5DA]/20 border-[#1C1C1C]/5 hover:border-[#8B9474]/40 cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={r.completed}
                        onChange={() => {}} // Click handled by parent button to allow easy hit area
                        className="sr-only"
                      />
                      {/* Custom styled nostalgic checkmark circle */}
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        r.completed 
                          ? 'bg-[#8B9474] border-[#8B9474] text-white scale-110 shadow-sm' 
                          : 'border-[#1C1C1C]/20 bg-white group-hover:border-[#8B9474]'
                      }`}>
                        {r.completed && (
                          <span className="material-symbols-outlined text-xs font-bold">check</span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <h4 className={`text-xs font-serif font-bold transition-colors ${r.completed ? 'text-[#1C1C1C]/50 line-through' : 'text-[#1C1C1C]'}`}>
                          {r.name}
                        </h4>
                        <span className="text-[9px] font-mono tracking-wider bg-white px-2 py-0.5 border border-[#1C1C1C]/5 text-[#1C1C1C]/60 rounded-full">
                          {r.time}
                        </span>
                      </div>
                      <p className={`text-[11px] font-serif italic mt-1 leading-normal transition-colors ${r.completed ? 'text-[#1C1C1C]/35' : 'text-[#1C1C1C]/60'}`}>
                        {r.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Circular Progress Ring Column */}
            <div className="lg:col-span-5 bg-[#F9F6F2] p-8 border border-[#1C1C1C]/10 flex flex-col justify-center items-center rounded-3xl relative min-h-[320px] select-none text-center">
              {/* Soft decorative background circles and pulse aura */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,148,116,0.06)_0,transparent_65%)] pointer-events-none" />

              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Embedded dynamic text in the center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <span className="material-symbols-outlined text-[#8B9474] text-xl animate-pulse mb-1">
                    {Math.round((dailyRituals.filter((r: any) => r.completed).length / dailyRituals.length) * 100) === 100 ? 'spa' : Math.round((dailyRituals.filter((r: any) => r.completed).length / dailyRituals.length) * 100) >= 50 ? 'filter_vintage' : 'water_drop'}
                  </span>
                  <div className="text-3xl md:text-4xl font-serif font-light text-[#1C1C1C] flex items-baseline select-none">
                    <span>{Math.round((dailyRituals.filter((r: any) => r.completed).length / dailyRituals.length) * 100)}</span>
                    <span className="text-sm font-sans font-normal opacity-50 ml-0.5">%</span>
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-[#1C1C1C]/60 uppercase mt-0.5">
                    {dailyRituals.filter((r: any) => r.completed).length} of {dailyRituals.length} Pure Stages
                  </span>
                </div>

                {/* SVG Circle Drawing block */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  {/* Outer shadow aura indicator */}
                  <circle
                    cx="80"
                    cy="80"
                    r="64"
                    fill="transparent"
                    stroke="#1C1C1C"
                    strokeWidth="1.5"
                    className="opacity-[0.03]"
                  />
                  {/* Background Track circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r="64"
                    fill="transparent"
                    stroke="#EBE5DA"
                    strokeWidth="6"
                  />
                  {/* Dynamic Fill circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r="64"
                    fill="transparent"
                    stroke="#8B9474"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 64}
                    strokeDashoffset={2 * Math.PI * 64 - (Math.round((dailyRituals.filter((r: any) => r.completed).length / dailyRituals.length) * 100) / 100) * (2 * Math.PI * 64)}
                    strokeLinecap="round"
                    className="transition-all duration-[1200ms]"
                  />
                </svg>
              </div>

              {/* Dynamic message layout below the circle */}
              <div className="mt-5 space-y-1 relative z-10 max-w-[220px]">
                <h5 className="font-serif text-sm font-semibold tracking-tight text-[#1C1C1C] min-h-[20px]">
                  {Math.round((dailyRituals.filter((r: any) => r.completed).length / dailyRituals.length) * 100) === 0 && "Honor the Dawn"}
                  {Math.round((dailyRituals.filter((r: any) => r.completed).length / dailyRituals.length) * 100) > 0 && Math.round((dailyRituals.filter((r: any) => r.completed).length / dailyRituals.length) * 100) < 50 && "Beginning the Glow"}
                  {Math.round((dailyRituals.filter((r: any) => r.completed).length / dailyRituals.length) * 100) >= 50 && Math.round((dailyRituals.filter((r: any) => r.completed).length / dailyRituals.length) * 100) < 100 && "Radiance Unfolding"}
                  {Math.round((dailyRituals.filter((r: any) => r.completed).length / dailyRituals.length) * 100) === 100 && "Divine Sanctuary Restored"}
                </h5>
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#D18A6A] font-bold">
                  {Math.round((dailyRituals.filter((r: any) => r.completed).length / dailyRituals.length) * 100) === 0 && "Tap steps above to initiate"}
                  {Math.round((dailyRituals.filter((r: any) => r.completed).length / dailyRituals.length) * 100) > 0 && Math.round((dailyRituals.filter((r: any) => r.completed).length / dailyRituals.length) * 100) < 50 && "First cell layers hydrated"}
                  {Math.round((dailyRituals.filter((r: any) => r.completed).length / dailyRituals.length) * 100) >= 50 && Math.round((dailyRituals.filter((r: any) => r.completed).length / dailyRituals.length) * 100) < 100 && "Pitta heat safely pacified"}
                  {Math.round((dailyRituals.filter((r: any) => r.completed).length / dailyRituals.length) * 100) === 100 && "Completeness achieved"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Block */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Skin Type Quiz */}
          <div
            onClick={onNavigateToQuiz}
            className="cursor-pointer bg-white p-8 border border-[#1C1C1C]/10 rounded-3xl shadow-[0_22px_45px_rgba(28,28,28,0.03)] hover:shadow-xl transition-all duration-300 group flex flex-col justify-between h-64"
          >
            <div>
              <div className="flex justify-between items-start mb-8">
                <span className="text-[10px] font-mono tracking-widest opacity-40">01 / QUIZ</span>
                <div className="w-8 h-8 rounded-full border border-[#1C1C1C]/20 flex items-center justify-center group-hover:bg-[#1C1C1C] group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </div>
              </div>
              <h3 className="text-2xl font-serif font-light mb-2 text-[#1C1C1C]">Skin Type Quiz</h3>
              <p className="text-xs text-[#1C1C1C]/60 leading-relaxed italic">
                Uncover the hidden patterns of your complexion with our dual-ritual analysis.
              </p>
            </div>
            <div className="w-full h-1 bg-[#F9F6F2] relative overflow-hidden rounded-full">
              <div className="absolute left-0 top-0 h-full w-1/3 bg-[#8B9474]"></div>
            </div>
          </div>

          {/* Card 2: Product Database */}
          <div
            onClick={() => {
              const el = document.getElementById('database-search');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="cursor-pointer bg-white p-8 border border-[#1C1C1C]/10 rounded-3xl shadow-[0_22px_45px_rgba(28,28,28,0.03)] hover:shadow-xl transition-all duration-300 group flex flex-col justify-between h-64"
          >
            <div>
              <div className="flex justify-between items-start mb-8">
                <span className="text-[10px] font-mono tracking-widest opacity-40">02 / REGISTRY</span>
                <div className="w-8 h-8 rounded-full border border-[#1C1C1C]/20 flex items-center justify-center group-hover:bg-[#1C1C1C] group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-sm">search</span>
                </div>
              </div>
              <h3 className="text-2xl font-serif font-light mb-2 text-[#1C1C1C]">Product Database</h3>
              <p className="text-xs text-[#1C1C1C]/60 leading-relaxed italic">
                Search 50,000+ formulations. Filter by active molecules or ancient botanicals.
              </p>
            </div>
            <div className="w-full h-1 bg-[#F9F6F2] relative overflow-hidden rounded-full">
              <div className="absolute left-0 top-0 h-full w-2/3 bg-[#8B9474]"></div>
            </div>
          </div>

          {/* Card 3: Interactive Insights */}
          <div
            onClick={onNavigateToDiagnostics}
            className="cursor-pointer bg-[#2D423F] p-8 text-[#F9F6F2] rounded-3xl relative flex flex-col justify-between h-64 shadow-[0_22px_45px_rgba(28,28,28,0.03)] hover:shadow-xl transition-all duration-300 group"
          >
            <div>
              <div className="flex justify-between items-start mb-8">
                <span className="text-[10px] font-mono tracking-widest opacity-60">03 / CLINICAL</span>
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-[#2D423F] transition-all">
                  <span className="material-symbols-outlined text-sm">science</span>
                </div>
              </div>
              <h3 className="text-2xl font-serif font-light mb-2 text-[#F9F6F2]">Clinical Insights</h3>
              <p className="text-xs text-[#F9F6F2]/70 leading-relaxed italic">
                Study clean formulas, purity profiles, and expert dermatologist evaluations.
              </p>
            </div>
            <div className="w-full h-1 bg-[#F9F6F2]/10 relative overflow-hidden rounded-full">
              <div className="absolute left-0 top-0 h-full w-5/6 bg-[#D18A6A]"></div>
            </div>
          </div>
        </section>

        {/* Alchemist Apothecary Compounding Mortar section (Traditional & Interactive Kidlike designs) */}
        <section id="traditional-apothecary" className="bg-white p-8 md:p-12 border border-[#1C1C1C]/10 rounded-3xl shadow-[0_22px_50px_rgba(28,28,28,0.03)] relative overflow-hidden scroll-mt-28">
          <div className="absolute top-4 right-4 text-[10px] uppercase font-mono bg-[#8B9474]/15 px-3 py-1 text-[#8B9474] font-bold tracking-widest rounded-full">
            Active Alchemist
          </div>
          
          <div className="max-w-2xl text-left space-y-2 mb-10">
            <span className="text-[11px] uppercase tracking-[0.25em] font-mono opacity-50 block">Childlike Tactile Curiosity</span>
            <h2 className="text-3xl font-serif font-light text-[#1C1C1C]">Classical Apothecary Mortar</h2>
            <p className="text-xs md:text-sm text-[#1C1C1C]/70 font-serif italic leading-relaxed">
              Before modern skin science, households hand-ground organic botanicals in massive mortar stones. Tap up to 3 ancient ingredients below to stack inside your ceramic crucible, and press "Grind & Infuse" to discover a certified nostalgic recipe.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Ingredients Shelf */}
            <div className="lg:col-span-7 space-y-6">
              <h4 className="text-xs tracking-widest uppercase opacity-45 font-mono">The Natural Herbaceous Shelf</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {TRADITIONAL_INGREDIENTS.map((ing) => {
                  const isSelected = alchemyIngredients.includes(ing.id);
                  return (
                    <button
                      key={ing.id}
                      onClick={() => handleAlchemyToggle(ing.id)}
                      className={`flex flex-col text-left p-4 border transition-all duration-300 relative group cursor-pointer h-28 justify-between rounded-2xl ${
                        isSelected
                          ? 'bg-[#1C1C1C] border-[#1C1C1C] text-white'
                          : 'bg-[#F9F6F2] border-[#1C1C1C]/10 text-[#1C1C1C] hover:border-[#8B9474] hover:bg-[#EBE5DA]/20'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span 
                          className="material-symbols-outlined text-lg" 
                          style={{ color: isSelected ? '#FFFFFF' : ing.color }}
                        >
                          {ing.icon}
                        </span>
                        {isSelected && (
                          <span className="material-symbols-outlined text-xs bg-white text-[#1C1C1C] rounded-full p-0.5">check</span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-serif font-bold leading-none mb-1">{ing.name}</p>
                        <p className={`text-[9px] line-clamp-2 leading-tight ${isSelected ? 'text-white/70' : 'text-[#1C1C1C]/50'}`}>
                          {ing.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={handleAlchemyGrind}
                  disabled={isGrinding}
                  className="px-6 py-3 bg-[#2D423F] font-semibold text-white tracking-[0.15em] text-[10px] uppercase hover:bg-[#1C1C1C] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 rounded-2xl"
                >
                  {isGrinding ? 'Grinding Herbs...' : 'Grind & Infuse'}
                </button>
                {alchemyIngredients.length > 0 && (
                  <button
                    onClick={handleAlchemyClear}
                    className="text-[10px] uppercase font-mono tracking-wider opacity-60 hover:opacity-100 underline decoration-dotted decoration-[#1C1C1C] cursor-pointer"
                  >
                    Empty Crucible
                  </button>
                )}
              </div>
            </div>

            {/* Mortar & Resulting Plate */}
            <div className="lg:col-span-5 bg-[#F9F6F2] p-6 border border-[#1C1C1C]/10 flex flex-col justify-center items-center relative overflow-hidden min-h-[300px] rounded-3xl">
              {/* Mortar Animation Graphic */}
              <div className="relative w-40 h-40 flex items-center justify-center mb-4 select-none">
                {/* Mortar bowl background */}
                <div className={`w-32 h-32 rounded-full border-4 border-[#2D423F] bg-[#EBE5DA] flex items-center justify-center relative shadow-inner ${isGrinding ? 'animate-shake' : ''}`}>
                  {/* Selected herbs floating inside bowl */}
                  <div className="absolute inset-0 flex flex-wrap gap-1 p-6 justify-center items-center">
                    {alchemyIngredients.map((x) => {
                      const details = TRADITIONAL_INGREDIENTS.find(i => i.id === x);
                      if (!details) return null;
                      return (
                        <span 
                          key={x} 
                          title={details.name}
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] animate-bounce"
                          style={{ backgroundColor: details.color, opacity: 0.8 }}
                        />
                      );
                    })}
                  </div>
                  
                  {/* Mortar inner center circle */}
                  <div className="w-16 h-16 rounded-full border border-dashed border-[#1C1C1C]/10 bg-white/40 flex items-center justify-center text-[#1C1C1C]/30 text-[9px] uppercase font-mono">
                    Bowl
                  </div>
                </div>

                {/* Pestle Stick */}
                <div 
                  className="absolute w-6 h-28 bg-[#8B9474] border border-[#2D423F] rounded-full origin-bottom" 
                  style={{ 
                    top: '10px', 
                    transform: isGrinding ? 'rotate(30deg) translateY(-8px)' : 'rotate(15deg)',
                    animation: isGrinding ? 'grind-stick 0.4s infinite alternate ease-in-out' : 'none',
                    transition: 'all 0.3s'
                  }} 
                />
              </div>

              {/* Alchemy Results Display Card */}
              {isGrinding && (
                <div className="text-center space-y-2 animate-pulse mt-3">
                  <p className="text-xs uppercase font-mono tracking-widest font-bold text-[#8B9474]">Crushing Cells...</p>
                  <p className="text-[10px] opacity-60 font-serif italic">"Hand-milling raw extracts into royal pastes"</p>
                </div>
              )}

              {!isGrinding && !alchemyResult && (
                <div className="text-center space-y-2 max-w-xs">
                  <span className="material-symbols-outlined text-3xl opacity-30 text-[#1C1C1C]">rice_bowl</span>
                  <p className="text-xs font-serif italic text-[#1C1C1C]/60">
                    "Tap ingredients on the left cupboard. Then grind them inside this traditional crucible."
                  </p>
                </div>
              )}

              {!isGrinding && alchemyResult && (
                <div className="w-full bg-[#FCFAF8] p-5 border border-[#D18A6A]/20 shadow-md space-y-3 relative animate-fadeIn rounded-2xl">
                  <div className="text-center border-b border-[#1C1C1C]/5 pb-2">
                    <span className="text-[8px] font-mono tracking-widest text-[#D18A6A] font-bold uppercase">Heritage Formula</span>
                    <h5 className="font-serif text-lg font-light text-[#1C1C1C]">{alchemyResult.title}</h5>
                  </div>
                  
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className="text-[9px] font-mono font-bold tracking-wider uppercase opacity-40 block">Ancient Heritage</span>
                      <p className="text-[#1C1C1C]/85 leading-relaxed font-serif text-[11px] italic">{alchemyResult.heritage}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold tracking-wider uppercase opacity-40 block">Aesthetic Benefit</span>
                      <p className="text-[#2D423F] leading-tight font-bold text-[11px]">{alchemyResult.benefits}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold tracking-wider uppercase opacity-40 block">Application Ritual</span>
                      <p className="text-[#1C1C1C]/80 leading-relaxed font-sans text-[10px]">{alchemyResult.routine}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Product Database Interactive Search Registry Section */}
        <section id="database-search" className="pt-8 scroll-mt-28">
          {/* Database Mode Selector Pills */}
          <div className="flex border-[#1C1C1C]/10 border-b mb-8 gap-6">
            <button
              className="pb-3 text-[#2D423F] text-xs tracking-widest uppercase font-mono font-extrabold border-b-2 border-[#2D423F] relative px-2 select-none"
            >
              🌿 Formulations Shelf
            </button>
            <button
              onClick={onNavigateToDiagnostics}
              className="pb-3 text-[#1C1C1C]/40 hover:text-[#1C1C1C] text-xs tracking-widest uppercase font-mono font-bold transition-all duration-300 relative px-2 cursor-pointer flex items-center gap-1.5"
            >
              🔬 Diagnostic Clinical Library
              <span className="text-[9px] bg-[#D18A6A]/10 text-[#D18A6A] px-1.5 py-0.5 rounded font-mono font-bold animate-pulse">PAGE</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-serif font-light text-[#1C1C1C]">
                {databaseMode === 'products' ? 'Registry Search' : 'Clinical Diagnostics'}
              </h2>
              <p className="text-[11px] font-mono tracking-widest uppercase opacity-50 mt-1">
                {databaseMode === 'products'
                  ? 'Instantly filter curated active formulations customized for Project Agnes.'
                  : 'Examine common skin disorders, structural flaws, and recommended apothecary rituals.'}
              </p>
            </div>

            {/* Category selection filters - Warm rounded-full capsules - ONLY FOR PRODUCTS */}
            {databaseMode === 'products' && (
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  id="filter-all"
                  onClick={() => setSelectedCategoryFilter(null)}
                  className={`px-4 py-1.5 text-[10px] tracking-widest uppercase font-mono font-bold transition-all border duration-300 rounded-full cursor-pointer ${
                    selectedCategoryFilter === null
                      ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                      : 'bg-white text-[#1C1C1C]/60 border-[#1C1C1C]/10 hover:border-[#1C1C1C]/30'
                  }`}
                >
                  All Rituals
                </button>
                <button
                  type="button"
                  id="filter-nourishing"
                  onClick={() => setSelectedCategoryFilter('Nourishing Ritual')}
                  className={`px-4 py-1.5 text-[10px] tracking-widest uppercase font-mono font-bold transition-all border duration-300 rounded-full cursor-pointer ${
                    selectedCategoryFilter === 'Nourishing Ritual'
                      ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                      : 'bg-white text-[#1C1C1C]/60 border-[#1C1C1C]/10 hover:border-[#1C1C1C]/30'
                  }`}
                >
                  Nourishing
                </button>
                <button
                  type="button"
                  id="filter-radiance"
                  onClick={() => setSelectedCategoryFilter('Radiance Ritual')}
                  className={`px-4 py-1.5 text-[10px] tracking-widest uppercase font-mono font-bold transition-all border duration-300 rounded-full cursor-pointer ${
                    selectedCategoryFilter === 'Radiance Ritual'
                      ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                      : 'bg-white text-[#1C1C1C]/60 border-[#1C1C1C]/10 hover:border-[#1C1C1C]/30'
                  }`}
                >
                  Radiance
                </button>
                <button
                  type="button"
                  id="filter-purifying"
                  onClick={() => setSelectedCategoryFilter('Purifying Ritual')}
                  className={`px-4 py-1.5 text-[10px] tracking-widest uppercase font-mono font-bold transition-all border duration-300 rounded-full cursor-pointer ${
                    selectedCategoryFilter === 'Purifying Ritual'
                      ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                      : 'bg-white text-[#1C1C1C]/60 border-[#1C1C1C]/10 hover:border-[#1C1C1C]/30'
                  }`}
                >
                  Purifying
                </button>
                <button
                  type="button"
                  id="filter-sunscreen"
                  onClick={() => setSelectedCategoryFilter('Sun Protection')}
                  className={`px-4 py-1.5 text-[10px] tracking-widest uppercase font-mono font-bold transition-all border duration-300 rounded-full cursor-pointer ${
                    selectedCategoryFilter === 'Sun Protection'
                      ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                      : 'bg-white text-[#1C1C1C]/60 border-[#1C1C1C]/10 hover:border-[#1C1C1C]/30'
                  }`}
                >
                  Sun Protection
                </button>
              </div>
            )}
          </div>

          {/* Interactive Price filter panel segment - tactile slider and smart pills */}
          {databaseMode === 'products' && (
            <div className="bg-[#FAF7F2] border border-[#1C1C1C]/5 p-5 rounded-3xl mb-8 flex flex-col md:flex-row gap-6 justify-between items-stretch md:items-center">
              <div className="flex-grow space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-extrabold tracking-widest text-[#1C1C1C]/50 uppercase flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">payments</span>
                    Max Budget Threshold
                  </span>
                  <span className="text-xs font-mono font-extrabold text-[#D18A6A] bg-[#D18A6A]/10 px-2 py-0.5 rounded-lg">
                    Under ₹{maxPriceFilter}
                  </span>
                </div>
                
                <input
                  type="range"
                  min="350"
                  max="1000"
                  step="25"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="w-full accent-[#2D423F] cursor-pointer"
                  id="price-range-slider"
                />
                
                <div className="flex justify-between text-[8px] font-mono text-[#1C1C1C]/40 uppercase tracking-widest">
                  <span>Entry: ₹350</span>
                  <span>Cap: ₹1000+</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 items-center flex-shrink-0">
                <span className="text-[9px] font-mono font-bold text-[#1C1C1C]/40 uppercase tracking-widest mr-1.5">
                  Presets:
                </span>
                {[500, 750, 1000].map((limit) => (
                  <button
                    type="button"
                    key={limit}
                    onClick={() => setMaxPriceFilter(limit)}
                    className={`px-3 py-1.5 text-[9px] font-mono rounded-lg border transition-all cursor-pointer ${
                      maxPriceFilter === limit
                        ? 'bg-[#2D423F] text-white border-[#2D423F] font-bold shadow-sm'
                        : 'bg-white text-[#1C1C1C]/70 border-[#1C1C1C]/10 hover:border-[#2D423F]/35'
                    }`}
                  >
                    ₹{limit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setMaxPriceFilter(1200)}
                  className={`px-3 py-1.5 text-[9px] font-mono rounded-lg border transition-all cursor-pointer ${
                    maxPriceFilter >= 1200
                      ? 'bg-[#2D423F] text-white border-[#2D423F] font-bold shadow-sm'
                      : 'bg-white text-[#1C1C1C]/70 border-[#1C1C1C]/10 hover:border-[#2D423F]/35'
                  }`}
                >
                  Any Limit
                </button>
              </div>
            </div>
          )}

          {/* Search box for mobile or desktop inside section - Soft rounded-2xl search */}
          <div className="mb-6 space-y-4">
            <div className="relative group max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#1C1C1C]/15 py-3 pl-12 pr-10 outline-none text-xs text-[#1C1C1C] rounded-2xl focus:border-[#2D423F] font-sans"
                placeholder={
                  databaseMode === 'products'
                    ? "Synchronized Registry Search: type ingredient, name, brand or concern..."
                    : "Diagnostic Clinical Search: type condition, symptom, compatible ingredients..."
                }
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 text-base">search</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 hover:text-[#1C1C1C]"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

            {/* Target Skin Condition or Zone Toolbar */}
            {databaseMode === 'products' && (
              <div className="bg-[#F9F6F2]/75 p-4 border border-[#1C1C1C]/10 rounded-2xl max-w-2xl animate-fadeIn">
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-60 block mb-2 font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs">tune</span>
                  Target Skin Condition / Affected Part Toolbar
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'acne', label: '🌋 Acne & Pores' },
                    { id: 'pigmentation', label: '✨ Pigmentation' },
                    { id: 'rosacea', label: '🌸 Rosacea & Redness' },
                    { id: 'eczema', label: '❄️ Eczema & Dryness' },
                    { id: 'lips', label: '🩹 Lips & Delicate' },
                    { id: 'dehydration', label: '💧 Dehydration' }
                  ].map((target) => {
                    const isActive = homeClinicalFilter === target.id;
                    return (
                      <button
                        key={target.id}
                        onClick={() => {
                          setHomeClinicalFilter(isActive ? null : target.id);
                        }}
                        className={`px-3 py-1.5 text-[10px] font-mono tracking-wide rounded-xl border transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                          isActive
                            ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-sm font-bold'
                            : 'bg-white text-[#1C1C1C]/65 border-[#1C1C1C]/10 hover:border-[#1C1C1C]/35 hover:text-[#1C1C1C]'
                        }`}
                      >
                        <span>{target.label}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {homeClinicalFilter && (
                  <p className="text-[9px] text-[#1C1C1C]/50 mt-1.5 font-mono italic">
                    Formulations list is scanning and displaying active compatibility guides for <strong>{homeClinicalFilter.toUpperCase()}</strong>.
                  </p>
                )}
              </div>
            )}

            {/* Active search filter notifications & clear buttons */}
            {(searchQuery || (databaseMode === 'products' && selectedCategoryFilter)) && (
              <div className="flex flex-wrap items-center gap-2.5 text-xs bg-[#8B9474]/10 border border-[#8B9474]/25 p-3 rounded-2xl animate-fadeIn">
                <span className="material-symbols-outlined text-sm text-[#8B9474]">filter_alt</span>
                <span className="font-mono text-[10px] tracking-wider text-[#1C1C1C]/80">
                  ACTIVE FILTERS: {selectedCategoryFilter && databaseMode === 'products' ? `[${selectedCategoryFilter}]` : ''} {searchQuery ? `containing "${searchQuery}"` : ''} —{' '}
                  {databaseMode === 'products' ? filteredProducts.length : filteredConditions.length} entries found
                </span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategoryFilter(null);
                  }}
                  className="ml-auto text-[9px] uppercase tracking-widest font-mono bg-[#1C1C1C] text-white px-3.5 py-1.5 hover:bg-[#2D423F] transition-all rounded-full cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {databaseMode === 'products' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((p) => {
                return (
                  <div
                    key={p.id}
                    onClick={() => onNavigateToProduct(p.id)}
                    className="group bg-white border border-[#1C1C1C]/10 p-6 hover:shadow-2xl hover:border-[#1C1C1C]/30 duration-300 cursor-pointer flex flex-col justify-between min-h-[440px] relative overflow-hidden rounded-3xl animate-fadeIn"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] uppercase font-mono tracking-widest opacity-50 block">
                            {p.category}
                          </span>
                          {p.brand && (
                            <span className="text-[9px] font-mono bg-[#8B9474]/10 text-[#8B9474] font-bold px-1.5 py-0.5 rounded">
                              {p.brand}
                            </span>
                          )}
                          <span className="text-[10px] font-mono font-bold text-[#D18A6A] bg-[#D18A6A]/10 px-1.5 py-0.5 rounded">
                            ₹{p.price || 450}
                          </span>
                        </div>
                        {p.isDiscontinued && (
                          <span className="px-2.5 py-0.5 text-[8px] bg-red-50 text-red-600 border border-red-100 rounded-lg font-bold uppercase tracking-wider">
                            Discontinued
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg text-[#1C1C1C] leading-snug group-hover:text-[#2D423F] duration-200">
                        {p.name}
                      </h3>
                      <p className="text-xs text-[#1C1C1C]/60 italic mt-2 line-clamp-2 leading-relaxed">
                        {p.quote}
                      </p>

                      {/* Real-Time Condition-Targeted Ingredient Alignment Highlights */}
                      {homeClinicalFilter && (
                        <div className="mt-3.5 space-y-2 border-t border-dashed border-[#1C1C1C]/10 pt-2.5">
                          {p.ingredients?.split(',').map(item => item.trim()).filter(Boolean).filter(ing => getIngredientImpact(ing, homeClinicalFilter).status === 'beneficial').length > 0 && (
                            <div className="flex items-start gap-1.5 p-2 bg-emerald-50/75 text-[10px] text-emerald-900 border border-emerald-200/55 rounded-xl">
                              <span className="material-symbols-outlined text-[12px] leading-none text-emerald-600 mt-0.5">check_circle</span>
                              <div>
                                <span className="font-bold font-mono text-[8px] tracking-widest uppercase block text-emerald-950">Fits Target:</span>
                                <span className="text-[9px] opacity-90 line-clamp-1 font-mono text-[8px] uppercase">
                                  {p.ingredients?.split(',').map(item => item.trim()).filter(Boolean).filter(ing => getIngredientImpact(ing, homeClinicalFilter).status === 'beneficial').slice(0, 3).join(', ')}
                                </span>
                              </div>
                            </div>
                          )}
                          {p.ingredients?.split(',').map(item => item.trim()).filter(Boolean).filter(ing => getIngredientImpact(ing, homeClinicalFilter).status === 'problematic').length > 0 && (
                            <div className="flex items-start gap-1.5 p-2 bg-rose-50/75 text-[10px] text-rose-900 border border-rose-200/55 rounded-xl animate-pulse">
                              <span className="material-symbols-outlined text-[12px] leading-none text-rose-600 mt-0.5 animate-bounce">warning</span>
                              <div>
                                <span className="font-bold font-mono text-[8px] tracking-widest uppercase block text-rose-950">Test/Avoid Warning:</span>
                                <span className="text-[9px] opacity-90 line-clamp-1 font-bold font-mono text-[8px] uppercase text-rose-700">
                                  {p.ingredients?.split(',').map(item => item.trim()).filter(Boolean).filter(ing => getIngredientImpact(ing, homeClinicalFilter).status === 'problematic').slice(0, 3).join(', ')}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="my-3 flex justify-center h-24 mix-blend-multiply opacity-90 group-hover:scale-105 duration-500">
                      <img alt={p.name} className="h-full object-contain referrer-policy-safe" src={p.imgUrl} referrerPolicy="no-referrer" />
                    </div>

                    <div className="flex justify-between items-center border-t border-[#1C1C1C]/5 pt-4">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#8B9474] text-sm">circle_notifications</span>
                        <span className="text-[10px] font-mono tracking-wider opacity-60">Score: {p.compatibilityScore}%</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono tracking-widest hover:opacity-100 opacity-60 flex items-center gap-1">
                        More <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredProducts.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white p-8 border border-[#1C1C1C]/10 rounded-3xl">
                  <span className="material-symbols-outlined text-4xl text-[#1C1C1C]/30 mb-2">sentiment_dissatisfied</span>
                  <p className="font-serif text-lg text-[#1C1C1C]">No Skincare Miracles Found</p>
                  <p className="text-xs text-[#1C1C1C]/60 mt-1">Try testing other keywords or clear filter pills.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredConditions.map((c) => {
                return (
                  <div
                    key={c.id}
                    className="group bg-white border border-[#1C1C1C]/10 p-8 hover:shadow-2xl hover:border-[#2D423F]/30 duration-300 relative overflow-hidden rounded-3xl flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-[#D18A6A] font-bold bg-[#D18A6A]/10 px-2.5 py-1 rounded-md">
                          {c.category}
                        </span>
                        <span className="material-symbols-outlined text-[#8B9474] text-lg select-none opacity-50 group-hover:opacity-100 group-hover:rotate-12 transition-all">
                          clinical_notes
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif text-xl text-[#1C1C1C] font-semibold leading-snug group-hover:text-[#2D423F] duration-200">
                          {c.name}
                        </h3>
                        <p className="text-xs text-[#1C1C1C]/70 italic mt-1 font-serif">
                          {c.symptoms}
                        </p>
                      </div>

                      <div className="border-t border-[#1C1C1C]/5 pt-4 space-y-4">
                        <div>
                          <span className="text-[9px] font-mono font-bold tracking-widest uppercase opacity-40 block mb-1">Clinical Overview</span>
                          <p className="text-xs text-[#1C1C1C]/80 leading-relaxed font-sans">{c.clinicalOverview}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div>
                            <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-emerald-700 block mb-1.5">✓ Compatible Active Agents</span>
                            <div className="flex flex-wrap gap-1.5">
                              {c.compatibleIngredients.map((ing) => (
                                <span key={ing} className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 text-[9px] font-mono rounded font-medium">
                                  {ing}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-rose-700 block mb-1.5">✗ Restricted Active Agents</span>
                            <div className="flex flex-wrap gap-1.5">
                              {c.forbiddenIngredients.map((ing) => (
                                <span key={ing} className="bg-rose-50 text-rose-800 border border-rose-100 px-2 py-0.5 text-[9px] font-mono rounded font-medium">
                                  {ing}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#1C1C1C]/5 text-xs">
                      <div className="bg-[#FAF3EA] border-l-4 border-[#D18A6A] p-4 rounded-r-2xl text-[11px] font-serif italic text-[#5F4B32] leading-relaxed">
                        <span className="font-mono font-bold text-[9px] tracking-widest uppercase text-[#D18A6A] not-italic block mb-1 font-extrabold">Apothecary Scholar Note</span>
                        {c.apothecaryRitualNote}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredConditions.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white p-8 border border-[#1C1C1C]/10 rounded-3xl">
                  <span className="material-symbols-outlined text-4xl text-[#1C1C1C]/30 mb-2">sentiment_dissatisfied</span>
                  <p className="font-serif text-lg text-[#1C1C1C]">No Matching Conditions</p>
                  <p className="text-xs text-[#1C1C1C]/60 mt-1">Try testing other symptoms, ingredients, or condition categories.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Newspaper Section: The Sanctuary Chronicle */}
        <section className="pt-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between select-none border-b border-[#1C1C1C]/10 pb-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#8B9474] font-bold uppercase">Agnes Gazette</span>
              <h2 className="text-3xl font-serif font-light text-[#1C1C1C] mt-1">Chronicle of Heritage Care</h2>
            </div>
            <p className="text-xs font-serif italic text-[#1C1C1C]/50 mt-1 md:mt-0">
              Synchronizing ancient recipes with modern clinical laboratory metrics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {NEWS_ITEMS.map((item) => (
              <article key={item.id} className="bg-white border border-[#1C1C1C]/5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-[450px] overflow-hidden rounded-3xl">
                <div>
                  {/* Clean image framing - NO TEXT OVERLAY */}
                  <div className="h-44 w-full bg-[#F9F6F2] overflow-hidden border-b border-[#1C1C1C]/5">
                    <img alt={item.title} className="w-full h-full object-cover select-none" src={item.img} />
                  </div>
                  
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-mono text-[#D18A6A] font-bold tracking-widest uppercase">
                      <span>{item.tag}</span>
                      <span className="opacity-60 text-[#1C1C1C]">{item.date}</span>
                    </div>
                    <h3 className="font-serif text-base font-semibold leading-snug text-[#1C1C1C]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#1C1C1C]/70 leading-relaxed font-serif italic line-clamp-4">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 select-none">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 duration-200">
                    Volume I • Agnes Press
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Waveline aesthetic spacer block */}
        <div className="waveline-divider" />

        {/* Find your Right Routine Section */}
        <section className="bg-[#2D423F] p-12 md:p-16 relative overflow-hidden text-[#F9F6F2] shadow-2xl rounded-3xl">
          <div className="max-w-2xl relative z-10 space-y-6">
            <span className="text-[11px] uppercase tracking-[0.2em] font-mono opacity-60">Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight text-white">Find Your Right Routine</h2>
            <p className="text-sm font-serif italic text-[#F9F6F2]/85 leading-relaxed">
              At Project Agnes, we believe your skin is a sanctuary. We bridge the wisdom of traditional Indian
              remedies—the same ones passed down through generations—with cutting-edge modern dermatology. Our goal is
              to simplify science and honor ritual, ensuring your skincare journey is as peaceful as a beach-side
              morning.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              {/* BUTTON REQUIREMENT FOR TRANSITION FLOW TO SKIN TYPE QUIZ */}
              <button
                onClick={onNavigateToQuiz}
                className="px-8 py-4 bg-white text-[#1C1C1C] text-[12px] uppercase tracking-[0.2em] font-semibold hover:bg-[#E5DACE] transition-colors cursor-pointer rounded-full"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Decorative design sphere */}
          <div className="absolute right-[-40px] bottom-[-40px] w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none select-none z-0" />
        </section>
      </main>
    </div>
  );
}
