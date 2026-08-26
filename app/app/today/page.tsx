'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { TheatricalReveal } from '@/components/today/theatrical-reveal';
import { MealResultCard } from '@/components/today/meal-result-card';
import { UseWhatIHaveModal } from '@/components/today/use-what-i-have-modal';
import { useFoodStore } from '@/lib/store/use-food-store';
import { Sparkles, SlidersHorizontal, ArrowRight, Check } from 'lucide-react';

export default function TodayPage() {
  const {
    currentDecision,
    foodItems,
    makeNewDecision,
    acceptCurrentDecision,
    rejectCurrentDecisionNotToday,
    rejectCurrentDecisionNotAvailable,
    settings,
    updateSettings,
    isLoaded,
  } = useFoodStore();

  const [isRevealing, setIsRevealing] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'dinner' | 'lunch' | 'breakfast'>('dinner');
  const [showAcceptedToast, setShowAcceptedToast] = useState(false);

  const handleTriggerDecision = (customFoodIds?: string[]) => {
    setIsRevealing(true);
    setShowAcceptedToast(false);
    makeNewDecision({
      mealType: selectedMealType,
      customAvailableFoodIds: customFoodIds,
      keepItEasy: settings.keepItEasyDefault,
    });
  };

  const handleRevealComplete = () => {
    setIsRevealing(false);
  };

  const handleCookThis = (hadLeftovers: boolean) => {
    acceptCurrentDecision(hadLeftovers);
    setShowAcceptedToast(true);
  };

  const handleNotToday = () => {
    setIsRevealing(true);
    rejectCurrentDecisionNotToday();
  };

  const handleNotAvailable = () => {
    setIsRevealing(true);
    rejectCurrentDecisionNotAvailable();
  };

  const handleToggleKeepItEasy = () => {
    const nextVal = !settings.keepItEasyDefault;
    updateSettings({ keepItEasyDefault: nextVal });
    setIsRevealing(true);
    makeNewDecision({
      mealType: selectedMealType,
      keepItEasy: nextVal,
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between">
        <Header />
        <main className="container-editorial py-24 text-center">
          <p className="font-serif italic text-xl text-[#6E6A61]">
            Consulting your pantry...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between pb-20 md:pb-0">
      <Header />

      <main className="container-editorial py-12 md:py-20 max-w-4xl space-y-8">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-semibold text-[#8A9B84] block">
              TODAY&apos;S DECISION ENGINE
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#171714] font-normal leading-tight">
              What Are We Cooking?
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-[#6E6A61]">
              Strictly from your pantry library. Zero recipe overload.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {(['dinner', 'lunch', 'breakfast'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedMealType(type);
                  setIsRevealing(true);
                  makeNewDecision({ mealType: type });
                }}
                className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider rounded-[2px] border transition-all cursor-pointer ${
                  selectedMealType === type
                    ? 'bg-[#171714] text-[#F7F3EC] border-[#171714] font-semibold'
                    : 'bg-white text-[#6E6A61] border-[#DCD5C9] hover:text-[#171714]'
                }`}
              >
                {type}
              </button>
            ))}

            <button
              onClick={() => setIsStockModalOpen(true)}
              className="px-3 py-1.5 text-xs font-sans uppercase tracking-wider bg-white text-[#6E6A61] hover:text-[#171714] border border-[#DCD5C9] rounded-[2px] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Use What I Have</span>
            </button>
          </div>
        </div>

        {/* Accepted Toast Notification */}
        {showAcceptedToast && (
          <div className="p-4 bg-[#8A9B84]/15 border border-[#8A9B84]/40 rounded-[2px] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-[#54684E]" />
              <span className="text-xs font-sans font-medium text-[#171714]">
                Meal logged to history! Tomorrow&apos;s breakfast will prioritize leftover readiness.
              </span>
            </div>
            <Link
              href="/app/plan"
              className="text-xs font-sans uppercase tracking-wider text-[#54684E] hover:underline font-semibold flex items-center gap-1 shrink-0"
            >
              <span>View Whole-Day Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Core Interaction Screen */}
        <div className="pt-2">
          {isRevealing ? (
            <TheatricalReveal onComplete={handleRevealComplete} durationMs={1100} />
          ) : currentDecision ? (
            <MealResultCard
              decision={currentDecision}
              onCookThis={handleCookThis}
              onDishcisionAgain={() => handleTriggerDecision()}
              onNotToday={handleNotToday}
              onNotAvailable={handleNotAvailable}
              onToggleKeepItEasy={handleToggleKeepItEasy}
              isKeepItEasyActive={settings.keepItEasyDefault}
            />
          ) : (
            <div className="p-12 bg-white border border-[#DCD5C9] rounded-[2px] text-center space-y-4">
              <h2 className="font-serif text-2xl text-[#171714]">Ready to decide?</h2>
              <Button
                variant="primary"
                size="hero"
                onClick={() => handleTriggerDecision()}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#8A9B84]" />
                MAKE MY DISHCISION
              </Button>
            </div>
          )}
        </div>
      </main>

      <UseWhatIHaveModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        foodItems={foodItems}
        onDecideWithSelected={(selectedIds) => handleTriggerDecision(selectedIds)}
      />

      <Footer />
      <BottomNav />
    </div>
  );
}
