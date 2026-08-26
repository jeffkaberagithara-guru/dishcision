'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MealResultCard } from '@/components/today/meal-result-card';
import { TheatricalReveal } from '@/components/today/theatrical-reveal';
import { useFoodStore } from '@/lib/store/use-food-store';
import { MealType } from '@/lib/types';
import {
  Coffee,
  Sun,
  Moon,
  CalendarDays,
  Sparkles,
  Check,
  X,
  Search,
  Utensils,
  ChevronDown,
  ChevronUp,
  Package,
  Beef,
  Leaf,
  Bean,
  Salad,
  Apple,
  ShoppingCart,
} from 'lucide-react';

type Step = 'type' | 'foods' | 'result' | 'fullday';

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  staple: { label: 'STAPLES', icon: Package },
  protein: { label: 'PROTEINS', icon: Beef },
  vegetable: { label: 'VEGETABLES', icon: Leaf },
  legume: { label: 'LEGUMES', icon: Bean },
  salad: { label: 'SALADS', icon: Salad },
  fruit: { label: 'FRUIT', icon: Apple },
  beverage: { label: 'BEVERAGES', icon: Coffee },
  pantry: { label: 'PANTRY', icon: ShoppingCart },
};

const CATEGORY_ORDER = ['staple', 'protein', 'legume', 'vegetable', 'salad', 'fruit', 'beverage', 'pantry'];

