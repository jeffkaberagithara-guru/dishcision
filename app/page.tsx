'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BottomNav } from '@/components/layout/bottom-nav';
import { BigMealReveal } from '@/components/today/big-meal-reveal';
import { useFoodStore } from '@/lib/store/use-food-store';
import type { DecisionResult, MealType } from '@/lib/types';
import { Shuffle, Zap, Sunrise, Sun, Moon } from 'lucide-react';

const MEAL_CHOICES: { type: Extract<MealType, 'breakfast' | 'lunch' | 'dinner'>; label: string; icon: typeof Sunrise }[] = [
  { type: 'breakfast', label: 'Breakfast', icon: Sunrise },
  { type: 'lunch', label: 'Lunch', icon: Sun },
  { type: 'dinner', label: 'Dinner', icon: Moon },
];

export default function HomePage() {
  const { isLoaded, makeNewDecision, acceptCurrentDecision } = useFoodStore();

  const [hasRevealed, setHasRevealed] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [decision, setDecision] = useState<DecisionResult | null>(null);
  const [mealType, setMealType] = useState<Extract<MealType, 'breakfast' | 'lunch' | 'dinner'>>(() => {
    // Default to the current meal period — the picker always lets you change it.
    const h = new Date().getHours();
    if (h < 10) return 'breakfast';
    if (h < 15) return 'lunch';
    return 'dinner';
  });
  const shownIdsRef = useRef<Set<string>>(new Set());

  // Fast, one-tap balanced surprise — never repeats within a session.
  const generate = useCallback(() => {
    setIsThinking(true);
    setHasRevealed(true);
    setIsAccepted(false);
    // Defer so the thinking pulse is visible before the synchronous engine returns
    requestAnimationFrame(() => {
      const exclusions = Array.from(shownIdsRef.current);
      const result = makeNewDecision({ mealType, excludedMealIds: exclusions });
      if (result && result.meal && result.meal.id) {
        shownIdsRef.current.add(result.meal.id);
        setDecision(result);
      }
      setIsThinking(false);
    });
  }, [makeNewDecision, mealType]);

  const handleCookThis = useCallback(() => {
    if (!decision) return;
    acceptCurrentDecision(true);
    setIsAccepted(true);
    // Start fresh so the next session can recommend anything again (recency prevents repeats)
    shownIdsRef.current.clear();
  }, [acceptCurrentDecision, decision]);

  const resetToIdle = useCallback(() => {
    setHasRevealed(false);
    setIsThinking(false);
    setIsAccepted(false);
    setDecision(null);
    shownIdsRef.current.clear();
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between">
        <Header />
        <main className="container-editorial py-32 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-serif italic text-2xl text-[#6E6A61]"
          >
            Opening your pantry...
          </motion.p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col pb-24 md:pb-0">
      <Header />

      <main className="flex-1 w-full hero-veil">
        <div className="container-editorial max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[85vh] py-10 sm:py-16 text-center">
          <AnimatePresence mode="wait">
            {!hasRevealed ? (
              /* ------------------- IDLE: the big Surprise Me ------------------- */
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center gap-8 sm:gap-12"
              >
                <div className="space-y-4">
                  <h1 className="font-hero text-5xl sm:text-6xl md:text-7xl text-[#171714]">
                    What&apos;s cooking
                    <span className="italic text-[#8A9B84] block">today?</span>
                  </h1>
                  <p className="font-serif italic text-xl sm:text-2xl text-[#6E6A61]">
                    Pick your meal, then get a balanced surprise.
                  </p>
                </div>

                {/* Meal-type picker — the engine only suggests foods for this meal */}
                <div className="w-full max-w-xl" role="radiogroup" aria-label="Choose a meal">
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {MEAL_CHOICES.map((choice) => {
                      const Icon = choice.icon;
                      const isActive = mealType === choice.type;
                      return (
                        <button
                          key={choice.type}
                          role="radio"
                          aria-checked={isActive}
                          onClick={() => setMealType(choice.type)}
                          className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 px-4 py-6 sm:py-8 transition-all duration-200 cursor-pointer
                            ${isActive
                              ? 'border-[#8A9B84] bg-[#8A9B84]/10 text-[#171714] shadow-sm'
                              : 'border-[#DCD5C9] bg-white text-[#6E6A61] hover:border-[#8A9B84]/60 hover:text-[#171714]'}`}
                        >
                          <Icon className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${isActive ? 'text-[#8A9B84]' : 'text-[#8A9B84]/60 group-hover:text-[#8A9B84]'}`} />
                          <span className="font-serif text-lg sm:text-xl font-semibold">
                            {choice.label}
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.18em] font-sans font-semibold text-[#6E6A61]/70">
                            {isActive ? 'Selected' : 'Choose'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <motion.button
                  onClick={generate}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group relative grid place-items-center size-52 sm:size-64 rounded-full bg-[#171714] text-[#F7F3EC] shadow-2xl cursor-pointer focus-visible:outline-4 focus-visible:outline-[#8A9B84]"
                  aria-label={`Surprise me with a ${mealType} meal`}
                >
                  <span className="absolute inset-0 rounded-full border-2 border-[#8A9B84]/40" />
                  <span className="flex flex-col items-center gap-2 px-6">
                    <Shuffle className="w-10 h-10 sm:w-14 sm:h-14 transition-transform duration-500 group-hover:rotate-180" />
                    <span className="font-serif text-2xl sm:text-3xl font-semibold">
                      Surprise
                      <span className="block text-[#8A9B84]">Me</span>
                    </span>
                  </span>
                </motion.button>

                <p className="text-base sm:text-lg text-[#6E6A61] font-sans flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#8A9B84]" />
                  {mealType === 'breakfast' ? 'Breakfast menu' : `${mealType === 'lunch' ? 'Lunch' : 'Dinner'} menu`}
                  {' · '}Balanced{mealType === 'breakfast' ? ' · ' : ' · '}Never repeats
                </p>

                {/* Minimal secondary access */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-sm font-medium text-[#6E6A61]">
                  <Link href="/app/my-food" className="px-4 py-2 rounded-full border border-[#DCD5C9] bg-white hover:border-[#8A9B84] hover:text-[#171714] transition-colors">
                    My Foods
                  </Link>
                  <Link href="/app/plan" className="px-4 py-2 rounded-full border border-[#DCD5C9] bg-white hover:border-[#8A9B84] hover:text-[#171714] transition-colors">
                    Plan
                  </Link>
                  <Link href="/app/shopping" className="px-4 py-2 rounded-full border border-[#DCD5C9] bg-white hover:border-[#8A9B84] hover:text-[#171714] transition-colors">
                    Shopping
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* ------------------- RESULT: the balanced meal ------------------- */
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="w-full space-y-6"
              >
                {isThinking || !decision ? (
                  <div className="w-full card-modern p-10 sm:p-16 flex flex-col items-center justify-center gap-6 min-h-[20rem]">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="grid place-items-center size-20 rounded-full bg-[#171714] text-[#8A9B84]"
                    >
                      <Shuffle className="w-10 h-10" />
                    </motion.div>
                    <p className="font-serif italic text-2xl text-[#6E6A61]">
                      Deciding a balanced meal...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] uppercase tracking-[0.25em] text-[#8A9B84] font-sans font-semibold">
                        {mealType === 'breakfast' ? "Here's your breakfast" : mealType === 'lunch' ? "Here's your lunch" : "Here's your dinner"}
                      </span>
                      <button
                        onClick={resetToIdle}
                        className="text-sm font-medium text-[#6E6A61] hover:text-[#171714] px-3 py-1.5 rounded-full border border-[#DCD5C9] bg-white transition-colors cursor-pointer"
                      >
                        Start over
                      </button>
                    </div>

                    <BigMealReveal
                      decision={decision}
                      onCookThis={handleCookThis}
                      onAgain={generate}
                      isAccepted={isAccepted}
                    />

                    {isAccepted && (
                      <p className="text-sm text-[#6E6A61] font-sans">
                        Nice one — tap{' '}
                        <span className="font-semibold text-[#171714]">Plan</span> to build your full
                        day, or make another choice below.
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
