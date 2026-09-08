'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFoodStore } from '@/lib/store/use-food-store';
import { RefreshCw, Lock, Unlock, ShoppingBag, Sparkles } from 'lucide-react';

export default function PlanPage() {
  const {
    dailyPlan,
    generatePlan,
    regenerateSlot,
    toggleLockSlot,
    isLoaded,
  } = useFoodStore();

  useEffect(() => {
    if (isLoaded && !dailyPlan) {
      generatePlan();
    }
  }, [isLoaded, dailyPlan, generatePlan]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between">
        <Header />
        <main className="container-editorial py-32 text-center">
          <p className="font-serif italic text-2xl text-[#6E6A61]">Assembling 24-hour cadence...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const slots = dailyPlan
    ? [
        { type: 'breakfast' as const, label: 'Breakfast', slot: dailyPlan.breakfast },
        { type: 'lunch' as const, label: 'Lunch', slot: dailyPlan.lunch },
        { type: 'dinner' as const, label: 'Dinner', slot: dailyPlan.dinner },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between pb-24 lg:pb-0">
      <Header />

      <main className="container-editorial py-10 sm:py-14 md:py-20 max-w-4xl space-y-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8A9B84] block">
              24-hour cadence
            </span>
            <h1 className="font-hero text-3xl sm:text-5xl text-[#171714]">
              Today&apos;s Meal Plan
            </h1>
            <p className="font-serif italic text-lg text-[#6E6A61]">
              Breakfast, lunch &amp; dinner — no ingredient repetition.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" size="md" onClick={() => generatePlan()} className="gap-2 flex-1 sm:flex-none">
              <RefreshCw className="w-4 h-4" /> Regenerate All
            </Button>
            <Link href="/app/shopping" className="flex-1 sm:flex-none">
              <Button variant="primary" size="md" className="gap-2 w-full">
                <ShoppingBag className="w-4 h-4" /> Shopping List
              </Button>
            </Link>
          </div>
        </div>

        {slots.length > 0 ? (
          <div className="space-y-4">
            {slots.map(({ type, label, slot }) => (
              <div key={type} className="card-modern p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-[#DCD5C9]/60 pb-4">
                  <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                    <span className="font-serif text-lg font-semibold text-[#171714]">
                      {label}
                    </span>
                    {slot.isLeftover && <Badge variant="terracotta" size="sm">LEFTOVER</Badge>}
                    {slot.isLocked && <Badge variant="muted" size="sm">LOCKED</Badge>}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleLockSlot(type)}
                      className="p-2.5 text-[#6E6A61] hover:text-[#171714] transition-colors rounded-xl border border-[#DCD5C9] bg-white cursor-pointer"
                      title={slot.isLocked ? 'Unlock slot' : 'Lock slot'}
                    >
                      {slot.isLocked ? <Lock className="w-4 h-4 text-[#8A9B84]" /> : <Unlock className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => regenerateSlot(type)}
                      disabled={slot.isLocked}
                      className="p-2.5 text-[#6E6A61] hover:text-[#171714] disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-xl border border-[#DCD5C9] bg-white cursor-pointer"
                      title="Regenerate this slot"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#171714] font-medium">
                    {slot.meal.name}
                  </h3>
                  {slot.meal.description && (
                    <p className="text-sm text-[#6E6A61] font-sans leading-relaxed">
                      {slot.meal.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {slot.meal.plate.map((item, i) => (
                      <span key={i} className="text-xs font-medium px-3 py-1.5 bg-[#F7F3EC] border border-[#DCD5C9] text-[#171714] rounded-full">
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-modern p-12 text-center space-y-5">
            <h2 className="font-hero text-3xl text-[#171714]">Nothing planned yet.</h2>
            <p className="text-sm text-[#6E6A61] flex justify-center">
              Generate a balanced 24-hour cadence connecting breakfast, lunch, and dinner.
            </p>
            <Button variant="primary" size="lg" onClick={() => generatePlan()} className="gap-2">
              <Sparkles className="w-4 h-4" /> Plan My Day
            </Button>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