export default function HomePage() {
  const {
    foodItems,
    meals,
    currentDecision,
    makeNewDecision,
    acceptCurrentDecision,
    rejectCurrentDecisionNotToday,
    rejectCurrentDecisionNotAvailable,
    settings,
    updateSettings,
    dailyPlan,
    generatePlan,
    regenerateSlot,
    isLoaded,
  } = useFoodStore();

  const [step, setStep] = useState<Step>('type');
  const [selectedMealType, setSelectedMealType] = useState<MealType>('dinner');
  const [selectedFoodIds, setSelectedFoodIds] = useState<Set<string>>(new Set());
  const [isRevealing, setIsRevealing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(CATEGORY_ORDER));
  const [showAcceptedToast, setShowAcceptedToast] = useState(false);

  const filteredFoodItems = useMemo(() => {
    if (!searchQuery.trim()) return foodItems;
    const q = searchQuery.toLowerCase();
    return foodItems.filter((f) => f.name.toLowerCase().includes(q));
  }, [foodItems, searchQuery]);

  const groupedFoods = useMemo(() => {
    const groups: Record<string, typeof foodItems> = {};
    CATEGORY_ORDER.forEach((cat) => { groups[cat] = []; });
    filteredFoodItems.forEach((item) => {
      if (groups[item.category]) groups[item.category].push(item);
    });
    return groups;
  }, [filteredFoodItems]);

  const toggleFood = (id: string) => {
    setSelectedFoodIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllVisible = () => {
    const visibleIds = filteredFoodItems.map((f) => f.id);
    const allSelected = visibleIds.every((id) => selectedFoodIds.has(id));
    if (allSelected) {
      setSelectedFoodIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedFoodIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const clearSelection = () => setSelectedFoodIds(new Set());

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const handleGenerate = () => {
    setIsRevealing(true);
    setStep('result');
    const customIds = selectedFoodIds.size > 0 ? Array.from(selectedFoodIds) : undefined;
    makeNewDecision({ mealType: selectedMealType, customAvailableFoodIds: customIds });
  };

  const handleRevealComplete = () => {
    setIsRevealing(false);
    setStep('result');
  };

  const handleCookThis = (hadLeftovers: boolean) => {
    acceptCurrentDecision(hadLeftovers);
    setShowAcceptedToast(true);
    setTimeout(() => setShowAcceptedToast(false), 4000);
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
    const next = !settings.keepItEasyDefault;
    updateSettings({ keepItEasyDefault: next });
    const customIds = selectedFoodIds.size > 0 ? Array.from(selectedFoodIds) : undefined;
    makeNewDecision({ mealType: selectedMealType, customAvailableFoodIds: customIds, keepItEasy: next });
  };

  const handleGenerateDay = () => {
    generatePlan();
    setStep('fullday');
  };

  const inStockCount = foodItems.filter((f) => f.inStock).length;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between">
        <Header />
        <main className="container-editorial py-24 text-center">
          <p className="font-serif italic text-xl text-[#6E6A61]">Loading your pantry...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col pb-20 md:pb-0">
      <Header />

      <main className="container-editorial py-8 sm:py-12 md:py-20 max-w-4xl w-full flex-1 space-y-8">
        {/* Step 1: What do you want to eat? */}
        {step === 'type' && (
          <>
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-semibold text-[#8A9B84] block">
                DISHCISION
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#171714] font-normal leading-tight">
                What do you want to eat?
              </h1>
              <p className="font-serif italic text-lg sm:text-xl text-[#6E6A61]">
                Choose a meal time, then tell us what you have.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {([
                { type: 'breakfast' as MealType, label: 'Breakfast', icon: Coffee, desc: 'Morning meal' },
                { type: 'lunch' as MealType, label: 'Lunch', icon: Sun, desc: 'Midday meal' },
                { type: 'dinner' as MealType, label: 'Dinner', icon: Moon, desc: 'Evening meal' },
                { type: 'any' as MealType, label: 'Full Day', icon: CalendarDays, desc: 'Plan all three' },
              ]).map(({ type, label, icon: Icon, desc }) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedMealType(type);
                    if (type === 'any') {
                      handleGenerateDay();
                    } else {
                      setStep('foods');
                    }
                  }}
                  className="p-6 bg-white border border-[#DCD5C9] rounded-[2px] text-left space-y-3 hover:border-[#8A9B84] transition-colors cursor-pointer group"
                >
                  <Icon className="w-5 h-5 text-[#8A9B84] group-hover:text-[#54684E] transition-colors" />
                  <div>
                    <span className="font-serif text-lg text-[#171714] font-medium block">{label}</span>
                    <span className="text-xs text-[#6E6A61] font-sans">{desc}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-4 text-xs font-sans text-[#6E6A61]">
              <span>{foodItems.length} foods in library</span>
              <span className="text-[#DCD5C9]">·</span>
              <span>{inStockCount} available now</span>
              <span className="text-[#DCD5C9]">·</span>
              <span>{meals.length} meals</span>
            </div>
          </>
        )}

        {/* Step 2: What do you have available? */}
        {step === 'foods' && (
          <>
            <div className="space-y-2">
              <button onClick={() => setStep('type')} className="text-xs font-sans text-[#8A9B84] hover:underline cursor-pointer">
                ← Back to meal type
              </button>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#171714] font-normal">
                What do you have?
              </h2>
              <p className="text-sm text-[#6E6A61] font-sans">
                Select the foods you have available, or skip to use all in-stock items.
              </p>
            </div>

            {/* Search + Controls */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A61]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search foods..."
                  className="w-full pl-10 pr-4 min-h-11 border border-[#DCD5C9] bg-white text-sm text-[#171714] rounded-[2px] focus:outline-none focus:border-[#8A9B84]"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6A61] hover:text-[#171714] cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={toggleAllVisible} className="text-xs font-sans text-[#8A9B84] hover:underline cursor-pointer">
                    Select All
                  </button>
                  {selectedFoodIds.size > 0 && (
                    <>
                      <span className="text-[#DCD5C9]">·</span>
                      <button onClick={clearSelection} className="text-xs font-sans text-[#6E6A61] hover:underline cursor-pointer">
                        Clear ({selectedFoodIds.size} selected)
                      </button>
                    </>
                  )}
                </div>
                <span className="text-xs text-[#6E6A61] font-sans">
                  {selectedFoodIds.size > 0 ? `${selectedFoodIds.size} selected` : 'Using all in-stock'}
                </span>
              </div>
            </div>

            {/* Food grid */}
            <div className="space-y-3">
              {CATEGORY_ORDER.map((cat) => {
                const items = groupedFoods[cat];
                if (items.length === 0) return null;
                const config = CATEGORY_CONFIG[cat];
                const Icon = config?.icon || Package;
                const isExpanded = expandedCategories.has(cat);

                return (
                  <div key={cat} className="bg-white border border-[#DCD5C9] rounded-[2px] overflow-hidden">
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-[#F7F3EC]/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#6E6A61]" />
                        <span className="text-xs uppercase tracking-[0.15em] font-sans font-semibold text-[#171714]">
                          {config?.label || cat}
                        </span>
                        <Badge variant="muted" size="sm">{items.length}</Badge>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#6E6A61]" /> : <ChevronDown className="w-4 h-4 text-[#6E6A61]" />}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-[#DCD5C9] p-3 flex flex-wrap gap-2">
                        {items.map((item) => {
                          const isSelected = selectedFoodIds.has(item.id);
                          return (
                            <button
                              key={item.id}
                              onClick={() => toggleFood(item.id)}
                              className={`px-3 py-1.5 text-xs font-sans rounded-[2px] border transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#8A9B84] border-[#8A9B84] text-white'
                                  : item.inStock
                                    ? 'bg-white border-[#DCD5C9] text-[#171714] hover:border-[#8A9B84]'
                                    : 'bg-[#F7F3EC] border-[#DCD5C9] text-[#6E6A61] line-through'
                              }`}
                            >
                              {item.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Generate button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button variant="primary" size="lg" onClick={handleGenerate} className="gap-2 flex-1">
                <Sparkles className="w-4 h-4 text-[#8A9B84]" />
                <span className="hidden sm:inline">MAKE MY DISHCISION</span>
                <span className="sm:hidden">DECIDE FOR ME</span>
              </Button>
              <Button variant="outline" size="lg" onClick={handleGenerateDay} className="gap-2">
                <CalendarDays className="w-4 h-4" />
                <span className="hidden sm:inline">FULL DAY</span>
                <span className="sm:hidden">PLAN ALL DAY</span>
              </Button>
            </div>
          </>
        )}

        {/* Step 3: Result */}
        {(step === 'result' || (step === 'foods' && isRevealing)) && (
          <>
            {isRevealing ? (
              <TheatricalReveal onComplete={handleRevealComplete} durationMs={1100} />
            ) : currentDecision ? (
              <>
                <button onClick={() => setStep('foods')} className="text-xs font-sans text-[#8A9B84] hover:underline cursor-pointer">
                  ← Back to food selection
                </button>
                {showAcceptedToast && (
                  <div className="p-4 bg-[#8A9B84]/15 border border-[#8A9B84]/40 rounded-[2px] flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#54684E] shrink-0" />
                    <span className="text-xs font-sans font-medium text-[#171714]">
                      Meal logged! Head to the Plan page to build your full day.
                    </span>
                  </div>
                )}
                <MealResultCard
                  decision={currentDecision}
                  onCookThis={handleCookThis}
                  onDishcisionAgain={handleGenerate}
                  onNotToday={handleNotToday}
                  onNotAvailable={handleNotAvailable}
                  onToggleKeepItEasy={handleToggleKeepItEasy}
                  isKeepItEasyActive={settings.keepItEasyDefault}
                />
              </>
            ) : (
              <div className="p-12 bg-white border border-[#DCD5C9] rounded-[2px] text-center space-y-4">
                <h2 className="font-serif text-2xl text-[#171714]">Ready to decide?</h2>
                <Button variant="primary" size="hero" onClick={handleGenerate} className="gap-2">
                  <Sparkles className="w-4 h-4 text-[#8A9B84]" />
                  MAKE MY DISHCISION
                </Button>
              </div>
            )}
          </>
        )}

        {/* Full Day Result */}
        {step === 'fullday' && dailyPlan && (
          <>
            <button onClick={() => setStep('type')} className="text-xs font-sans text-[#8A9B84] hover:underline cursor-pointer">
              ← Back to meal type
            </button>
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-semibold text-[#8A9B84] block">
                TODAY&apos;S MEAL PLAN
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#171714] font-normal">
                Your Full Day
              </h2>
            </div>

            <div className="space-y-3">
              {(['breakfast', 'lunch', 'dinner'] as const).map((slot) => {
                const planSlot = dailyPlan[slot];
                const meal = planSlot?.meal;
                if (!meal) return null;
                return (
                  <div key={slot} className="bg-white border border-[#DCD5C9] rounded-[2px] p-4 sm:p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-[#8A9B84] font-semibold font-sans">
                        {slot}
                      </span>
                      <button
                        onClick={() => regenerateSlot(slot)}
                        className="text-xs font-sans text-[#8A9B84] hover:underline cursor-pointer"
                      >
                        Regenerate
                      </button>
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl text-[#171714] font-medium">
                      {meal.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {meal.plate.map((p, i) => (
                        <span key={i} className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#F7F3EC] border border-[#DCD5C9] text-[#171714] rounded-[2px] font-medium">
                          {p.role}: {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button variant="primary" size="lg" onClick={() => { generatePlan(); }} className="gap-2 flex-1">
                <Sparkles className="w-4 h-4 text-[#8A9B84]" />
                <span className="hidden sm:inline">REGENERATE ENTIRE DAY</span>
                <span className="sm:hidden">REGENERATE ALL</span>
              </Button>
              <Link href="/app/plan" className="flex-1">
                <Button variant="outline" size="lg" className="w-full gap-2">
                  <Utensils className="w-4 h-4" />
                  VIEW IN PLANNER
                </Button>
              </Link>
            </div>
          </>
        )}

        {/* Navigation links */}
        <div className="border-t border-[#DCD5C9] pt-6 flex flex-wrap gap-4 text-xs font-sans">
          <Link href="/app/my-food" className="text-[#8A9B84] hover:underline">My Foods</Link>
          <Link href="/app/plan" className="text-[#8A9B84] hover:underline">Plan</Link>
          <Link href="/app/shopping" className="text-[#8A9B84] hover:underline">Shopping</Link>
          <Link href="/how-it-works" className="text-[#6E6A61] hover:underline">How It Works</Link>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
