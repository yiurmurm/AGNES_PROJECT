import { Product, SkinCondition } from './types';

export const PRODUCTS: Product[] = [
  {
    id: "prod_minimalist_b5",
    brand: "Minimalist",
    name: "Vitamin B5 10% Oil-Free Moisturizer",
    category: "Nourishing Ritual",
    concern: "Damaged Barrier, Oily Dehydrated Skin, Inflammation",
    quote: '"A lightweight, oil-free hydration shield crafted with advanced Provitamin B5 to repair damaged barrier bonds without adding heavy pore-clogging weight."',
    imgUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    ingredients: "Aqua, Panthenol, Glycerin, Isododecane, Xylitylglucoside, Anhydroxylitol, Xylitol, Zinc PCA, Betaine, Sodium Hyaluronate, Allantoin, Phenoxyethanol, Ethylhexylglycerin",
    rawIngredientsList: "Aqua, Panthenol, Glycerin, Isododecane, Xylitylglucoside, Anhydroxylitol, Xylitol, Zinc PCA, Betaine, Sodium Hyaluronate, Allantoin, Phenoxyethanol, Ethylhexylglycerin",
    compatibilityScore: 92,
    manufacturingDate: "January 2024",
    discontinuedDate: "Active",
    amazonUrl: "https://www.amazon.in/s?k=Minimalist+Vitamin+B5+10%25+Moisturizer",
    dermatologistUrl: "#",
    expertReview: "This represents one of the most elegant, non-comedogenic oil-free creams on the market. Highly therapeutic for calming seasonal skin shine.",
    expertName: "Dr. Ananya Iyer",
    expertRole: "Senior Dermatologist, Bengaluru",
    expertAvatar: "https://images.unsplash.com/photo-1594824813573-246434e3b96f?auto=format&fit=crop&w=150&q=80",
    lovesCount: "14k+ Loves",
    isDiscontinued: false,
    skinTypeSuitability: {
      trueDry: 70,
      oilyDehydrated: 100,
      severelyDryDehydrated: 85,
      trueOily: 90
    },
    ingredientsDictionary: [
      { ingredient: "Aqua", function: "Primary water base solvent used to dissolve water-soluble elements." },
      { ingredient: "Panthenol", function: "Active Provitamin B5; a deep skin humectant that accelerates structural tissue healing and reduces redness." },
      { ingredient: "Glycerin", function: "A heavy-duty skin-identical humectant drawing moisture deep into the stratum corneum." },
      { ingredient: "Isododecane", function: "A lightweight, volatile emollient that gives a velvet texture without adding pore-clogging weight." },
      { ingredient: "Xylitylglucoside", function: "Part of a sugar-derived complex that optimizes the skin's natural aquaporin water channels." },
      { ingredient: "Zinc PCA", function: "Reduces excess sebum (oil) secretion while providing localized anti-bacterial defense." },
      { ingredient: "Betaine", function: "An osmolyte that regulates cellular fluid balance to protect skin cells from environmental dehydration." },
      { ingredient: "Sodium Hyaluronate", function: "The salt form of Hyaluronic Acid; intensely binds water weight to plump epidermal tissue." },
      { ingredient: "Allantoin", function: "An extract that minimizes minor irritation and actively softens rough skin texture." }
    ],
    scannerFlags: {
      humectants: ["Panthenol", "Glycerin", "Xylitylglucoside", "Betaine", "Sodium Hyaluronate"],
      ceramidesAndBarrier: ["Panthenol"],
      irritants: []
    }
  },
  {
    id: "prod_dermaco_aqua",
    brand: "The Derma Co",
    name: "1% Hyaluronic Aqua Gel Sunscreen SPF 50",
    category: "Radiance Ritual",
    concern: "Sun Protection, Dehydration, UV Shielding",
    quote: '"A refreshing splash of broad-spectrum UV shielding, enriched with natural hyaluronic acid to hydrate and plump hot, fatigued facial contours."',
    imgUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    ingredients: "Aqua, Ethylhexyl Methoxycinnamate, Zinc Oxide, Butyl Methoxydibenzoylmethane, Phospholipids, Hyaluronic Acid, Benzophenone-3, Allantoin, Titanium Dioxide, Glycerin, 1,3 Butylene Glycol, Aloe Barbadensis Leaf Juice, Fragrance",
    rawIngredientsList: "Aqua, Ethylhexyl Methoxycinnamate, Zinc Oxide, Butyl Methoxydibenzoylmethane, Phospholipids, Hyaluronic Acid, Benzophenone-3, Allantoin, Titanium Dioxide, Glycerin, 1,3 Butylene Glycol, Aloe Barbadensis Leaf Juice, Fragrance",
    compatibilityScore: 88,
    manufacturingDate: "May 2023",
    discontinuedDate: "Active",
    amazonUrl: "https://www.amazon.in/s?k=The+Derma+Co+1%25+Hyaluronic+Sunscreen",
    dermatologistUrl: "#",
    expertReview: "Combining organic chemical filters with physical mineral blocks achieves an ultra-light gel sunscreen that never leaves a white cast while delivering deep dermal water lock.",
    expertName: "Dr. Vivek Mehra",
    expertRole: "Dermatological Science Advisor, Mumbai",
    expertAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80",
    lovesCount: "21k+ Loves",
    isDiscontinued: false,
    skinTypeSuitability: {
      trueDry: 80,
      oilyDehydrated: 95,
      severelyDryDehydrated: 65,
      trueOily: 90
    },
    ingredientsDictionary: [
      { ingredient: "Aqua", function: "Emulsion medium base solvent used to disperse key photoprotectors." },
      { ingredient: "Ethylhexyl Methoxycinnamate", function: "An organic chemical UV filter that absorbs UVB light." },
      { ingredient: "Zinc Oxide", function: "A broad-spectrum physical mineral filter that reflects UVA and UVB wavelengths." },
      { ingredient: "Butyl Methoxydibenzoylmethane", function: "Avobenzone; provides comprehensive, stable protection against deeper UVA rays." },
      { ingredient: "Phospholipids", function: "Skin-identical lipids that build a natural protective wrapper around moisture." },
      { ingredient: "Hyaluronic Acid", function: "Attracts free water molecules to alleviate dehydration lines on impact." },
      { ingredient: "Benzophenone-3", function: "Oxybenzone; secondary UV chemical filter stabilizer that can sometimes sting hyper-sensitive skin." },
      { ingredient: "Aloe Barbadensis Leaf Juice", function: "A soothing botanical fluid that reduces surface heat and minor redness." },
      { ingredient: "Fragrance", function: "Synthetic aromatic components added to mask active sunscreen odors." }
    ],
    scannerFlags: {
      humectants: ["Hyaluronic Acid", "Glycerin", "1,3 Butylene Glycol", "Aloe Barbadensis Leaf Juice"],
      ceramidesAndBarrier: ["Phospholipids"],
      irritants: ["Benzophenone-3", "Fragrance"]
    }
  },
  {
    id: "prod_dotkey_barrier",
    brand: "Dot & Key",
    name: "Ceramides & Hyaluronic Skin Barrier Repair Cream",
    category: "Nourishing Ritual",
    concern: "Flaking, Intense Dryness, Weakened Acid Mantle",
    quote: '"An ultra-rich, buttery barrier-sealing salve infused with essential lipids to immediately comfort flaking textures and lock in water weight."',
    imgUrl: "https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=600&q=80",
    ingredients: "Aqua, Caprylic Capric Triglyceride, Glycerine, Glyceryl Stearate, Cetyl Alcohol, Ceramide NP, Ceramide AP, Ceramide EOP, Hyaluronic Acid, Polyglutamic Acid, Phytosphingosine, Cholesterol, Shea Butter, Stearic Acid, Phenoxyethanol",
    rawIngredientsList: "Aqua, Caprylic Capric Triglyceride, Glycerine, Glyceryl Stearate, Cetyl Alcohol, Ceramide NP, Ceramide AP, Ceramide EOP, Hyaluronic Acid, Polyglutamic Acid, Phytosphingosine, Cholesterol, Shea Butter, Stearic Acid, Phenoxyethanol",
    compatibilityScore: 96,
    manufacturingDate: "August 2023",
    discontinuedDate: "Active",
    amazonUrl: "https://www.amazon.in/s?k=Dot+and+Key+Ceramides+Barrier+Repair+Cream",
    dermatologistUrl: "#",
    expertReview: "The pairing of Cholesterol, fatty acids, and multi-ceramides creates an identical physiological lipid ratio crucial for repairing broken acid mantles.",
    expertName: "Dr. Priya Sharma",
    expertRole: "Clinical Dermatologist, Delhi",
    expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80",
    lovesCount: "18k+ Loves",
    isDiscontinued: false,
    skinTypeSuitability: {
      trueDry: 100,
      oilyDehydrated: 75,
      severelyDryDehydrated: 100,
      trueOily: 35
    },
    ingredientsDictionary: [
      { ingredient: "Caprylic Capric Triglyceride", function: "A rich emollient fluid sourced from coconut lipids to fill cracks between skin scales." },
      { ingredient: "Glycerine", function: "A classic humectant that pulls moisture from deeper skin tissues upward." },
      { ingredient: "Ceramide NP / AP / EOP", function: "A combination of essential natural lipids required to structurally seal a broken moisture barrier." },
      { ingredient: "Polyglutamic Acid", function: "An ultra-dense peptide molecule that holds significantly more water weight than standard hyaluronic acid to maintain surface hydration." },
      { ingredient: "Cholesterol", function: "A vital structural fat that pairs with skin ceramides to restore long-term elasticity." },
      { ingredient: "Shea Butter", function: "A thick, protective natural butter that blocks wind and dry air from sapping skin water." },
      { ingredient: "Stearic Acid", function: "A structuring fatty acid that softens surface textures and fortifies cell matrix bonds." }
    ],
    scannerFlags: {
      humectants: ["Glycerine", "Hyaluronic Acid", "Polyglutamic Acid"],
      ceramidesAndBarrier: ["Ceramide NP", "Ceramide AP", "Ceramide EOP", "Phytosphingosine", "Cholesterol"],
      irritants: []
    }
  },
  {
    id: "prod_sebamed_clear",
    brand: "Sebamed",
    name: "Clear Face Care Gel (pH 5.5)",
    category: "Purifying Ritual",
    concern: "Acne Vulgaris, Clogged Pores, Sebum Control",
    quote: '"An extremely pure, oil-free cooling treatment gel formulated precisely to pH 5.5 to support skin\'s acidic protective mantle without feeding bacteria."',
    imgUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    ingredients: "Aqua, Aloe barbadensis leaf juice, Propylene Glycol, Glycerin, Panthenol, Sodium Hyaluronate, Allantoin, Carbomer, Citric Acid, Sodium Hydroxide, Phenoxyethanol",
    rawIngredientsList: "Aqua, Aloe barbadensis leaf juice, Propylene Glycol, Glycerin, Panthenol, Sodium Hyaluronate, Allantoin, Carbomer, Citric Acid, Sodium Hydroxide, Phenoxyethanol",
    compatibilityScore: 94,
    manufacturingDate: "October 2022",
    discontinuedDate: "Active",
    amazonUrl: "https://www.amazon.in/s?k=Sebamed+Clear+Face+Care+Gel",
    dermatologistUrl: "#",
    expertReview: "With zero lipids and a perfect acidic 5.5 calibration, this gel speeds acne healing and supports recovery without promoting pore blockages.",
    expertName: "Dr. Vivek Mehra",
    expertRole: "Ayurvedic Specialist, Mumbai",
    expertAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80",
    lovesCount: "25k+ Loves",
    isDiscontinued: false,
    skinTypeSuitability: {
      trueDry: 30,
      oilyDehydrated: 90,
      severelyDryDehydrated: 20,
      trueOily: 100
    },
    ingredientsDictionary: [
      { ingredient: "Aloe barbadensis leaf juice", function: "Pure cooling botanical extract with natural antibacterial and anti-inflammatory support." },
      { ingredient: "Propylene Glycol", function: "A light hydrating fluid that helps soothing actives absorb cleanly into skin layers." },
      { ingredient: "Allantoin", function: "An anti-irritant that helps shed dead cells from blocked pore channels." },
      { ingredient: "Citric Acid", function: "An organic compound used in trace amounts to perfectly balance the product to an optimal skin pH of 5.5." }
    ],
    scannerFlags: {
      humectants: ["Aloe barbadensis leaf juice", "Propylene Glycol", "Glycerin", "Panthenol", "Sodium Hyaluronate"],
      ceramidesAndBarrier: [],
      irritants: []
    }
  },
  {
    id: "prod_requil_ultra",
    brand: "Re'equil",
    name: "Ultra Matte Dry Touch Silicone Sunscreen Gel",
    category: "Purifying Ritual",
    concern: "Extreme Oil Control, Large Pores, Mattifying",
    quote: '"An advanced matte-finish dry-touch silicone gel sunscreen that behaves like an invisible oil-absorbing primer under any conditions."',
    imgUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
    ingredients: "Cyclopentasiloxane, Dimethicone Crosspolymer, Zinc Oxide, Titanium Dioxide, C12-15 Alkyl Benzoate, Tocopheryl Acetate, Silica, Isopropyl Myristate",
    rawIngredientsList: "Cyclopentasiloxane, Dimethicone Crosspolymer, Zinc Oxide, Titanium Dioxide, C12-15 Alkyl Benzoate, Tocopheryl Acetate, Silica, Isopropyl Myristate",
    compatibilityScore: 89,
    manufacturingDate: "February 2023",
    discontinuedDate: "Active",
    amazonUrl: "https://www.amazon.in/s?k=Re%27equil+Ultra+Matte+Dry+Touch+Sunscreen",
    dermatologistUrl: "#",
    expertReview: "The dry silicone crosspolymer base stays incredibly matte throughout high heat, but those with extreme acne-prone tendencies should double cleanse to clear it fully.",
    expertName: "Dr. Ananya Iyer",
    expertRole: "Senior Dermatologist, Bengaluru",
    expertAvatar: "https://images.unsplash.com/photo-1594824813573-246434e3b96f?auto=format&fit=crop&w=150&q=80",
    lovesCount: "11k+ Loves",
    isDiscontinued: false,
    skinTypeSuitability: {
      trueDry: 50,
      oilyDehydrated: 65,
      severelyDryDehydrated: 40,
      trueOily: 100
    },
    ingredientsDictionary: [
      { ingredient: "Cyclopentasiloxane", function: "A volatile silicone base that fluidizes the formula then clean-evaporates, leaving an ultra-matte finish." },
      { ingredient: "Dimethicone Crosspolymer", function: "A velvety compound that fills in large pores and uneven texture to smooth skin appearance." },
      { ingredient: "Silica", function: "A natural mineral powder component that absorbs excess sebum on contact throughout the day." },
      { ingredient: "Isopropyl Myristate", function: "A texture enhancer that thins heavy gels, but can sometimes clog highly acne-prone pores if present in large quantities." }
    ],
    scannerFlags: {
      humectants: [],
      ceramidesAndBarrier: [],
      irritants: ["Isopropyl Myristate"]
    }
  },
  {
    id: "prod_neutrogena_hydro",
    brand: "Neutrogena",
    name: "Hydro Boost Water Gel",
    category: "Nourishing Ritual",
    concern: "Surface Dehydration, Lack of Radiance",
    quote: '"An award-winning splash of sky-blue refreshing water hydration gel that instantly quench thirsty cells with intense hyaluronic acid lock."',
    imgUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80",
    ingredients: "Aqua, Dimethicone, Glycerin, Cetearyl Olivate, Sorbitan Olivate, Sodium Hyaluronate, Ethylhexylglycerin, Polyacrylamide, C13-14 Isoparaffin, Laureth-7, Chlorphenesin, Blue 1",
    rawIngredientsList: "Aqua, Dimethicone, Glycerin, Cetearyl Olivate, Sorbitan Olivate, Sodium Hyaluronate, Ethylhexylglycerin, Polyacrylamide, C13-14 Isoparaffin, Laureth-7, Chlorphenesin, Blue 1",
    compatibilityScore: 91,
    manufacturingDate: "June 2022",
    discontinuedDate: "Active",
    amazonUrl: "https://www.amazon.in/s?k=Neutrogena+Hydro+Boost+Water+Gel",
    dermatologistUrl: "#",
    expertReview: "An exemplary oil-free humectant cream. Uses olive-extracted fatty acids to seal water onto skin surfaces without adding lipid weight.",
    expertName: "Dr. Ananya Iyer",
    expertRole: "Senior Dermatologist, Bengaluru",
    expertAvatar: "https://images.unsplash.com/photo-1594824813573-246434e3b96f?auto=format&fit=crop&w=150&q=80",
    lovesCount: "35k+ Loves",
    isDiscontinued: false,
    skinTypeSuitability: {
      trueDry: 60,
      oilyDehydrated: 95,
      severelyDryDehydrated: 50,
      trueOily: 95
    },
    ingredientsDictionary: [
      { ingredient: "Dimethicone", function: "A smooth liquid silicone fluid that creates a protective, breathable water lock on the skin surface." },
      { ingredient: "Cetearyl Olivate / Sorbitan Olivate", function: "A lipid complex derived from natural olives that binds water and oil cleanly into a cooling gel texture." },
      { ingredient: "Blue 1", function: "A cosmetic colorant added solely to give the product its clean, signature aqua appearance." }
    ],
    scannerFlags: {
      humectants: ["Glycerin", "Sodium Hyaluronate"],
      ceramidesAndBarrier: [],
      irritants: ["Blue 1"]
    }
  },
  {
    id: "prod_cetaphil_dam",
    brand: "Cetaphil",
    name: "DAM Daily Advance Ultra Hydrating Lotion",
    category: "Nourishing Ritual",
    concern: "Severe Scaly Dryness, Chronic Eczema-Prone Flaking",
    quote: '"A heavy-duty, clinically validated barrier-replenishing lotion designed to lock in extreme moisture on cracked, sensitive skin for 48 hours."',
    imgUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80",
    ingredients: "Aqua, Glycerin, Hydrogenated Polyisobutene, Cetearyl Alcohol, Macadamia Integrifolia Seed Oil, Butyrospermum Parkii Butter, Cyclopentasiloxane, Tocopheryl Acetate, Sodium Polyacrylate, Alcohol Denat.",
    rawIngredientsList: "Aqua, Glycerin, Hydrogenated Polyisobutene, Cetearyl Alcohol, Macadamia Integrifolia Seed Oil, Butyrospermum Parkii Butter, Cyclopentasiloxane, Tocopheryl Acetate, Sodium Polyacrylate, Alcohol Denat.",
    compatibilityScore: 95,
    manufacturingDate: "September 2022",
    discontinuedDate: "Active",
    amazonUrl: "https://www.amazon.in/s?k=Cetaphil+Daily+Advance+DAM+Lotion",
    dermatologistUrl: "#",
    expertReview: "Packed with macadamia nut oil and shea butter, this lotion is the absolute defense standard for eczema-prone dry skin experiencing winter moisture collapse.",
    expertName: "Dr. Priya Sharma",
    expertRole: "Clinical Dermatologist, Delhi",
    expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80",
    lovesCount: "30k+ Loves",
    isDiscontinued: false,
    skinTypeSuitability: {
      trueDry: 100,
      oilyDehydrated: 70,
      severelyDryDehydrated: 100,
      trueOily: 20
    },
    ingredientsDictionary: [
      { ingredient: "Hydrogenated Polyisobutene", function: "A synthetic emollient oil that creates a heavy block against moisture loss over raw skin patches." },
      { ingredient: "Macadamia Integrifolia Seed Oil", function: "A rich botanical oil filled with essential fatty acids that mimics natural healthy human sebum." },
      { ingredient: "Alcohol Denat.", function: "Denatured thinning agent used to help heavy lipid creams spread across the skin; can cause a brief stinging sensation on cracked skin barriers." }
    ],
    scannerFlags: {
      humectants: ["Glycerin"],
      ceramidesAndBarrier: ["Macadamia Integrifolia Seed Oil", "Butyrospermum Parkii Butter"],
      irritants: ["Alcohol Denat."]
    },
    price: 399
  },
  {
    id: "prod_fixderma_shadow",
    brand: "Fixderma",
    name: "Shadow SPF 50+ Gel Sunscreen",
    category: "Sun Protection",
    concern: "UV Protection, Melasma Prevention, Lightweight Hydration",
    quote: '"A hybrid gel formula providing comprehensive sun protection without leaving grease or white residue."',
    imgUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
    ingredients: "Aqua, Octyl Methoxycinnamate, Butyl Methoxydibenzoylmethane, Benzophenone-4, Triethanolamine, Propylene Glycol, Zinc Oxide, Carbomer, Phenoxyethanol, Fragrance",
    rawIngredientsList: "Aqua, Octyl Methoxycinnamate, Butyl Methoxydibenzoylmethane, Benzophenone-4, Triethanolamine, Propylene Glycol, Zinc Oxide, Carbomer, Phenoxyethanol, Fragrance",
    skinTypeSuitability: {
      trueDry: 60,
      oilyDehydrated: 95,
      severelyDryDehydrated: 50,
      trueOily: 100
    },
    compatibilityScore: 91,
    manufacturingDate: "November 2023",
    discontinuedDate: "Active",
    amazonUrl: "https://www.amazon.in/s?k=Fixderma+Shadow+SPF+50+Gel+Sunscreen",
    dermatologistUrl: "#",
    expertReview: "An excellent gel-fluid option for high-humidity environments. Its absorption profile is perfect for oily-dehydrated complexions.",
    expertName: "Dr. Vivek Mehra",
    expertRole: "Dermatological Science Advisor",
    expertAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80",
    lovesCount: "11k+ Loves",
    isDiscontinued: false,
    ingredientsDictionary: [
      { ingredient: "Aqua", function: "Water carrier base." },
      { ingredient: "Octyl Methoxycinnamate", function: "Chemical sunscreen agent that absorbs UVB rays." },
      { ingredient: "Butyl Methoxydibenzoylmethane", function: "Avobenzone; provides broad-spectrum UVA filtering." },
      { ingredient: "Benzophenone-4", function: "Sulisobenzone; water-soluble chemical filter that helps protect the skin and stabilize the formula." },
      { ingredient: "Propylene Glycol", function: "Lightweight humectant that keeps the gel texture smooth and easy to spread." },
      { ingredient: "Zinc Oxide", function: "Mineral filter that reflects UV light for broad-spectrum protection." }
    ],
    scannerFlags: {
      humectants: ["Propylene Glycol"],
      ceramidesAndBarrier: [],
      irritants: ["Benzophenone-4", "Fragrance"]
    },
    price: 395
  },
  {
    id: "prod_wishcare_salicylic",
    brand: "WishCare",
    name: "2% Salicylic Acid Face Serum",
    category: "Purifying Ritual",
    concern: "Acne Vulgaris, Blackheads, Excessive Sebum Control",
    quote: '"An aqueous pore-declogging serum using maximum-strength Salicylic Acid with Cica to soothe active redness."',
    imgUrl: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80",
    ingredients: "Aqua, Glycerin, Salicylic Acid, Propylene Glycol, Centella Asiatica Extract, Camellia Sinensis (Green Tea) Leaf Extract, Zinc PCA, Sodium Hydroxide, Phenoxyethanol, Ethylhexylglycerin",
    rawIngredientsList: "Aqua, Glycerin, Salicylic Acid, Propylene Glycol, Centella Asiatica Extract, Camellia Sinensis (Green Tea) Leaf Extract, Zinc PCA, Sodium Hydroxide, Phenoxyethanol, Ethylhexylglycerin",
    skinTypeSuitability: {
      trueDry: 40,
      oilyDehydrated: 80,
      severelyDryDehydrated: 20,
      trueOily: 100
    },
    compatibilityScore: 94,
    manufacturingDate: "January 2024",
    discontinuedDate: "Active",
    amazonUrl: "https://www.amazon.in/s?k=WishCare+2%25+Salicylic+Acid+Serum",
    dermatologistUrl: "#",
    expertReview: "Extremely fast-acting for localized whitehead clearance. The green tea and cica addition actively prevents moisture barrier irritation.",
    expertName: "Dr. Ananya Iyer",
    expertRole: "Senior Dermatologist",
    expertAvatar: "https://images.unsplash.com/photo-1594824813573-246434e3b96f?auto=format&fit=crop&w=150&q=80",
    lovesCount: "16k+ Loves",
    isDiscontinued: false,
    ingredientsDictionary: [
      { ingredient: "Salicylic Acid", function: "Beta Hydroxy Acid (BHA); dissolves skin oil and clears dead cell buildup inside clogged pores." },
      { ingredient: "Centella Asiatica Extract", function: "Cica; a soothing botanical extract that helps calm redness and support skin repair." },
      { ingredient: "Camellia Sinensis Leaf Extract", function: "Green Tea Extract; provides rich antioxidants and helps soothe oil-prone skin inflammation." },
      { ingredient: "Zinc PCA", function: "Helps regulate excess oil production and balances the skin's surface microbiome." }
    ],
    scannerFlags: {
      humectants: ["Glycerin", "Propylene Glycol"],
      ceramidesAndBarrier: ["Centella Asiatica Extract"],
      irritants: []
    },
    price: 499
  },
  {
    id: "prod_conscious_multi",
    brand: "Conscious Chemist",
    name: "Multi-Peptide Multi-Ceramide Moisturizer",
    category: "Nourishing Ritual",
    concern: "Barrier Flaking, Dehydration, Fine Lines",
    quote: '"A rich nourishing cocktail of essential skin-identical lipids and peptides to strengthen structural skin fibers."',
    imgUrl: "https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=600&q=80",
    ingredients: "Aqua, Caprylic/Capric Triglyceride, Glycerin, Propanediol, Ceramide NP, Ceramide AP, Ceramide EOP, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Cholesterol, Phytosphingosine, Sodium Lauroyl Lactylate, Carbomer, Xanthan Gum, Phenoxyethanol",
    rawIngredientsList: "Aqua, Caprylic/Capric Triglyceride, Glycerin, Propanediol, Ceramide NP, Ceramide AP, Ceramide EOP, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Cholesterol, Phytosphingosine, Sodium Lauroyl Lactylate, Carbomer, Xanthan Gum, Phenoxyethanol",
    skinTypeSuitability: {
      trueDry: 100,
      oilyDehydrated: 85,
      severelyDryDehydrated: 100,
      trueOily: 50
    },
    compatibilityScore: 97,
    manufacturingDate: "December 2023",
    discontinuedDate: "Active",
    amazonUrl: "https://www.amazon.in/s?k=Conscious+Chemist+Multi+Peptide+Ceramide",
    dermatologistUrl: "#",
    expertReview: "Outstanding formulation featuring a clean physiological ratio of lipid repair components. Restores even severely dry skin with ease.",
    expertName: "Dr. Priya Sharma",
    expertRole: "Clinical Dermatologist",
    expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80",
    lovesCount: "20k+ Loves",
    isDiscontinued: false,
    ingredientsDictionary: [
      { ingredient: "Ceramide NP / AP / EOP", function: "Essential skin lipids that help rebuild a weak moisture barrier and seal in hydration." },
      { ingredient: "Palmitoyl Tripeptide-1 / Tetrapeptide-7", function: "Peptide signals that help support natural skin structure and repair mechanisms." },
      { ingredient: "Cholesterol", function: "A vital structural lipid that pairs with ceramides to help improve skin flexibility." },
      { ingredient: "Phytosphingosine", function: "A lipid precursor that helps the skin generate its own natural ceramides." }
    ],
    scannerFlags: {
      humectants: ["Glycerin", "Propanediol"],
      ceramidesAndBarrier: ["Ceramide NP", "Ceramide AP", "Ceramide EOP", "Cholesterol", "Phytosphingosine"],
      irritants: []
    },
    price: 549
  },
  {
    id: "prod_suganda_cica",
    brand: "Suganda",
    name: "5% Niacinamide Cica Gel",
    category: "Nourishing Ritual",
    concern: "Redness, Post-Inflammatory Erythema (PIE), Sensitive Skin Balance",
    quote: '"A soothing hydration booster targeting redness and uneven skin tones with safe, non-irritating Niacinamide."',
    imgUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    ingredients: "Aqua, Niacinamide, Centella Asiatica Extract, Propylene Glycol, Panthenol, Sodium Hyaluronate, Allantoin, Carbomer, Phenoxyethanol, Ethylhexylglycerin",
    rawIngredientsList: "Aqua, Niacinamide, Centella Asiatica Extract, Propylene Glycol, Panthenol, Sodium Hyaluronate, Allantoin, Carbomer, Phenoxyethanol, Ethylhexylglycerin",
    skinTypeSuitability: {
      trueDry: 70,
      oilyDehydrated: 100,
      severelyDryDehydrated: 75,
      trueOily: 95
    },
    compatibilityScore: 93,
    manufacturingDate: "February 2024",
    discontinuedDate: "Active",
    amazonUrl: "https://www.amazon.in/s?k=Suganda+5%25+Niacinamide+Cica+Gel",
    dermatologistUrl: "#",
    expertReview: "Extremely therapeutic for hyper-sensitive or flushed skin profiles. The gel texture absorbs in seconds without surface residue.",
    expertName: "Dr. Ananya Iyer",
    expertRole: "Senior Dermatologist",
    expertAvatar: "https://images.unsplash.com/photo-1594824813573-246434e3b96f?auto=format&fit=crop&w=150&q=80",
    lovesCount: "14k+ Loves",
    isDiscontinued: false,
    ingredientsDictionary: [
      { ingredient: "Niacinamide", function: "Vitamin B3; helps balance oil production, builds surface lipids, and smooths skin tone." },
      { ingredient: "Centella Asiatica Extract", function: "Concentrated plant extract that targets redness and soothes irritated skin barriers." },
      { ingredient: "Panthenol", function: "Provitamin B5; draws water into the skin and helps soothe surface inflammation." },
      { ingredient: "Sodium Hyaluronate", function: "A stable form of hyaluronic acid that binds water to plump skin layers." }
    ],
    scannerFlags: {
      humectants: ["Propylene Glycol", "Panthenol", "Sodium Hyaluronate"],
      ceramidesAndBarrier: ["Centella Asiatica Extract"],
      irritants: []
    },
    price: 699
  },
  {
    id: "prod_minimalist_maleic",
    brand: "Minimalist",
    name: "Maleic Bond Repair Complex Hair Serum",
    category: "Nourishing Ritual",
    concern: "Water-Repelling Hair, Dry Porous Shafts, Scalp Dehydration",
    quote: '"A pioneering deep-tissue bond repair serum that targets dried hair shafts and scalps with maleic complex."',
    imgUrl: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80",
    ingredients: "Aqua, Maleic Acid, Transglutaminase, Amino Acids Mix, Arginine, Glycine, Alanine, Serine, Phenoxyethanol, Ethylhexylglycerin",
    rawIngredientsList: "Aqua, Maleic Acid, Transglutaminase, Amino Acids Mix, Arginine, Glycine, Alanine, Serine, Phenoxyethanol, Ethylhexylglycerin",
    skinTypeSuitability: {
      trueDry: 90,
      oilyDehydrated: 75,
      severelyDryDehydrated: 95,
      trueOily: 60
    },
    compatibilityScore: 90,
    manufacturingDate: "November 2023",
    discontinuedDate: "Active",
    amazonUrl: "https://www.amazon.in/s?k=Minimalist+Maleic+Bond+Repair+Serum",
    dermatologistUrl: "#",
    expertReview: "Ideal for repairing dry, porous fiber bonds damaged by hard water or direct style heating.",
    expertName: "Dr. Vivek Mehra",
    expertRole: "Dermatological Science Advisor",
    expertAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80",
    lovesCount: "18k+ Loves",
    isDiscontinued: false,
    ingredientsDictionary: [
      { ingredient: "Maleic Acid", function: "An organic compound that helps rebuild broken disulfide bonds caused by heat or chemical styling." },
      { ingredient: "Transglutaminase", function: "An enzyme complex that helps bind structural proteins together within porous hair fibers." },
      { ingredient: "Arginine / Glycine / Alanine", function: "Essential amino acids that reinforce the hair shaft's natural moisture barrier." }
    ],
    scannerFlags: {
      humectants: ["Amino Acids Mix", "Arginine"],
      ceramidesAndBarrier: ["Maleic Acid"],
      irritants: []
    },
    price: 699
  },
  {
    id: "prod_plum_green_tea",
    brand: "Plum",
    name: "Green Tea Mattifying Moisturizer",
    category: "Purifying Ritual",
    concern: "Excess Sebum, Acne Vulgaris, Shiny T-Zone",
    quote: '"A delicate, oil-shunning cream formulated to combat high shine and balance break-out zones using light AHA."',
    imgUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    ingredients: "Aqua, Camellia Sinensis (Green Tea) Leaf Extract, Glycolic Acid, Glycerin, Stearic Acid, Cetearyl Alcohol, Isopropyl Myristate, Phenoxyethanol, Fragrance",
    rawIngredientsList: "Aqua, Camellia Sinensis (Green Tea) Leaf Extract, Glycolic Acid, Glycerin, Stearic Acid, Cetearyl Alcohol, Isopropyl Myristate, Phenoxyethanol, Fragrance",
    skinTypeSuitability: {
      trueDry: 40,
      oilyDehydrated: 80,
      severelyDryDehydrated: 20,
      trueOily: 100
    },
    compatibilityScore: 86,
    manufacturingDate: "August 2023",
    discontinuedDate: "Active",
    amazonUrl: "https://www.amazon.in/s?k=Plum+Green+Tea+Mattifying+Moisturizer",
    dermatologistUrl: "#",
    expertReview: "A lightweight option for daily oil defense, but individuals with hyper-sensitive skin should patch test the glycolic acid first.",
    expertName: "Dr. Priya Sharma",
    expertRole: "Clinical Dermatologist",
    expertAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80",
    lovesCount: "19k+ Loves",
    isDiscontinued: false,
    ingredientsDictionary: [
      { ingredient: "Camellia Sinensis Leaf Extract", function: "Rich in polyphenols to help soothe oil-prone skin inflammation." },
      { ingredient: "Glycolic Acid", function: "Alpha Hydroxy Acid (AHA); gently dissolves dead surface cells to prevent pore blockages." },
      { ingredient: "Isopropyl Myristate", function: "A skin-softening emollient used to thin out creams, though it can trigger breakouts in highly acne-prone pores." }
    ],
    scannerFlags: {
      humectants: ["Glycerin"],
      ceramidesAndBarrier: [],
      irritants: ["Isopropyl Myristate", "Fragrance"]
    },
    price: 470
  },
  {
    id: "prod_drsheth_ceramide_vitc",
    brand: "Dr. Sheth's",
    name: "Ceramide & Vitamin C Brightening Oil-Free Moisturizer",
    category: "Radiance Ritual",
    concern: "Dullness, Post-Inflammatory Hyperpigmentation, Dehydrated Skin",
    quote: '"An illuminating, oil-free moisturizer marrying protective ceramides with a ultra-stable form of Vitamin C."',
    imgUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80",
    ingredients: "Aqua, 3-O-Ethyl Ascorbic Acid, Ceramide NP, Ceramide AP, Ceramide EOP, Propanediol, Glycerin, Sodium Hyaluronate, Cholesterol, Phytosphingosine, Phenoxyethanol",
    rawIngredientsList: "Aqua, 3-O-Ethyl Ascorbic Acid, Ceramide NP, Ceramide AP, Ceramide EOP, Propanediol, Glycerin, Sodium Hyaluronate, Cholesterol, Phytosphingosine, Phenoxyethanol",
    skinTypeSuitability: {
      trueDry: 80,
      oilyDehydrated: 100,
      severelyDryDehydrated: 75,
      trueOily: 90
    },
    compatibilityScore: 92,
    manufacturingDate: "October 2023",
    discontinuedDate: "Active",
    amazonUrl: "https://www.amazon.in/s?k=Dr+Sheths+Ceramide+Vitamin+C+Moisturizer",
    dermatologistUrl: "#",
    expertReview: "Beautiful hybridization that supports skin tone brightening while keeping dry or dehydrated barriers robustly fortified.",
    expertName: "Dr. Ananya Iyer",
    expertRole: "Senior Dermatologist",
    expertAvatar: "https://images.unsplash.com/photo-1594824813573-246434e3b96f?auto=format&fit=crop&w=150&q=80",
    lovesCount: "15k+ Loves",
    isDiscontinued: false,
    ingredientsDictionary: [
      { ingredient: "3-O-Ethyl Ascorbic Acid", function: "A highly stable, non-irritating Vitamin C derivative that helps fade dark spots and boost skin glow." },
      { ingredient: "Ceramide NP / AP / EOP", function: "A protective lipid blend that helps restore skin barrier flexibility and retain water." },
      { ingredient: "Phytosphingosine", function: "A natural lipid compound with mild soothing benefits that helps support barrier recovery." }
    ],
    scannerFlags: {
      humectants: ["Propanediol", "Glycerin", "Sodium Hyaluronate"],
      ceramidesAndBarrier: ["Ceramide NP", "Ceramide AP", "Ceramide EOP", "Cholesterol", "Phytosphingosine"],
      irritants: []
    },
    price: 375
  },
  {
    id: "prod_derma_co_kojic",
    brand: "The Derma Co",
    name: "2% Kojic Acid Face Cream",
    category: "Radiance Ritual",
    concern: "Melasma, Dark Spots, Post-Inflammatory Hyperpigmentation (PIH)",
    quote: '"A dermatologically tested dark-spot correcting cream centered on stable Kojic acid pathways and Alpha Arbutin."',
    imgUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    ingredients: "Aqua, Kojic Acid Dipalmitate, Niacinamide, Glycolic Acid, Glycerin, Caprylic/Capric Triglyceride, Cetyl Alcohol, Alpha Arbutin, Phenoxyethanol, Fragrance",
    rawIngredientsList: "Aqua, Kojic Acid Dipalmitate, Niacinamide, Glycolic Acid, Glycerin, Caprylic/Capric Triglyceride, Cetyl Alcohol, Alpha Arbutin, Phenoxyethanol, Fragrance",
    skinTypeSuitability: {
      trueDry: 85,
      oilyDehydrated: 90,
      severelyDryDehydrated: 70,
      trueOily: 75
    },
    compatibilityScore: 90,
    manufacturingDate: "December 2023",
    discontinuedDate: "Active",
    amazonUrl: "https://www.amazon.in/s?k=The+Derma+Co+2%25+Kojic+Acid+Face+Cream",
    dermatologistUrl: "#",
    expertReview: "Targets melanin transfer pathways cleanly. Highly recommended for fading persistent sun spots, PIH, or mild melasma patches.",
    expertName: "Dr. Vivek Mehra",
    expertRole: "Dermatological Science Advisor",
    expertAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80",
    lovesCount: "16k+ Loves",
    isDiscontinued: false,
    ingredientsDictionary: [
      { ingredient: "Kojic Acid Dipalmitate", function: "A shelf-stable form of Kojic acid that targets pigmentation pathways to help fade dark spots." },
      { ingredient: "Niacinamide", function: "Vitamin B3; helps smooth the appearance of uneven skin tone and supports the lipid barrier." },
      { ingredient: "Alpha Arbutin", function: "A functional brightening ingredient that helps reduce overall melanin activity." }
    ],
    scannerFlags: {
      humectants: ["Glycerin"],
      ceramidesAndBarrier: [],
      irritants: ["Fragrance"]
    },
    price: 499
  }
];

