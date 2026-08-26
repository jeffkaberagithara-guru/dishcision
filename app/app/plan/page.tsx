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
        <main className="container-editorial py-24 text-center">
          <p className="font-serif italic text-xl text-[#6E6A61]">
            Assembling 24-hour cadence...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const slots = dailyPlan
    ? [
        { type: 'breakfast' as const, label: '01 · BREAKFAST', slot: dailyPlan.breakfast },
        { type: 'lunch' as const, label: '02 · LUNCH', slot: dailyPlan.lunch },
        { type: 'dinner' as const, label: '03 · DINNER', slot: dailyPlan.dinner },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between pb-20 md:pb-0">
      <Header />

      <main className="container-editorial py-12 md:py-20 max-w-4xl space-y-8">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-semibold text-[#8A9B84] block">
              24-HOUR WHOLE-DAY CADENCE
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#171714]">
              Today&apos;s Meal Cadence
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-[#6E6A61]">
              Breakfast, Lunch, and Dinner synchronized without ingredient repetition.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => generatePlan()}
              className="gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              REGENERATE ALL
            </Button>
            <Link href="/app/shopping">
              <Button variant="primary" size="md" className="gap-2">
                <ShoppingBag className="w-3.5 h-3.5" />
                SHOPPING LIST
              </Button>
            </Link>
          </div>
        </div>

        {/* 3-Meal Cadence Cards */}
        {slots.length > 0 ? (
          <div className="space-y-4 pt-2">
            {slots.map(({ type, label, slot }) => (
              <div
                key={type}
                className="bg-white border border-[#DCD5C9] p-6 md:p-8 rounded-[2px] space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-[#DCD5C9]/60 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-[#8A9B84] font-sans font-semibold">
                      {label}
                    </span>
                    {slot.isLeftover && <Badge variant="terracotta">LEFTOVER REUTILIZED</Badge>}
                    {slot.isLocked && <Badge variant="muted">LOCKED</Badge>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleLockSlot(type)}
                      className="p-1.5 text-[#6E6A61] hover:text-[#171714] transition-colors rounded-[2px] border border-[#DCD5C9] bg-white cursor-pointer"
                      title={slot.isLocked ? 'Unlock slot' : 'Lock slot'}
                    >
                      {slot.isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-[#8A9B84]" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => regenerateSlot(type)}
                      disabled={slot.isLocked}
                      className="p-1.5 text-[#6E6A61] hover:text-[#171714] disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-[2px] border border-[#DCD5C9] bg-white cursor-pointer"
                      title="Regenerate this slot"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl md:text-3xl text-[#171714] font-normal">
                      {slot.meal.name}
                    </h3>
                    {slot.meal.description && (
                      <p className="text-xs text-[#6E6A61] font-sans">
                        {slot.meal.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {slot.meal.plate.map((item, i) => (
                      <span
                        key={i}
                        className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-[#F7F3EC] border border-[#DCD5C9] text-[#171714] rounded-[2px] font-medium"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 bg-white border border-[#DCD5C9] rounded-[2px] text-center space-y-4">
            <h2 className="font-serif text-3xl text-[#171714]">Nothing planned yet.</h2>
            <p className="text-sm text-[#6E6A61]">
              Generate a balanced 24-hour cadence connecting breakfast, lunch, and dinner.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => generatePlan()}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              PLAN MY DAY
            </Button>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
