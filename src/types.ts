export type Screen = 'welcome' | 'sanctuary' | 'personalize' | 'product' | 'quiz' | 'ritual' | 'scan' | 'diagnostics';

export interface UserProfile {
  name: string;
  gender: 'Female' | 'Male' | 'Non-binary' | 'Prefer not to say';
  experienceLevel: 'Complete Novice' | 'Starting Out' | 'Regular User' | 'Expert';
  favoriteBrands: string[];
}

export interface QuizState {
  faceFeel: 'Dry' | 'Oily' | 'Sensitive' | 'Normal' | null;
  sensitivityLevel: number; // 1 to 10
  bodyTexture: 'Smooth like Sand' | 'Rough like Coral' | null;
  bodyHydration: 'Plump like a Mango' | 'Thirsty for Water' | null;
  lipFeel: 'Flaky' | 'Chapped' | 'Perfectly Soft' | null;
  completed: boolean;
  resultTitle?: string;
  resultDescription?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  quote: string;
  imgUrl: string;
  ingredients: string;
  compatibilityScore: number;
  manufacturingDate: string;
  discontinuedDate: string;
  amazonUrl: string;
  dermatologistUrl: string;
  expertReview: string;
  expertName: string;
  expertRole: string;
  expertAvatar: string;
  lovesCount: string;
  isDiscontinued: boolean;
  brand?: string;
  concern?: string;
  skinTypeSuitability?: {
    trueDry: number;
    oilyDehydrated: number;
    severelyDryDehydrated: number;
    trueOily: number;
  };
  rawIngredientsList?: string;
  ingredientsDictionary?: { ingredient: string; function: string }[];
  scannerFlags?: {
    humectants: string[];
    ceramidesAndBarrier: string[];
    irritants: string[];
  };
  price?: number;
}

export interface SkinCondition {
  id: string;
  name: string;
  category: string;
  symptoms: string;
  clinicalOverview: string;
  compatibleIngredients: string[];
  forbiddenIngredients: string[];
  apothecaryRitualNote: string;
}