export const CONDITIONS: SkinCondition[] = [
  {
    id: "cond_eczema",
    name: "Atopic Dermatitis (Eczema)",
    category: "Chronic Inflammatory / Genetic Barrier Defect",
    symptoms: "Intense pruritus (itching), red to dark brown dry patches, weeping micro-vesicles, skin cracking, and severe flaking.",
    clinicalOverview: "An inherited or acquired structural defect in the skin's filaggrin protein pathways. This compromise ruins the cell-to-cell brickwork of the stratum corneum, creating massive Transepidermal Water Loss (TEWL) and exposing nerves to topical allergens.",
    compatibleIngredients: ["Ceramides", "Colloidal Oatmeal", "Glycerin", "Squalane", "Panthenol", "Petrolatum"],
    forbiddenIngredients: ["Salicylic Acid (BHA)", "Glycolic Acid (AHA)", "Alcohol Denat.", "Retinol", "Synthetic Fragrances", "Pure Essential Oils"],
    apothecaryRitualNote: "Keep the weekly ritual tracker scaled back to a pure lipid-replenishing focus. Apply heavy emollients and occlusive balms within 3 minutes of bathing while skin cells are still damp to lock in maximum hydration."
  },
  {
    id: "cond_bcc",
    name: "Basal Cell Carcinoma (BCC - Skin Cancer)",
    category: "Malignant Epidermal Neoplasm",
    symptoms: "A pearly, translucent, or waxy bump; a flat, firm, flesh-colored or scar-like lesion; or a recurring sore that bleeds, crusts, and refuses to heal completely.",
    clinicalOverview: "The most frequently diagnosed form of skin malignancy. It develops within the basal cells at the bottom layer of the epidermis, driven by cumulative DNA damage from ultraviolet (UV) solar radiation.",
    compatibleIngredients: ["Zinc Oxide (Non-Nano)", "Titanium Dioxide", "Niacinamide", "Ceramides"],
    forbiddenIngredients: ["Chemical Exfoliating Acids (on active wounds)", "Mechanical Scrub Particle Scrubs", "Unverified Botanical Home Remedies"],
    apothecaryRitualNote: "This requires absolute medical diagnosis and surgical excision by an oncologist. Skincare adjustments are strictly supportive: protect the surrounding areas daily using a high SPF 50+ broad-spectrum mineral sunscreen and preserve tissue calm."
  },
  {
    id: "cond_melanoma",
    name: "Melanoma (Skin Cancer)",
    category: "Malignant Melanocyte Neoplasm",
    symptoms: "Asymmetrical moles, irregular or jagged borders, uneven coloring (shades of black, brown, or blue-grey), diameter wider than 6mm, or an existing spot that evolves rapidly over weeks (The ABCDE Criteria).",
    clinicalOverview: "A highly aggressive cancer that originates in the pigment-producing cells (melanocytes) of the skin. It can spread quickly through the lymphatic system if caught late, primarily triggered by intense, blistering sunburns and UV mutations.",
    compatibleIngredients: ["Broad Spectrum Mineral Sunscreens", "Allantoin", "Centella Asiatica (Soothes post-treatment areas)"],
    forbiddenIngredients: ["Skin Bleaching Creams", "Hydroquinone (without active oncology guidance)", "Astringent Toners"],
    apothecaryRitualNote: "Do not attempt to address or mask changing skin pigmentation spots using cosmetic brightening serums. Immediate professional clinical screening is required."
  },
  {
    id: "cond_acne",
    name: "Acne Vulgaris",
    category: "Sebaceous Gland Disorder",
    symptoms: "Open and closed comedones (blackheads and whiteheads), red inflammatory papules, surface pustules, and deep painful nodulocystic lesions.",
    clinicalOverview: "A multi-faceted condition caused by the overproduction of sebum (driven by hormones), abnormal shedding of skin cells inside the hair follicle pore (hyperkeratinization), and localized overgrowth of Cutibacterium acnes bacteria.",
    compatibleIngredients: ["Salicylic Acid (BHA)", "Zinc PCA", "Niacinamide", "Azelaic Acid", "Benzoyl Peroxide", "Allantoin"],
    forbiddenIngredients: ["Isopropyl Myristate", "Coconut Oil", "Lanolin", "Lauric Acid", "Heavy Stearic Acid Creams"],
    apothecaryRitualNote: "Avoid heavy occlusive creams that block pores. Instead, use light humectant fluids. Use the Weekly Tracker to space out intense chemical exfoliants, preventing over-cleansing that can trigger more oil production."
  },
  {
    id: "cond_contact_derm",
    name: "Contact Dermatitis (Allergic / Irritant)",
    category: "Acute Immune / Chemical Irritation Reaction",
    symptoms: "Sudden localized red rash, swelling, intense burning heat, blisters, and dry scabbing that matches the shape of a recently used external product.",
    clinicalOverview: "Occurs when a chemical directly damages the protective stratum corneum (Irritant variant) or activates a delayed immune response (Allergic variant). Common triggers include harsh skincare acids, volatile perfume chemicals like Limonene, or cosmetic preservatives.",
    compatibleIngredients: ["Centella Asiatica (Cica)", "Pure Panthenol", "Allantoin", "Petrolatum", "Aloe Barbadensis Fluid"],
    forbiddenIngredients: ["Ascorbic Acid (Vitamin C)", "Retinol", "Glycolic Acid", "Fragrance", "Denatured Alcohols"],
    apothecaryRitualNote: "Immediately stop using all complex active formulas. Strip your daily routine down to lukewarm water washes and basic, single-ingredient barrier protectants until the skin's surface inflammation fully subsides."
  },
  {
    id: "cond_rosacea",
    name: "Rosacea",
    category: "Vascular & Neuroinflammatory Disorder",
    symptoms: "Persistent redness across the center of the face, visible broken blood vessels (telangiectasia), hot flushing, and small, red pus-filled bumps that resemble acne.",
    clinicalOverview: "A chronic condition involving facial blood vessel instability and an overactive local immune response. It is frequently triggered by external heat, spicy foods, UV light, or harsh skincare products.",
    compatibleIngredients: ["Azelaic Acid", "Niacinamide", "Centella Asiatica", "Green Tea Extract", "Panthenol"],
    forbiddenIngredients: ["Glycolic Acid", "Salicylic Acid", "Witch Hazel Extract", "Menthol", "Peppermint Oil", "Coarse Physical Face Scrubs"],
    apothecaryRitualNote: "Keep the Weekly Tracker simple and predictable. Avoid using hot water on your face, and use gentle, non-foaming cream cleansers to preserve your skin's natural moisture barrier."
  },
  {
    id: "cond_psoriasis",
    name: "Psoriasis",
    category: "Autoimmune Hyper-Proliferative Disease",
    symptoms: "Thick, sharply defined red plaques covered with silvery, flaky scales, commonly appearing on the scalp, elbows, and knees, often accompanied by dry, cracked skin that may bleed.",
    clinicalOverview: "An autoimmune condition where T-cells mistakenly trigger skin cells to grow at an accelerated rate. Instead of shedding over weeks, skin cells build up on the surface in just days, forming thick, un-keratinized plaques.",
    compatibleIngredients: ["Salicylic Acid (low percentage for scale removal)", "Ceramides", "Urea", "Shea Butter", "Squalane"],
    forbiddenIngredients: ["High-percentage Alcohol Astringents", "Aggressive Mechanical Chemical Peels", "Sensitizing Synthetic Dyes"],
    apothecaryRitualNote: "Focus on balancing targeted, gentle scale softening (using mild keratolytic agents like low-dose Urea or Salicylic Acid) with rich, skin-identical emollient creams to maintain flexibility and comfort in the affected areas."
  },
  {
    id: "cond_melasma",
    name: "Melasma",
    category: "Melanocytic Hyperfunctional Hyperpigmentation",
    symptoms: "Symmetrical, sharply demarcated macular hyperpigmentation varying from light brown to dark grey-brown, predominantly appearing across the malar cheeks, forehead, upper lip, and chin.",
    clinicalOverview: "A complex condition driven by biological hyper-activation of melanocytes (pigment cells). It is primarily triggered by ultraviolet (UV) and visible blue light exposure, fluctuating hormonal states (such as pregnancy or oral contraceptives), and genetic susceptibility.",
    compatibleIngredients: ["Azelaic Acid", "Alpha Arbutin", "Kojic Acid", "Tranexamic Acid", "Niacinamide", "Zinc Oxide (Broad Spectrum)"],
    forbiddenIngredients: ["High-percentage Glycolic Acid Peels (without neutralizers)", "Essential Oils", "Aggressive Physical Scrubs", "Hydroquinone (long-term unmonitored use)"],
    apothecaryRitualNote: "UV light and visible heat trigger melasma pigment production. Ensure your Morning Tracker highlights a dedicated mineral sunscreen, and incorporate Tyrosinase inhibitors into your Evening Tracker to help calm pigment pathways."
  },
  {
    id: "cond_pityrosporum",
    name: "Malassezia Folliculitis (Fungal Acne)",
    category: "Fungal / Microbial Dysbiosis",
    symptoms: "Monomorphic (identically sized), itchy, small dome-shaped pustules and papules clustered strictly along the forehead, hairline, chest, upper back, and shoulders.",
    clinicalOverview: "Not a form of true acne, but an opportunistic infection of the hair follicles caused by an overgrowth of Malassezia yeast. This yeast thrives in hot, humid conditions and feeds heavily on human sebum and fatty lipids found in standard cosmetic creams.",
    compatibleIngredients: ["Salicylic Acid (BHA)", "Zinc PCA", "Niacinamide", "Polysorbate-20 (limited)", "Sulfur"],
    forbiddenIngredients: ["Galactomyces Ferment Filtrate", "Polysorbate-80", "Isopropyl Palmitate", "Lauric Acid", "Stearic Acid", "Shea Butter", "Fermented Oils"],
    apothecaryRitualNote: "Standard moisturizers with heavy plant oils feed fungal acne breakouts. Ensure your search filter routes affected users strictly toward oil-free, lightweight humectant gels."
  },
  {
    id: "cond_pih",
    name: "Post-Inflammatory Hyperpigmentation (PIH)",
    category: "Reactive Melanosis",
    symptoms: "Flat patches of dark brown, black, or deep tan discoloration left behind exactly where an inflammatory skin lesion (like an acne cyst, burn, or scratch) previously healed.",
    clinicalOverview: "An acquired pigment response. Localized cutaneous inflammation triggers a surge of inflammatory mediators (like prostanoids), which over-stimulate nearby melanocytes to produce and drop excess melanin into the surrounding epidermal cells.",
    compatibleIngredients: ["Alpha Arbutin", "Tranexamic Acid", "Niacinamide", "Glycolic Acid", "Centella Asiatica", "Vitamin C (Ascorbic Acid)"],
    forbiddenIngredients: ["Picking/Squeezing active lesions", "Harsh Astringents", "Over-exfoliation (which triggers more pigment inflammation)"],
    apothecaryRitualNote: "PIH clears quickest when inflammation is stopped early. Focus on soothing active blemishes using Centella or Zinc before applying strong brightening acids to darker spots."
  },
  {
    id: "cond_perioral",
    name: "Perioral Dermatitis",
    category: "Inflammatory Erythematous Disorder",
    symptoms: "Clusters of tiny, painful or itchy red papules and pustules appearing around the mouth, nose, and occasionally eyes, characteristically leaving a clear, untouched ring of normal skin immediately bordering the lip line.",
    clinicalOverview: "An inflammatory condition that can look like acne or rosacea. Its exact cause is unknown, but it is frequently triggered or worsened by topical corticosteroid creams, heavy occlusive moisturizers (like petrolatum-heavy slugging), and synthetic fragrances.",
    compatibleIngredients: ["Zinc Oxide", "Centella Asiatica", "Allantoin", "Glycerin", "Niacinamide (low-dose)"],
    forbiddenIngredients: ["Topical Steroids", "Heavy Petrolatum Balms", "Heavy Mineral Oils", "Sodium Lauryl Sulfate (SLS)", "Fluoride Toothpaste (spillovers)"],
    apothecaryRitualNote: "Avoid heavy slugging methods around the mouth. Simplify your evening routine to a light humectant fluid and a thin, calming layer of zinc oxide cream until the skin clears."
  },
  {
    id: "cond_seborrheic",
    name: "Seborrheic Dermatitis",
    category: "Inflammatory Scaling Erythema",
    symptoms: "Greasy, yellowish, oily flakes or scales sitting on top of red, itchy patches of skin concentrated across high-sebum areas like the scalp, eyebrows, sides of the nose, and ears.",
    clinicalOverview: "A chronic inflammatory condition linked to an immune reaction toward Malassezia yeast breakdown products on the skin. The yeast splits sebum into irritating free fatty acids, causing rapid cell shedding and scaling.",
    compatibleIngredients: ["Salicylic Acid", "Zinc PCA", "Tea Tree Extract", "Aloe Barbadensis Leaf Juice", "Niacinamide"],
    forbiddenIngredients: ["Heavy Oleic Acid Oils (Olive Oil)", "Thick Emollient Creams", "Isopropyl Myristate", "Lanolin"],
    apothecaryRitualNote: "Keep oily scales clear using gentle chemical exfoliants like Salicylic Acid. Avoid treating flakiness with heavy face oils, which can provide more fuel for the underlying yeast irritation."
  },
  {
    id: "cond_keratosis",
    name: "Keratosis Pilaris (KP)",
    category: "Follicular Hyperkeratinization Disorder",
    symptoms: "Rough, sand-paper textured, tiny 'goosebump-like' bumps often surrounded by mild redness, typically found on the outer upper arms, thighs, and cheeks.",
    clinicalOverview: "A benign genetic condition where the skin overproduces keratin. This excess protein builds up and forms a hard plug inside the hair follicle opening, blocking the hair shaft and causing a rough bump.",
    compatibleIngredients: ["Salicylic Acid (BHA)", "Lactic Acid (AHA)", "Urea", "Glycerin", "Shea Butter"],
    forbiddenIngredients: ["Pumice Stones", "Coarse Physical Loofahs", "Drying Bar Soaps"],
    apothecaryRitualNote: "Physical scrubbing can irritate the skin and make KP bumps redder. Use chemical exfoliants like Lactic Acid or Urea in your Weekly Tracker to help naturally dissolve keratin plugs while keeping skin hydrated."
  },
  {
    id: "cond_pie",
    name: "Post-Inflammatory Erythema (PIE)",
    category: "Vascular Cutaneous Micro-Trauma",
    symptoms: "Flat, pink, red, or purple spots that remain after an acne breakout heals. Unlike pigmentation, these spots briefly turn white or disappear when pressed firmly with a clear finger or glass slide (blanching).",
    clinicalOverview: "Not a melanin pigment issue, but damage to the delicate capillary blood vessels near the skin surface during inflammation. The vessels dilate or leak blood, leaving a stagnant red mark under the skin.",
    compatibleIngredients: ["Centella Asiatica", "Niacinamide", "Panthenol", "Allantoin", "Azelaic Acid", "Tranexamic Acid"],
    forbiddenIngredients: ["Strong Alpha Hydroxy Acids (AHAs)", "Aggressive Facial Massages", "Alcohol-based Toners"],
    apothecaryRitualNote: "Since PIE is a vascular condition, focus on using soothing ingredients like Centella and Panthenol to help calm blood vessels, rather than using strong skin-peeling acids."
  },
  {
    id: "cond_solar_lentigo",
    name: "Solar Lentigines (Sun Spots)",
    category: "Actinic Macular Melanogenesis",
    symptoms: "Sharply defined, flat, circular or oval spots ranging from light tan to dark brown, appearing on sun-exposed areas like the back of the hands, forearms, and face.",
    clinicalOverview: "Commonly known as sun spots or age spots, these patches are caused by localized increases in active melanocytes and melanin production. They are a direct response to chronic exposure to ultraviolet radiation over several years.",
    compatibleIngredients: ["Retinol", "Vitamin C (Ascorbic Acid)", "Alpha Arbutin", "Glycolic Acid", "Kojic Acid", "Broad-Spectrum SPF 50+"],
    forbiddenIngredients: ["Unprotected Sun Exposure", "Mercury-tainted Brightening Creams"],
    apothecaryRitualNote: "Sun spots can darken quickly with even brief sun exposure. Use your Morning Tracker to ensure consistent, daily sunscreen application, even on cloudy or indoor days."
  },
  {
    id: "cond_ichthyosis",
    name: "Ichthyosis Vulgaris",
    category: "Genetic Desquamation Retention Disease",
    symptoms: "Severely dry, rough skin characterized by fine, polygonal, fish-like scales ranging from white to dark brown, most prominent on the shins and extensor surfaces.",
    clinicalOverview: "A genetic skin condition caused by a loss-of-function mutation in the filaggrin gene. This mutation disrupts the skin's natural shedding process, leading to a severe lack of natural moisturizing factors (NMFs) and a buildup of dry scales.",
    compatibleIngredients: ["Urea (High Concentration)", "Lactic Acid", "Ceramides", "Squalane", "Glycerin", "Petrolatum"],
    forbiddenIngredients: ["Alcohol Denat.", "Harsh Foaming Cleansers", "Cold, Unhumidified Air"],
    apothecaryRitualNote: "This condition requires rich barrier repair support. Apply thick, high-urea lotions to damp skin right after bathing to help break down scaly buildup and hold onto moisture."
  },
  {
    id: "cond_miliaria",
    name: "Miliaria Rubra (Heat Rash / Prickly Heat)",
    category: "Eccrine Sweat Gland Occlusion",
    symptoms: "Outbreaks of tiny, itchy, red inflammatory bumps and micro-vesicles accompanied by an intense stinging or prickly sensation, typically found on the neck, chest, and skin folds.",
    clinicalOverview: "Occurs when sweat ducts become blocked due to excessive sweating in hot, humid climates. Sweat leaks into the surrounding skin tissue instead of evaporating, leading to localized inflammation.",
    compatibleIngredients: ["Calamine", "Zinc Oxide", "Aloe Barbadensis Leaf Juice", "Allantoin", "Colloidal Oatmeal"],
    forbiddenIngredients: ["Heavy Occlusive Balms", "Mineral Oil Creams", "Thick Plant Butters (Coconut/Shea)"],
    apothecaryRitualNote: "Heavy, oily products can further block sweat ducts during hot weather. Stick to light, water-based calamine lotions or aloe vera fluids to help cool skin inflammation."
  }
];

