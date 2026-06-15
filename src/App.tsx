import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, UserProfile, QuizState } from './types';
import Welcome from './components/Welcome';
import YourSkincareSanctuary from './components/YourSkincareSanctuary';
import PersonalizeYourSanctuary from './components/PersonalizeYourSanctuary';
import ProductInsights from './components/ProductInsights';
import SkinTypeQuiz from './components/SkinTypeQuiz';
import DailyRitualAlignment from './components/DailyRitualAlignment';
import IngredientScanner from './components/IngredientScanner';
import ClinicalDiagnostics from './components/ClinicalDiagnostics';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Sweet Agnes',
  gender: 'Female',
  experienceLevel: 'Regular User',
  favoriteBrands: ['CeraVe', 'The Ordinary'],
};

const DEFAULT_QUIZ: QuizState = {
  faceFeel: null,
  sensitivityLevel: 3,
  bodyTexture: null,
  bodyHydration: null,
  lipFeel: null,
  completed: false,
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod_minimalist_b5');
  
  // Transition directions tracking state for prototype animations
  const [transitionType, setTransitionType] = useState<'push' | 'push_back' | 'slide_up' | 'none'>('none');

  // Hydrate custom user settings comfortably from localStorage
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [quizState, setQuizState] = useState<QuizState>(DEFAULT_QUIZ);

  useEffect(() => {
    const savedProfile = localStorage.getItem('project_agnes_profile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Failed to parse cached profile settings', e);
      }
    }

    const savedQuiz = localStorage.getItem('project_agnes_quiz');
    if (savedQuiz) {
      try {
        setQuizState(JSON.parse(savedQuiz));
      } catch (e) {
        console.error('Failed to parse cached quiz outcomes', e);
      }
    }
  }, []);

  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    localStorage.setItem('project_agnes_profile', JSON.stringify(updated));
    // Transition specification: push_back to Home
    setTransitionType('push_back');
    setCurrentScreen('sanctuary');
  };

  const handleSaveQuizResults = (updated: QuizState) => {
    setQuizState(updated);
    localStorage.setItem('project_agnes_quiz', JSON.stringify(updated));
  };

  const handleReset = () => {
    localStorage.removeItem('project_agnes_profile');
    localStorage.removeItem('project_agnes_quiz');
    setUserProfile(DEFAULT_PROFILE);
    setQuizState(DEFAULT_QUIZ);
    setTransitionType('none');
    setCurrentScreen('welcome');
  };

  // Navigations with exact prototype motion specs
  const navigateToSanctuary = (type: 'push_back' | 'none') => {
    setTransitionType(type);
    setCurrentScreen('sanctuary');
  };

  const navigateToQuiz = () => {
    setTransitionType('push');
    setCurrentScreen('quiz');
  };

  const navigateToProduct = (productId?: string) => {
    if (productId) {
      setSelectedProductId(productId);
    }
    setTransitionType('push');
    setCurrentScreen('product');
  };

  const navigateToPersonalize = () => {
    setTransitionType('slide_up');
    setCurrentScreen('personalize');
  };

  const navigateToRitual = () => {
    setTransitionType('push');
    setCurrentScreen('ritual');
  };

  const navigateToScan = () => {
    setTransitionType('push');
    setCurrentScreen('scan');
  };

  const navigateToDiagnostics = () => {
    setTransitionType('push');
    setCurrentScreen('diagnostics');
  };

  // Get dynamic framer-motion specifications based on transition type requested
  const getVariants = () => {
    switch (transitionType) {
      case 'push':
        return {
          initial: { x: '100vw', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '-100vw', opacity: 0 },
        };
      case 'push_back':
        return {
          initial: { x: '-100vw', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '100vw', opacity: 0 },
        };
      case 'slide_up':
        return {
          initial: { y: '100vh', opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: '-100vh', opacity: 0 },
        };
      case 'none':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  const motionVariants = getVariants();

  return (
    <div className="min-h-screen bg-[#F9F6F2] overflow-x-hidden selection:bg-[#8B9474]/20 text-[#1C1C1C]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={motionVariants}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className="w-full min-h-screen"
        >
          {currentScreen === 'welcome' && (
            <Welcome onEnter={() => navigateToSanctuary('none')} />
          )}

          {currentScreen === 'sanctuary' && (
            <YourSkincareSanctuary
              userProfile={userProfile}
              quizState={quizState}
              onNavigateToQuiz={navigateToQuiz}
              onNavigateToProduct={navigateToProduct}
              onNavigateToPersonalize={navigateToPersonalize}
              onNavigateToScan={navigateToScan}
              onNavigateToRitual={navigateToRitual}
              onNavigateToDiagnostics={navigateToDiagnostics}
              onReset={handleReset}
            />
          )}

          {currentScreen === 'scan' && (
            <IngredientScanner
              userProfile={userProfile}
              onNavigateHome={() => navigateToSanctuary('push_back')}
            />
          )}

          {currentScreen === 'personalize' && (
            <PersonalizeYourSanctuary
              userProfile={userProfile}
              onSaveProfile={handleSaveProfile}
              onNavigateHome={() => navigateToSanctuary('push_back')}
            />
          )}

          {currentScreen === 'product' && (
            <ProductInsights
              productId={selectedProductId}
              userProfile={userProfile}
              quizState={quizState}
              onNavigateHome={() => navigateToSanctuary('push_back')}
            />
          )}

          {currentScreen === 'quiz' && (
            <SkinTypeQuiz
              quizState={quizState}
              onSaveQuizResults={handleSaveQuizResults}
              onNavigateHome={() => navigateToSanctuary('push_back')}
            />
          )}

          {currentScreen === 'ritual' && (
            <DailyRitualAlignment
              userProfile={userProfile}
              onNavigateHome={() => navigateToSanctuary('push_back')}
            />
          )}

          {currentScreen === 'diagnostics' && (
            <ClinicalDiagnostics
              userProfile={userProfile}
              onNavigateHome={() => navigateToSanctuary('push_back')}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