export const INGREDIENT_DETAILS: Record<string, string> = {
  'Panthenol': 'Provitamin B5; an outstanding soothing humectant that penetrates deeply to accelerate tissue repair and reinforce safety barriers.',
  'Zinc PCA': 'A zinc salt of pyrrolidone carboxylic acid that regulates sebum production, restricts acne growth, and offers pristine oily-skin clarity.',
  'Ceramide NP': 'An key physiological lipid vital to building a watertight cellular shield, crucial for atopic dermatitis recovery.',
  'Urea': 'An organic moisturizing factor that gently softens dry hard skin patches while keeping surface scale build-ups down safely.',
  'Sodium Hyaluronate': 'A highly bioavailable water-binding molecule that plumps the epiderm contours and instantly quenches dry cells.',
  'Phospholipids': 'Naturally derived fatty acids that encapsulate moisture molecules, building a protective shield around sensitive skin.',
  'Isododecane': 'A lightweight skin emollient that delivers a silky cosmetic glide without adding heavy or comedogenic grease.',
  'Allantoin': 'An botanical active that speeds up surface healing, reduces irritation, and hydrates sensitive or wind-burnt zones.',
  'Glycerin': 'A classic skin-identical humectant that pulls moisture from deeper layers, preserving structural skin hydration.',
  'Squalane': 'A stable, skin-compatible botanical oil that nourishes the epidermal barrier, mimics natural sebum, and leaves a beautiful glow.',
  'Azelaic Acid': 'A clinical active that targets skin redness (Pitta fire), fades blemishes, and controls acne bacteria without barrier harm.',
  'Centella Asiatica': 'Also known as Cica or Gotu Kola, an ancient herb heavily praised for calming immediate contact irritation and healing wounds.',
  'Colloidal Oatmeal': 'A finely milled oat powder containing beta-glucans and avenanthramides that relieve itching and calm compromised barriers.'
};
